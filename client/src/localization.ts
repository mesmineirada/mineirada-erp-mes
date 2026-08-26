export const visibleFieldLabels: Record<string, string> = {
  code: "Código", name: "Nome", category: "Categoria", unit: "Unidade", cost: "Custo unitário", min: "Estoque mínimo",
  price: "Preço de venda", shelf: "Validade", temp: "Temperatura de armazenamento", status: "Situação", sector: "Setor",
  brand: "Marca/modelo", power: "Potência", matricula: "Matrícula", cpf: "CPF", position: "Cargo", shift: "Turno",
  cnpj: "CNPJ", phone: "Telefone", city: "Cidade", credit: "Limite de crédito", contact: "Contato", barcode: "Código de barras",
  priority: "Prioridade", deadline: "Prazo", customer: "Cliente", supplier: "Fornecedor", product: "Produto", quantity: "Quantidade",
  total: "Total", value: "Valor", location: "Local de armazenamento", lot: "Lote", date: "Data", notes: "Observações"
};

export const TECHNICAL_GLOSSARY = {
  OP: { label: "OP", meaning: "Ordem de Produção", description: "Documento que organiza o que será produzido, em qual quantidade e dentro de qual prazo." },
  MP: { label: "MP", meaning: "Matéria-prima", description: "Material ou insumo utilizado como base para fabricar um produto." },
  BOM: { label: "BOM", meaning: "Lista de materiais", description: "Relação de matérias-primas, suprimentos e quantidades necessárias para produzir um item." },
  MES: { label: "MES", meaning: "Sistema de Execução da Manufatura", description: "Módulo que acompanha e registra a execução das operações industriais." }
} as const;

export type TechnicalTerm = keyof typeof TECHNICAL_GLOSSARY;

export const ENGLISH_UI_TERMS = [
  "Code", "Name", "Category", "Unit", "Unit cost", "Minimum stock", "Status", "Login", "Search", "Settings",
  "Save", "Cancel", "Delete", "Edit", "Loading", "Success", "Error", "Customer", "Supplier", "Product"
] as const;
