export type InventoryMaterial = { code?: string; name?: string; stock?: string | number; unit?: string };
export type RecipeIngredient = { materialCode?: string; materialName?: string; quantity?: string | number; unit?: string };
export type InventoryRecipe = { product?: string; productCode?: string; productName?: string; code?: string; name?: string; batchSize?: string | number; ingredients?: RecipeIngredient[] };

export function normalizeInventoryKey(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function findRecipeForProduct(recipes: InventoryRecipe[], product: unknown) {
  const target = normalizeInventoryKey(product);
  if (!target) return undefined;
  return recipes.find((recipe) =>
    [recipe.product, recipe.productCode, recipe.productName]
      .map(normalizeInventoryKey)
      .filter(Boolean)
      .includes(target),
  );
}

export function findMaterialForIngredient(materials: InventoryMaterial[], ingredient: RecipeIngredient) {
  const keys = [ingredient.materialCode, ingredient.materialName].map(normalizeInventoryKey).filter(Boolean);
  if (!keys.length) return undefined;
  return materials.find((material) =>
    [material.code, material.name]
      .map(normalizeInventoryKey)
      .filter(Boolean)
      .some((key) => keys.includes(key)),
  );
}

export function numericInventoryQuantity(value: unknown) {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function recipeRequirements(recipe: InventoryRecipe, orderQuantity: unknown) {
  const batchSize = numericInventoryQuantity(recipe.batchSize);
  const quantity = numericInventoryQuantity(orderQuantity);
  const multiplier = batchSize > 0 ? quantity / batchSize : 1;
  return (Array.isArray(recipe.ingredients) ? recipe.ingredients : [])
    .map((ingredient) => ({ ...ingredient, required: numericInventoryQuantity(ingredient.quantity) * multiplier }))
    .filter((ingredient) => ingredient.required > 0);
}

export function isMaterialBelowMinimum(material: InventoryMaterial & { min?: string | number }, balance: unknown) {
  const minimum = numericInventoryQuantity(material.min);
  return minimum > 0 && numericInventoryQuantity(balance) < minimum;
}
