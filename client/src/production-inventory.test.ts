import { describe, expect, it } from "vitest";
import {
  findMaterialForIngredient,
  findRecipeForProduct,
  findRecipeForProductionOrder,
  isMaterialBelowMinimum,
  normalizeInventoryKey,
  recipeRequirements,
} from "./production-inventory";

describe("regras de estoque e ficha técnica", () => {
  it("normaliza acentos e espaços para vincular produto e receita", () => {
    expect(normalizeInventoryKey("  Pão de Queijo  ")).toBe("pao de queijo");
    expect(findRecipeForProduct([{ productCode: "PAO-001", name: "Receita" }], "pão-001")?.name).toBe("Receita");
  });

  it("vincula por código estável da receita e aceita nome ou código do produto", () => {
    const recipes = [
      { code: "REC-PAO", product: "Pão de Queijo Mineirada 1kg", productCode: "PAO-001", name: "Massa padrão" },
      { code: "REC-PAO-ALT", product: "Pão de Queijo Mineirada 1kg", productCode: "PAO-001", name: "Massa alternativa" },
      { code: "REC-OUTRA", product: "Outro produto", name: "Outra receita" },
    ];
    expect(findRecipeForProduct(recipes, ["PAO-001", "Pão de Queijo Mineirada 1kg"])?.code).toBe("REC-PAO");
    expect(findRecipeForProductionOrder(recipes, ["PAO-001", "Pão de Queijo Mineirada 1kg"], "REC-PAO-ALT")?.code).toBe("REC-PAO-ALT");
    expect(findRecipeForProductionOrder(recipes, "Outro produto", "REC-PAO")?.code).toBe("REC-OUTRA");
  });

  it("calcula o consumo proporcional ao tamanho do lote", () => {
    const requirements = recipeRequirements({ batchSize: "100", ingredients: [{ materialCode: "POLVILHO", quantity: "40", unit: "kg" }] }, "250");
    expect(requirements[0].required).toBe(100);
  });

  it("encontra a matéria-prima por código ou nome e detecta saldo abaixo do mínimo", () => {
    const materials = [{ code: "MP-01", name: "Polvilho", stock: "20", unit: "kg" }];
    expect(findMaterialForIngredient(materials, { materialName: "polvilho" })?.code).toBe("MP-01");
    expect(isMaterialBelowMinimum({ ...materials[0], min: "25" }, 20)).toBe(true);
  });
});
