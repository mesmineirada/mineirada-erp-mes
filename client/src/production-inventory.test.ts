import { describe, expect, it } from "vitest";
import {
  findMaterialForIngredient,
  findRecipeForProduct,
  isMaterialBelowMinimum,
  normalizeInventoryKey,
  recipeRequirements,
} from "./production-inventory";

describe("regras de estoque e ficha técnica", () => {
  it("normaliza acentos e espaços para vincular produto e receita", () => {
    expect(normalizeInventoryKey("  Pão de Queijo  ")).toBe("pao de queijo");
    expect(findRecipeForProduct([{ productCode: "PAO-001", name: "Receita" }], "pão-001")?.name).toBe("Receita");
  });

  it("usa o nome da receita como vínculo legado quando o produto é genérico", () => {
    const recipe = { product: "Produto cadastrado", name: "Pão de Queijo Mineirada 1KG" };
    expect(findRecipeForProduct([recipe], "PÃO DE QUEIJO MINEIRADA 1KG")?.name).toBe("Pão de Queijo Mineirada 1KG");
  });

  it("considera aliases canônicos persistidos na OP", () => {
    const recipe = { productCode: "PAO-001", productName: "Pão de Queijo Mineirada 1 KG", name: "Receita padrão" };
    expect(findRecipeForProduct([recipe], { product: "PÃO DE QUEIJO MINEIRADA 1KG", productCode: "PAO-001" })?.name).toBe("Receita padrão");
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
