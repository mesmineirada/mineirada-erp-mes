from pathlib import Path

path = Path('/home/ubuntu/mineirada-replica/client/src/App.tsx')
text = path.read_text()
if 'function AuthenticatedRouter' in text:
    print('router already exists')
    raise SystemExit(0)

router = r'''function AuthenticatedRouter({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [location] = useLocation(); const [data, setData] = usePersistedData(); const common = { data, setData } as const; let content: ReactNode;
  if (location === "/") content = <Dashboard />;
  else if (location === "/manual") content = <ManualPage />;
  else if (location === "/pedidos") content = <OrdersPage {...common} />;
  else if (location === "/estoque") content = <InventoryOverview data={data} />;
  else if (location === "/estoque/visao-geral") content = <StockHub data={data} />;
  else if (location === "/almoxarifado/requisicoes") content = <RequisitionsPage data={data} />;
  else if (location === "/estoque/lotes") content = <LotsPage {...common} />;
  else if (location === "/monitor") content = <MonitorPage data={data} />;
  else if (location.startsWith("/monitor/")) content = <MonitorPage sector={location.split("/")[2]} data={data} />;
  else if (location.startsWith("/apontamento/")) content = <ApontamentoPage sector={location.split("/")[2]} data={data} />;
  else if (location === "/rastreabilidade") content = <RastreabilidadePage data={data} />;
  else if (location === "/relatorios") content = <ReportsPage />;
  else if (location === "/operador") content = <OperatorPage data={data} />;
  else if (location === "/vendas/faturamento") content = <PlaceholderPage title="Faturamento" description="Pedidos prontos para faturar" construction />;
  else if (location === "/vendas/pedidos-faturados") content = <PlaceholderPage title="Pedidos Faturados" description="Histórico de pedidos faturados" />;
  else if (location === "/producao/ordens") content = <PlaceholderPage title="Ordens de Produção" description="Planeje e acompanhe as ordens da fábrica" />;
  else if (location === "/producao/fluxo") content = <PlaceholderPage title="Fluxo de Produção" description="Acompanhe o fluxo por etapa e setor" />;
  else if (location.startsWith("/cadastros/clientes")) content = <CrudPage kind="Cliente" title="Clientes" description="Cadastros de clientes e condições comerciais" columns={["Código", "Nome", "CNPJ", "Telefone", "Cidade", "Limite Crédito"]} records={data.clients as RecordItem[]} setRecords={(r) => setData({ ...data, clients: r as typeof data.clients })} fields={["code", "name", "cnpj", "phone", "city", "credit"]} />;
  else if (location.startsWith("/cadastros/fornecedores")) content = <CrudPage kind="Fornecedor" title="Fornecedores" description="Cadastros de fornecedores e contatos" columns={["Código", "Nome", "CNPJ", "Telefone", "Cidade", "Contato"]} records={data.suppliers as RecordItem[]} setRecords={(r) => setData({ ...data, suppliers: r as typeof data.suppliers })} fields={["code", "name", "cnpj", "phone", "city", "contact"]} />;
  else if (location.startsWith("/cadastros/produtos")) content = <CrudPage kind="Produto" title="Produtos" description="Produtos acabados e parâmetros de armazenamento" columns={["Código", "Nome", "Categoria", "Unidade", "Preço Venda", "Validade", "Temp. Armazenamento"]} records={data.products as RecordItem[]} setRecords={(r) => setData({ ...data, products: r as typeof data.products })} fields={["code", "name", "category", "unit", "price", "shelf", "temp"]} />;
  else if (location.startsWith("/cadastros/materias-primas")) content = <CrudPage kind="Matéria-prima" title="Matérias-primas" description="Insumos utilizados nas receitas e requisições" columns={["Código", "Nome", "Categoria", "Unidade", "Custo Unit.", "Estoque Atual", "Estoque Mín.", "Status"]} records={data.materials as RecordItem[]} setRecords={(r) => setData({ ...data, materials: r as typeof data.materials })} fields={["code", "name", "category", "unit", "cost", "stock", "min", "status"]} />;
  else if (location.startsWith("/cadastros/maquinas")) content = <CrudPage kind="Máquina" title="Máquinas" description="Equipamentos e disponibilidade dos setores" columns={["Código", "Nome", "Setor", "Marca/Modelo", "Potência", "Status"]} records={data.machines as RecordItem[]} setRecords={(r) => setData({ ...data, machines: r as typeof data.machines })} fields={["code", "name", "sector", "brand", "power", "status"]} />;
  else if (location.startsWith("/cadastros/funcionarios")) content = <CrudPage kind="Funcionário" title="Funcionários" description="Cadastro de colaboradores, cargos, setores e turnos" columns={["Matrícula", "Nome", "CPF", "Cargo", "Setor", "Turno", "Situação"]} records={data.employees as RecordItem[]} setRecords={(r) => setData({ ...data, employees: r as typeof data.employees })} fields={["matricula", "name", "cpf", "position", "sector", "shift", "status"]} />;
  else if (location.startsWith("/cadastros/embalagens") || location === "/estoque/embalagens") content = <CrudPage kind="Embalagem" title="Embalagens" description="Cadastro de embalagens, unidades, custos e estoque mínimo" columns={["Código", "Nome", "Categoria", "Unidade", "Código de Barras", "Custo", "Estoque Mín.", "Situação"]} records={data.packaging as RecordItem[]} setRecords={(r) => setData({ ...data, packaging: r as typeof data.packaging })} fields={["code", "name", "category", "unit", "barcode", "cost", "min", "status"]} />;
  else if (location === "/admin/usuarios") content = <UsersPage />;
  else if (location === "/estoque/movimentacoes") content = <PlaceholderPage title="Movimentações" description="Entradas, baixas e transferências entre setores" />;
  else if (location === "/estoque/materia-prima") content = <PlaceholderPage title="Estoque de Matéria-Prima" description="Fichas e saldos de matéria-prima" />;
  else if (location === "/estoque/acabado") content = <PlaceholderPage title="Câmara Fria" description="Produtos acabados prontos para venda" />;
  else if (location === "/engenharia/receitas") content = <RecipesPage {...common} />;
  else if (location === "/etiquetas") content = <PlaceholderPage title="Etiquetas" description="Impressão de etiquetas de lote e expedição" />;
  else if (location === "/qualidade/checklists") content = <PlaceholderPage title="Checklists" description="Controle de qualidade e inspeções" />;
  else if (location === "/qualidade/nao-conformidades") content = <PlaceholderPage title="Não Conformidades" description="Controle de qualidade e liberação de lotes" />;
  else if (location === "/manutencao") content = <PlaceholderPage title="Manutenção" description="Ordens de manutenção e disponibilidade de máquinas" />;
  else if (location === "/custos") content = <PlaceholderPage title="Custos" description="Custos de produção por produto e etapa" />;
  else if (location === "/auditoria") content = <PlaceholderPage title="Auditoria" description="Eventos e histórico de alterações" />;
  else if (location === "/admin/dados") content = <DataBackupPage />;
  else content = <PlaceholderPage title="Página não encontrada" description="A rota solicitada não foi mapeada." />;
  return <AppLayout user={user} onLogout={onLogout}>{content}</AppLayout>;
}

'''
text = text.replace('export default function App()', router + 'export default function App()', 1)
path.write_text(text)
print('router restored')
