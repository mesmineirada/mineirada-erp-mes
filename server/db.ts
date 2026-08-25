import { eq } from "drizzle-orm";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, packagingItems, products, productionEntries, productionOrders as normalizedProductionOrders, rawMaterials, stockMovements, users, warehouseRequisitions, workspaceState } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) { return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`; }
function verifyPassword(password: string, stored: string) { const [, salt, digest] = stored.split("$"); if (!salt || !digest) return false; const actual = scryptSync(password, salt, 64); const expected = Buffer.from(digest, "hex"); return actual.length === expected.length && timingSafeEqual(actual, expected); }

const LEGACY_ACCOUNTS = [
  { username: "SOUSA", name: "Sousa", profile: "gestor", password: "RGMS1234" },
  { username: "KARITA", name: "Karita", profile: "admin", password: "12345678" },
  { username: "FELIPE", name: "Felipe", profile: "admin", password: "12345678" },
] as const;

export async function loginWithCredentials(username: string, password: string) {
  const db = await getDb(); if (!db) return null;
  const normalized = username.trim().toUpperCase(); const account = LEGACY_ACCOUNTS.find((candidate) => candidate.username === normalized); if (!account || !password) return null;
  const existing = await db.select().from(users).where(eq(users.username, normalized)).limit(1);
  let user = existing[0];
  if (!user) { const inserted = await db.insert(users).values({ openId: `legacy:${normalized}`, username: normalized, passwordHash: hashPassword(account.password), profile: account.profile, name: account.name, loginMethod: "credentials", role: "admin" }).$returningId(); const id = inserted[0]?.id; if (!id) return null; const created = await db.select().from(users).where(eq(users.id, id)).limit(1); user = created[0]; }
  if (!user) return null;
  if (user.profile !== account.profile || user.role !== "admin" || !user.passwordHash) { const passwordHash = user.passwordHash || hashPassword(account.password); await db.update(users).set({ profile: account.profile, role: "admin", passwordHash, loginMethod: "credentials", name: account.name }).where(eq(users.id, user.id)); user = { ...user, profile: account.profile, role: "admin", passwordHash, loginMethod: "credentials", name: account.name }; }
  if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) return null;
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));
  return user;
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getWorkspaceState() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(workspaceState).where(eq(workspaceState.id, 1)).limit(1);
  return result[0];
}

type LegacyRecord = Record<string, unknown>;
const textValue = (record: LegacyRecord, key: string, fallback = "") => String(record[key] ?? fallback).trim();
const numberValue = (record: LegacyRecord, key: string, fallback = "0") => { const value = String(record[key] ?? fallback).replace(",", "."); return /^-?\d+(\.\d+)?$/.test(value) ? value : fallback; };

export async function migrateWorkspaceToNormalized(state: unknown) {
  const db = await getDb();
  if (!db || !state || typeof state !== "object") return { migrated: false, reason: "database-or-state-unavailable" };
  const source = state as Record<string, unknown>;
  const records = (key: string) => Array.isArray(source[key]) ? source[key].filter((item): item is LegacyRecord => Boolean(item && typeof item === "object")) : [];
  const existingProducts = await db.select({ id: products.id }).from(products).limit(1);
  const existingMaterials = await db.select({ id: rawMaterials.id }).from(rawMaterials).limit(1);
  const existingPackaging = await db.select({ id: packagingItems.id }).from(packagingItems).limit(1);
  const existingMovements = await db.select({ id: stockMovements.id }).from(stockMovements).limit(1);
  const existingEntries = await db.select({ id: productionEntries.id }).from(productionEntries).limit(1);
  if (!existingProducts.length) for (const [index, item] of Array.from(records("products").entries())) { const code = textValue(item, "code", `LEGACY-PROD-${index + 1}`); await db.insert(products).values({ code, name: textValue(item, "name", code), category: textValue(item, "category") || null, unit: textValue(item, "unit", "UN"), salePrice: numberValue(item, "price"), shelfLifeDays: Number.parseInt(textValue(item, "shelf"), 10) || null, storageTemperature: textValue(item, "temp") || null, storageLocation: textValue(item, "location") || null, minimumStock: numberValue(item, "min") }); }
  if (!existingMaterials.length) for (const [index, item] of Array.from(records("materials").entries())) { const code = textValue(item, "code", `LEGACY-MP-${index + 1}`); await db.insert(rawMaterials).values({ code, name: textValue(item, "name", code), category: textValue(item, "category") || null, unit: textValue(item, "unit", "KG"), unitCost: numberValue(item, "cost"), minimumStock: numberValue(item, "min"), supplier: textValue(item, "supplier") || null }); }
  if (!existingPackaging.length) for (const [index, item] of Array.from(records("packaging").entries())) { const code = textValue(item, "code", `LEGACY-EMB-${index + 1}`); await db.insert(packagingItems).values({ code, name: textValue(item, "name", code), packagingType: textValue(item, "category", "Embalagem"), size: textValue(item, "size") || null, unit: textValue(item, "unit", "UN"), unitCost: numberValue(item, "cost"), minimumStock: numberValue(item, "min") }); }
  if (!existingMovements.length) { const materials = await db.select().from(rawMaterials); const productRows = await db.select().from(products); const packaging = await db.select().from(packagingItems); for (const [index, item] of Array.from(records("movements").entries())) { const label = textValue(item, "item").toLowerCase(); const material = materials.find((row) => row.name.toLowerCase() === label || row.code.toLowerCase() === label); const product = productRows.find((row) => row.name.toLowerCase() === label || row.code.toLowerCase() === label); const pack = packaging.find((row) => row.name.toLowerCase() === label || row.code.toLowerCase() === label); const match = material ? { itemKind: "rawMaterial" as const, itemId: material.id, unit: material.unit } : product ? { itemKind: "product" as const, itemId: product.id, unit: product.unit } : pack ? { itemKind: "packaging" as const, itemId: pack.id, unit: pack.unit } : null; if (match) await db.insert(stockMovements).values({ externalId: textValue(item, "id", `LEGACY-MOV-${index + 1}`), itemKind: match.itemKind, itemId: match.itemId, movementType: ["Entrada", "Saída", "Ajuste"].includes(textValue(item, "type")) ? textValue(item, "type") as "Entrada" | "Saída" | "Ajuste" : "Ajuste", quantity: numberValue(item, "quantity"), unit: textValue(item, "unit", match.unit), origin: textValue(item, "origin") || null, destination: textValue(item, "destination") || null, lot: textValue(item, "lot") || null, note: textValue(item, "note") || null, occurredAt: new Date(textValue(item, "date") || Date.now()) }); } }
  if (!existingEntries.length) for (const [index, item] of Array.from(records("productionEntries").entries())) await db.insert(productionEntries).values({ externalId: textValue(item, "id", `LEGACY-APT-${index + 1}`), productionOrderNumber: textValue(item, "orderNumber"), sector: textValue(item, "sector", "produção"), received: numberValue(item, "received"), sent: numberValue(item, "sent"), loss: numberValue(item, "loss"), temperature: textValue(item, "temperature") || null, occurredAt: new Date(textValue(item, "date") || Date.now()) });
  return { migrated: true, products: records("products").length, materials: records("materials").length, packaging: records("packaging").length, movements: records("movements").length, productionEntries: records("productionEntries").length };
}

export async function syncNormalizedWorkspace(state: unknown) {
  const db = await getDb(); if (!db || !state || typeof state !== "object") return;
  const source = state as Record<string, unknown>; const records = (key: string) => Array.isArray(source[key]) ? source[key].filter((item): item is LegacyRecord => Boolean(item && typeof item === "object")) : [];
  for (const [index, item] of Array.from(records("products").entries())) { const code = textValue(item, "code", `LEGACY-PROD-${index + 1}`); const values = { code, name: textValue(item, "name", code), category: textValue(item, "category") || null, unit: textValue(item, "unit", "UN"), salePrice: numberValue(item, "price"), shelfLifeDays: Number.parseInt(textValue(item, "shelf"), 10) || null, storageTemperature: textValue(item, "temp") || null, storageLocation: textValue(item, "location") || null, minimumStock: numberValue(item, "min") }; await db.insert(products).values(values).onDuplicateKeyUpdate({ set: values }); }
  for (const [index, item] of Array.from(records("materials").entries())) { const code = textValue(item, "code", `LEGACY-MP-${index + 1}`); const values = { code, name: textValue(item, "name", code), category: textValue(item, "category") || null, unit: textValue(item, "unit", "KG"), unitCost: numberValue(item, "cost"), minimumStock: numberValue(item, "min"), supplier: textValue(item, "supplier") || null }; await db.insert(rawMaterials).values(values).onDuplicateKeyUpdate({ set: values }); }
  for (const [index, item] of Array.from(records("packaging").entries())) { const code = textValue(item, "code", `LEGACY-EMB-${index + 1}`); const values = { code, name: textValue(item, "name", code), packagingType: textValue(item, "category", "Embalagem"), size: textValue(item, "size") || null, unit: textValue(item, "unit", "UN"), unitCost: numberValue(item, "cost"), minimumStock: numberValue(item, "min") }; await db.insert(packagingItems).values(values).onDuplicateKeyUpdate({ set: values }); }
  const materials = await db.select().from(rawMaterials); const productRows = await db.select().from(products); const packaging = await db.select().from(packagingItems);
  for (const [index, item] of Array.from(records("movements").entries())) { const externalId = textValue(item, "id", `LEGACY-MOV-${index + 1}`); const label = textValue(item, "item").toLowerCase(); const material = materials.find((row) => row.name.toLowerCase() === label || row.code.toLowerCase() === label); const product = productRows.find((row) => row.name.toLowerCase() === label || row.code.toLowerCase() === label); const pack = packaging.find((row) => row.name.toLowerCase() === label || row.code.toLowerCase() === label); const match = material ? { itemKind: "rawMaterial" as const, itemId: material.id, unit: material.unit } : product ? { itemKind: "product" as const, itemId: product.id, unit: product.unit } : pack ? { itemKind: "packaging" as const, itemId: pack.id, unit: pack.unit } : null; if (match) { const values = { externalId, itemKind: match.itemKind, itemId: match.itemId, movementType: ["Entrada", "Saída", "Ajuste"].includes(textValue(item, "type")) ? textValue(item, "type") as "Entrada" | "Saída" | "Ajuste" : "Ajuste", quantity: numberValue(item, "quantity"), unit: textValue(item, "unit", match.unit), origin: textValue(item, "origin") || null, destination: textValue(item, "destination") || null, lot: textValue(item, "lot") || null, note: textValue(item, "note") || null, occurredAt: new Date(textValue(item, "date") || Date.now()) }; await db.insert(stockMovements).values(values).onDuplicateKeyUpdate({ set: values }); } }
  for (const [index, item] of Array.from(records("productionEntries").entries())) { const externalId = textValue(item, "id", `LEGACY-APT-${index + 1}`); const values = { externalId, productionOrderNumber: textValue(item, "orderNumber"), sector: textValue(item, "sector", "produção"), received: numberValue(item, "received"), sent: numberValue(item, "sent"), loss: numberValue(item, "loss"), temperature: textValue(item, "temperature") || null, occurredAt: new Date(textValue(item, "date") || Date.now()) }; await db.insert(productionEntries).values(values).onDuplicateKeyUpdate({ set: values }); }
  for (const [index, item] of Array.from(records("productionOrders").entries())) { const number = textValue(item, "number", `LEGACY-OP-${index + 1}`); const productName = textValue(item, "product", "Produto não informado"); const product = productRows.find((row) => row.name.toLowerCase() === productName.toLowerCase() || row.code.toLowerCase() === productName.toLowerCase()); const values = { number, productId: product?.id || null, productName, quantity: numberValue(item, "quantity"), unit: textValue(item, "unit", product?.unit || "UN"), deliveryDate: textValue(item, "delivery") || null, priority: textValue(item, "priority", "Normal"), status: textValue(item, "status", "Planejada"), linkedOrder: textValue(item, "linkedOrder") || null, lot: textValue(item, "lot") || null, notes: textValue(item, "notes") || null, authorizationStatus: textValue(item, "authorizationStatus", "Pendente"), materialSeparated: Boolean(item.materialSeparated) ? 1 : 0, suppliesSeparated: Boolean(item.suppliesSeparated) ? 1 : 0, productionReleased: Boolean(item.productionReleased) ? 1 : 0, finishedStocked: Boolean(item.finishedStocked) ? 1 : 0 }; await db.insert(normalizedProductionOrders).values(values).onDuplicateKeyUpdate({ set: values }); }
  for (const [index, item] of Array.from(records("requisitions").entries())) { const requestNumber = textValue(item, "id", `LEGACY-REQ-${index + 1}`); const itemName = textValue(item, "material", "Item não informado"); const material = materials.find((row) => row.name.toLowerCase() === itemName.toLowerCase() || row.code.toLowerCase() === itemName.toLowerCase()); const pack = packaging.find((row) => row.name.toLowerCase() === itemName.toLowerCase() || row.code.toLowerCase() === itemName.toLowerCase()); const match = material ? { itemKind: "rawMaterial" as const, itemId: material.id, unit: material.unit } : pack ? { itemKind: "packaging" as const, itemId: pack.id, unit: pack.unit } : null; if (match) { const values = { requestNumber, productionOrderId: null, orderNumber: textValue(item, "order") || null, itemKind: match.itemKind, itemId: match.itemId, itemName, quantity: numberValue(item, "quantity"), unit: textValue(item, "unit", match.unit), status: textValue(item, "status", "Pendente"), requestedByUserId: null, requestedByName: textValue(item, "requestedBy") || null, notes: textValue(item, "notes") || null }; await db.insert(warehouseRequisitions).values(values).onDuplicateKeyUpdate({ set: values }); } }
}

export async function authorizeNormalizedProductionOrder(number: string, userId: number) {
  const db = await getDb(); if (!db) throw new Error("Database is not available");
  await db.update(normalizedProductionOrders).set({ authorizationStatus: "Autorizada", materialSeparated: 1, suppliesSeparated: 1, productionReleased: 1, status: "Em produção" }).where(eq(normalizedProductionOrders.number, number));
  return { number, authorizedBy: userId, authorizationStatus: "Autorizada" as const };
}

export async function getNormalizedProducts(query: string, offset: number, limit: number) {
  const db = await getDb(); if (!db) return { rows: [], nextOffset: null };
  const all = await db.select({ id: products.id, code: products.code, name: products.name, unit: products.unit, price: products.salePrice }).from(products).orderBy(products.name);
  const normalized = query.trim().toLowerCase(); const filtered = normalized ? all.filter((item) => `${item.code} ${item.name}`.toLowerCase().includes(normalized)) : all; const rows = filtered.slice(offset, offset + limit); return { rows, nextOffset: offset + limit < filtered.length ? offset + limit : null };
}

export async function saveWorkspaceState(state: string, updatedBy: string, version: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const current = await getWorkspaceState();
  if (current && current.version !== version) {
    const error = new Error("WORKSPACE_VERSION_CONFLICT");
    error.name = "WORKSPACE_VERSION_CONFLICT";
    throw error;
  }
  const nextVersion = (current?.version ?? 0) + 1;
  await db.insert(workspaceState).values({ id: 1, state, updatedBy, version: nextVersion }).onDuplicateKeyUpdate({ set: { state, updatedBy, version: nextVersion } });
  try { await syncNormalizedWorkspace(JSON.parse(state)); } catch (error) { console.error("[Database] Normalized sync failed; workspace JSON preserved", error); }
  return { version: nextVersion, updatedBy };
}

