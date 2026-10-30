import {
  bigint,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/** PostgreSQL enums used by the ERP. Keep these values in sync with the Supabase migration. */
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const stockItemKindEnum = pgEnum("stock_item_kind", ["product", "rawMaterial", "packaging"]);
export const stockMovementTypeEnum = pgEnum("stock_movement_type", ["Entrada", "Saída", "Ajuste"]);
export const warehouseItemKindEnum = pgEnum("warehouse_item_kind", ["rawMaterial", "packaging"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  username: varchar("username", { length: 64 }).unique(),
  passwordHash: text("password_hash"),
  profile: varchar("profile", { length: 32 }).default("user").notNull(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 128 }),
  unit: varchar("unit", { length: 32 }).notNull().default("UN"),
  salePrice: decimal("sale_price", { precision: 14, scale: 3 }).default("0"),
  shelfLifeDays: integer("shelf_life_days"),
  storageTemperature: varchar("storage_temperature", { length: 64 }),
  storageLocation: varchar("storage_location", { length: 128 }),
  minimumStock: decimal("minimum_stock", { precision: 14, scale: 3 }).default("0"),
  active: integer("active").notNull().default(1),
  createdByUserId: integer("created_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const rawMaterials = pgTable("raw_materials", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 128 }),
  unit: varchar("unit", { length: 32 }).notNull().default("KG"),
  unitCost: decimal("unit_cost", { precision: 14, scale: 3 }).default("0"),
  minimumStock: decimal("minimum_stock", { precision: 14, scale: 3 }).default("0"),
  supplier: varchar("supplier", { length: 255 }),
  active: integer("active").notNull().default(1),
  createdByUserId: integer("created_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const packagingItems = pgTable("packaging_items", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  packagingType: varchar("packaging_type", { length: 64 }).notNull(),
  size: varchar("size", { length: 64 }),
  unit: varchar("unit", { length: 32 }).notNull().default("UN"),
  unitCost: decimal("unit_cost", { precision: 14, scale: 3 }).default("0"),
  minimumStock: decimal("minimum_stock", { precision: 14, scale: 3 }).default("0"),
  active: integer("active").notNull().default(1),
  createdByUserId: integer("created_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id", { length: 96 }).notNull().unique(),
  itemKind: stockItemKindEnum("item_kind").notNull(),
  itemId: integer("item_id").notNull(),
  movementType: stockMovementTypeEnum("movement_type").notNull(),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  origin: varchar("origin", { length: 128 }),
  destination: varchar("destination", { length: 128 }),
  lot: varchar("lot", { length: 128 }),
  note: text("note"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  createdByUserId: integer("created_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const productionOrders = pgTable("production_orders", {
  id: serial("id").primaryKey(),
  number: varchar("number", { length: 128 }).notNull().unique(),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull().default("UN"),
  deliveryDate: varchar("delivery_date", { length: 16 }),
  priority: varchar("priority", { length: 32 }).notNull().default("Normal"),
  status: varchar("status", { length: 32 }).notNull().default("Planejada"),
  linkedOrder: varchar("linked_order", { length: 128 }),
  lot: varchar("lot", { length: 128 }),
  notes: text("notes"),
  authorizationStatus: varchar("authorization_status", { length: 32 }).notNull().default("Pendente"),
  materialSeparated: integer("material_separated").notNull().default(0),
  suppliesSeparated: integer("supplies_separated").notNull().default(0),
  productionReleased: integer("production_released").notNull().default(0),
  finishedStocked: integer("finished_stocked").notNull().default(0),
  createdByUserId: integer("created_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const warehouseRequisitions = pgTable("warehouse_requisitions", {
  id: serial("id").primaryKey(),
  requestNumber: varchar("request_number", { length: 128 }).notNull().unique(),
  productionOrderId: integer("production_order_id").references(() => productionOrders.id),
  orderNumber: varchar("order_number", { length: 128 }),
  itemKind: warehouseItemKindEnum("item_kind").notNull(),
  itemId: integer("item_id").notNull(),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("Pendente"),
  requestedByUserId: integer("requested_by_user_id").references(() => users.id),
  requestedByName: varchar("requested_by_name", { length: 128 }),
  requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow().notNull(),
  notes: text("notes"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const productionEntries = pgTable("production_entries", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id", { length: 96 }).notNull().unique(),
  productionOrderNumber: varchar("production_order_number", { length: 128 }).notNull(),
  sector: varchar("sector", { length: 64 }).notNull(),
  received: decimal("received", { precision: 14, scale: 3 }).default("0"),
  sent: decimal("sent", { precision: 14, scale: 3 }).default("0"),
  loss: decimal("loss", { precision: 14, scale: 3 }).default("0"),
  temperature: decimal("temperature", { precision: 8, scale: 2 }),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  createdByUserId: integer("created_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Shared ERP snapshot. The existing Supabase table is jsonb with snake_case columns;
 * keep this mapping stable so no production snapshot needs to be rewritten.
 */
export const workspaceState = pgTable("workspace_state", {
  id: smallint("id").primaryKey(),
  state: jsonb("state").$type<unknown>().notNull(),
  version: bigint("version", { mode: "number" }).notNull().default(1),
  updatedBy: text("updated_by").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type WorkspaceState = typeof workspaceState.$inferSelect;
export type InsertWorkspaceState = typeof workspaceState.$inferInsert;
