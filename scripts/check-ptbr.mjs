import { readFile } from "node:fs/promises";

const files = ["client/src/App.tsx", "client/index.html"];
const forbidden = [
  "Code", "Name", "Category", "Unit", "Unit cost", "Minimum stock", "Status", "Login", "Search", "Settings",
  "Save", "Cancel", "Delete", "Edit", "Loading", "Success", "Error", "Customer", "Supplier", "Product"
];
const findings = [];
for (const file of files) {
  const source = await readFile(file, "utf8");
  for (const term of forbidden) {
    const pattern = new RegExp(`(?:>|")${term}(?:<|")`, "g");
    if (pattern.test(source)) findings.push(`${file}: termo de interface não traduzido: ${term}`);
  }
}
if (findings.length) {
  console.error(findings.join("\n"));
  process.exit(1);
}
console.log("Validação pt-BR aprovada: nenhuma string de interface em inglês catalogada foi encontrada.");
