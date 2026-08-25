import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  username: varchar("username", { length: 64 }).unique(),
  passwordHash: text("passwordHash"),
  profile: varchar("profile", { length: 32 }).default("user").notNull(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 128 }),
  unit: varchar("unit", { length: 32 }).notNull().default("UN"),
  salePrice: decimal("salePrice", { precision: 14, scale: 3 }).default("0"),
  shelfLifeDays: int("shelfLifeDays"),
  storageTemperature: varchar("storageTemperature", { length: 64 }),
  storageLocation: varchar("storageLocation", { length: 128 }),
  minimumStock: decimal("minimumStock", { precision: 14, scale: 3 }).default("0"),
  active: int("active").notNull().default(1),
  createdByUserId: int("createdByUserId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const rawMaterials = mysqlTable("raw_materials", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 128 }),
  unit: varchar("unit", { length: 32 }).notNull().default("KG"),
  unitCost: decimal("unitCost", { precision: 14, scale: 3 }).default("0"),
  minimumStock: decimal("minimumStock", { precision: 14, scale: 3 }).default("0"),
  supplier: varchar("supplier", { length: 255 }),
  active: int("active").notNull().default(1),
  createdByUserId: int("createdByUserId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const packagingItems = mysqlTable("packaging_items", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  packagingType: varchar("packagingType", { length: 64 }).notNull(),
  size: varchar("size", { length: 64 }),
  unit: varchar("unit", { length: 32 }).notNull().default("UN"),
  unitCost: decimal("unitCost", { precision: 14, scale: 3 }).default("0"),
  minimumStock: decimal("minimumStock", { precision: 14, scale: 3 }).default("0"),
  active: int("active").notNull().default(1),
  createdByUserId: int("createdByUserId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const stockMovements = mysqlTable("stock_movements", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 96 }).notNull().unique(),
  itemKind: mysqlEnum("itemKind", ["product", "rawMaterial", "packaging"]).notNull(),
  itemId: int("itemId").notNull(),
  movementType: mysqlEnum("movementType", ["Entrada", "Saída", "Ajuste"]).notNull(),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  origin: varchar("origin", { length: 128 }),
  destination: varchar("destination", { length: 128 }),
  lot: varchar("lot", { length: 128 }),
  note: text("note"),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  createdByUserId: int("createdByUserId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const productionOrders = mysqlTable("production_orders", {
  id: int("id").autoincrement().primaryKey(),
  number: varchar("number", { length: 128 }).notNull().unique(),
  productId: int("productId").references(() => products.id),
  productName: varchar("productName", { length: 255 }).notNull(),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull().default("UN"),
  deliveryDate: varchar("deliveryDate", { length: 16 }),
  priority: varchar("priority", { length: 32 }).notNull().default("Normal"),
  status: varchar("status", { length: 32 }).notNull().default("Planejada"),
  linkedOrder: varchar("linkedOrder", { length: 128 }),
  lot: varchar("lot", { length: 128 }),
  notes: text("notes"),
  authorizationStatus: varchar("authorizationStatus", { length: 32 }).notNull().default("Pendente"),
  materialSeparated: int("materialSeparated").notNull().default(0),
  suppliesSeparated: int("suppliesSeparated").notNull().default(0),
  productionReleased: int("productionReleased").notNull().default(0),
  finishedStocked: int("finishedStocked").notNull().default(0),
  createdByUserId: int("createdByUserId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const warehouseRequisitions = mysqlTable("warehouse_requisitions", {
  id: int("id").autoincrement().primaryKey(),
  requestNumber: varchar("requestNumber", { length: 128 }).notNull().unique(),
  productionOrderId: int("productionOrderId").references(() => productionOrders.id),
  orderNumber: varchar("orderNumber", { length: 128 }),
  itemKind: mysqlEnum("itemKind", ["rawMaterial", "packaging"]).notNull(),
  itemId: int("itemId").notNull(),
  itemName: varchar("itemName", { length: 255 }).notNull(),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("Pendente"),
  requestedByUserId: int("requestedByUserId").references(() => users.id),
  requestedByName: varchar("requestedByName", { length: 128 }),
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  notes: text("notes"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productionEntries = mysqlTable("production_entries", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 96 }).notNull().unique(),
  productionOrderNumber: varchar("productionOrderNumber", { length: 128 }).notNull(),
  sector: varchar("sector", { length: 64 }).notNull(),
  received: decimal("received", { precision: 14, scale: 3 }).default("0"),
  sent: decimal("sent", { precision: 14, scale: 3 }).default("0"),
  loss: decimal("loss", { precision: 14, scale: 3 }).default("0"),
  temperature: decimal("temperature", { precision: 8, scale: 2 }),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  createdByUserId: int("createdByUserId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Estado operacional compartilhado da instalação.
 * O conteúdo é JSON para preservar os módulos existentes durante a migração
 * gradual para tabelas normalizadas, sem criar cópias diferentes por usuário.
 */
export const workspaceState = mysqlTable("workspace_state", {
  id: int("id").primaryKey(),
  state: text("state").notNull(),
  updatedBy: varchar("updatedBy", { length: 128 }).notNull(),
  version: int("version").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WorkspaceState = typeof workspaceState.$inferSelect;
export type InsertWorkspaceState = typeof workspaceState.$inferInsert;
