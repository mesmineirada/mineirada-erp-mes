-- Mineirada ERP: PostgreSQL baseline and API hardening.
-- This migration preserves the existing public.workspace_state row and does not
-- expose normalized tables directly through Supabase Data API roles.

DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.stock_item_kind AS ENUM ('product', 'rawMaterial', 'packaging');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.stock_movement_type AS ENUM ('Entrada', 'Saída', 'Ajuste');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.warehouse_item_kind AS ENUM ('rawMaterial', 'packaging');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.users (
  id serial PRIMARY KEY,
  open_id varchar(64) NOT NULL UNIQUE,
  username varchar(64) UNIQUE,
  password_hash text,
  profile varchar(32) NOT NULL DEFAULT 'user',
  name text,
  email varchar(320),
  login_method varchar(64),
  role public.user_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_signed_in timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id serial PRIMARY KEY,
  code varchar(64) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  category varchar(128),
  unit varchar(32) NOT NULL DEFAULT 'UN',
  sale_price numeric(14,3) DEFAULT '0',
  shelf_life_days integer,
  storage_temperature varchar(64),
  storage_location varchar(128),
  minimum_stock numeric(14,3) DEFAULT '0',
  active integer NOT NULL DEFAULT 1,
  created_by_user_id integer REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.raw_materials (
  id serial PRIMARY KEY,
  code varchar(64) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  category varchar(128),
  unit varchar(32) NOT NULL DEFAULT 'KG',
  unit_cost numeric(14,3) DEFAULT '0',
  minimum_stock numeric(14,3) DEFAULT '0',
  supplier varchar(255),
  active integer NOT NULL DEFAULT 1,
  created_by_user_id integer REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.packaging_items (
  id serial PRIMARY KEY,
  code varchar(64) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  packaging_type varchar(64) NOT NULL,
  size varchar(64),
  unit varchar(32) NOT NULL DEFAULT 'UN',
  unit_cost numeric(14,3) DEFAULT '0',
  minimum_stock numeric(14,3) DEFAULT '0',
  active integer NOT NULL DEFAULT 1,
  created_by_user_id integer REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stock_movements (
  id serial PRIMARY KEY,
  external_id varchar(96) NOT NULL UNIQUE,
  item_kind public.stock_item_kind NOT NULL,
  item_id integer NOT NULL,
  movement_type public.stock_movement_type NOT NULL,
  quantity numeric(14,3) NOT NULL,
  unit varchar(32) NOT NULL,
  origin varchar(128),
  destination varchar(128),
  lot varchar(128),
  note text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_by_user_id integer REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.production_orders (
  id serial PRIMARY KEY,
  number varchar(128) NOT NULL UNIQUE,
  product_id integer REFERENCES public.products(id),
  product_name varchar(255) NOT NULL,
  quantity numeric(14,3) NOT NULL,
  unit varchar(32) NOT NULL DEFAULT 'UN',
  delivery_date varchar(16),
  priority varchar(32) NOT NULL DEFAULT 'Normal',
  status varchar(32) NOT NULL DEFAULT 'Planejada',
  linked_order varchar(128),
  lot varchar(128),
  notes text,
  authorization_status varchar(32) NOT NULL DEFAULT 'Pendente',
  material_separated integer NOT NULL DEFAULT 0,
  supplies_separated integer NOT NULL DEFAULT 0,
  production_released integer NOT NULL DEFAULT 0,
  finished_stocked integer NOT NULL DEFAULT 0,
  created_by_user_id integer REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.warehouse_requisitions (
  id serial PRIMARY KEY,
  request_number varchar(128) NOT NULL UNIQUE,
  production_order_id integer REFERENCES public.production_orders(id),
  order_number varchar(128),
  item_kind public.warehouse_item_kind NOT NULL,
  item_id integer NOT NULL,
  item_name varchar(255) NOT NULL,
  quantity numeric(14,3) NOT NULL,
  unit varchar(32) NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'Pendente',
  requested_by_user_id integer REFERENCES public.users(id),
  requested_by_name varchar(128),
  requested_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.production_entries (
  id serial PRIMARY KEY,
  external_id varchar(96) NOT NULL UNIQUE,
  production_order_number varchar(128) NOT NULL,
  sector varchar(64) NOT NULL,
  received numeric(14,3) DEFAULT '0',
  sent numeric(14,3) DEFAULT '0',
  loss numeric(14,3) DEFAULT '0',
  temperature numeric(8,2),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_by_user_id integer REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- This table already exists in the target Supabase project. IF NOT EXISTS keeps
-- its JSONB payload, singleton row, and existing PostgreSQL constraints intact.
CREATE TABLE IF NOT EXISTS public.workspace_state (
  id smallint PRIMARY KEY CHECK (id = 1),
  state jsonb NOT NULL,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_by text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Keep updated_at behavior previously supplied by MySQL's ON UPDATE clause.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION private.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at := pg_catalog.now();
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.set_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS users_set_updated_at ON public.users;
CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
DROP TRIGGER IF EXISTS products_set_updated_at ON public.products;
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
DROP TRIGGER IF EXISTS raw_materials_set_updated_at ON public.raw_materials;
CREATE TRIGGER raw_materials_set_updated_at BEFORE UPDATE ON public.raw_materials
FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
DROP TRIGGER IF EXISTS packaging_items_set_updated_at ON public.packaging_items;
CREATE TRIGGER packaging_items_set_updated_at BEFORE UPDATE ON public.packaging_items
FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
DROP TRIGGER IF EXISTS production_orders_set_updated_at ON public.production_orders;
CREATE TRIGGER production_orders_set_updated_at BEFORE UPDATE ON public.production_orders
FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
DROP TRIGGER IF EXISTS warehouse_requisitions_set_updated_at ON public.warehouse_requisitions;
CREATE TRIGGER warehouse_requisitions_set_updated_at BEFORE UPDATE ON public.warehouse_requisitions
FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
DROP TRIGGER IF EXISTS workspace_state_set_updated_at ON public.workspace_state;
CREATE TRIGGER workspace_state_set_updated_at BEFORE UPDATE ON public.workspace_state
FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

-- Direct table reads would return the entire shared ERP snapshot. The app uses
-- its authenticated tRPC backend and the existing, separately guarded RPCs.
ALTER TABLE public.workspace_state ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read the shared workspace" ON public.workspace_state;
REVOKE ALL PRIVILEGES ON TABLE public.workspace_state FROM PUBLIC, anon, authenticated;

-- New normalized tables are for the trusted server connection only until the
-- app is explicitly integrated with Supabase Auth and per-user RLS policies.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_entries ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE public.users, public.products, public.raw_materials,
  public.packaging_items, public.stock_movements, public.production_orders,
  public.warehouse_requisitions, public.production_entries
FROM PUBLIC, anon, authenticated;

-- Explicitly preserve the two reviewed RPC access paths: the public tracking
-- function returns only its configured projection; state writes require Supabase
-- Auth and validate role/version inside the SECURITY DEFINER function.
REVOKE ALL PRIVILEGES ON FUNCTION public.public_lookup_order(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_lookup_order(text) TO anon, authenticated;
REVOKE ALL PRIVILEGES ON FUNCTION public.save_workspace_state(jsonb, bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_workspace_state(jsonb, bigint) TO authenticated;

-- Make access opt-in for future objects created by postgres in public. The
-- Dashboard setting "Automatically expose new tables" is also disabled separately.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
