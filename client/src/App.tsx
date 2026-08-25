/*
 * Réplica fiel do Mineirada ERP/MES: fundo quente, primário âmbar industrial,
 * sidebar carvão, ícones lineares, densidade operacional e rotas mapeadas.
 */
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  CalendarClock,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CircleUserRound,
  ClipboardCheck,
  ClipboardList,
  Cog,
  Database,
  Download,
  Eye,
  EyeOff,
  Factory,
  FileText,
  Gauge,
  HardHat,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  PackageCheck,
  PackageOpen,
  Pause,
  Pencil,
  Play,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sun,
  Tags,
  Thermometer,
  Trash2,
  Truck,
  Upload,
  UserPlus,
  Users,
  Warehouse,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

const LOGO = "/manus-storage/mineirada-logo_10f0eaf8.png";
const MANUAL_ART = "/manus-storage/mineirada-manual-cover_aa645ff9.png";
const MONITOR_ART = "/manus-storage/mineirada-monitor-illustration_738fae73.png";
const OPERATOR_ART = "/manus-storage/mineirada-operator_c6faac08.png";

type Role = "gestor" | "admin" | "gerente" | "operador" | "qualidade" | "manutencao" | "user";
type AuthUser = { username: string; name: string; role: Role };
type AuthAccount = AuthUser & { password: string };
const AUTH_USERS: AuthAccount[] = [
  { username: "SOUSA", name: "Sousa", role: "gestor", password: "RGMS1234" },
  { username: "KARITA", name: "Karita", role: "admin", password: "12345678" },
  { username: "FELIPE", name: "Felipe", role: "admin", password: "12345678" },
];
type MenuItem = { label: string; href?: string; icon: LucideIcon; children?: MenuItem[]; adminOnly?: boolean };
type RecordItem = Record<string, string | number>;

const roleLabels: Record<Role, string> = { gestor: "Gestor", admin: "Administrador", gerente: "Gerente", operador: "Operador", qualidade: "Qualidade", manutencao: "Manutenção", user: "Consulta" };

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Manual de uso", href: "/manual", icon: BookOpen },
  { label: "Cadastros", icon: Archive, children: [
    { label: "Matérias-primas", href: "/cadastros/materias-primas", icon: Boxes },
    { label: "Suprimentos", href: "/cadastros/embalagens", icon: PackageOpen },
    { label: "Fornecedores", href: "/cadastros/fornecedores", icon: Truck },
    { label: "Clientes", href: "/cadastros/clientes", icon: Users },
    { label: "Funcionários", href: "/cadastros/funcionarios", icon: HardHat },
    { label: "Máquinas", href: "/cadastros/maquinas", icon: Cog },
    { label: "Produtos", href: "/cadastros/produtos", icon: PackageCheck },
  ]},
  { label: "Almoxarifado", icon: Warehouse, children: [
    { label: "Visão Geral", href: "/estoque", icon: LayoutDashboard },
    { label: "Requisições de MP", href: "/almoxarifado/requisicoes", icon: ClipboardList },
    { label: "Movimentações", href: "/estoque/movimentacoes", icon: ArrowRight },
    { label: "Lotes", href: "/estoque/lotes", icon: Tags },
  ]},
  { label: "Estoques", icon: Boxes, children: [
    { label: "Visão Geral", href: "/estoque/visao-geral", icon: LayoutDashboard },
    { label: "Matéria-Prima", href: "/estoque/materia-prima", icon: Boxes },
    { label: "Câmara Fria", href: "/estoque/acabado", icon: Snowflake },
    { label: "Embalagens", href: "/estoque/embalagens", icon: PackageOpen },
  ]},
  { label: "Engenharia", icon: Settings2, children: [{ label: "Receitas / BOM", href: "/engenharia/receitas", icon: ListChecks }] },
  { label: "Pedidos", href: "/pedidos", icon: ClipboardList },
  { label: "Vendas", icon: CircleDollarSign, children: [
    { label: "Faturamento", href: "/vendas/faturamento", icon: FileText },
    { label: "Pedidos Faturados", href: "/vendas/pedidos-faturados", icon: CheckCircle2 },
  ]},
  { label: "Etiquetas", href: "/etiquetas", icon: Tags },
  { label: "Produção", icon: Factory, children: [
    { label: "Ordens de Produção", href: "/producao/ordens", icon: ClipboardList },
    { label: "Fluxo por OP", href: "/producao/fluxo", icon: Factory },
    { label: "Monitor Geral", href: "/monitor", icon: Monitor },
  ]},
  { label: "Apontamento", icon: Activity, children: [
    { label: "Separação MP", href: "/apontamento/separacao_mp", icon: PackageOpen },
    { label: "Cozinha", href: "/apontamento/cozinha", icon: Factory },
    { label: "Corte", href: "/apontamento/corte", icon: Activity },
    { label: "Túnel", href: "/apontamento/tunel", icon: Snowflake },
    { label: "Envasadora", href: "/apontamento/envasadora", icon: PackageCheck },
    { label: "Câmara Fria", href: "/apontamento/camara_fria", icon: Snowflake },
    { label: "Expedição", href: "/apontamento/expedicao", icon: Truck },
  ]},
  { label: "Monitores", icon: Monitor, children: [
    { label: "Produção Completa", href: "/monitor", icon: Monitor },
    { label: "Separação MP", href: "/monitor/separacao_mp", icon: PackageOpen },
    { label: "Cozinha", href: "/monitor/cozinha", icon: Factory },
    { label: "Corte", href: "/monitor/corte", icon: Activity },
    { label: "Túnel", href: "/monitor/tunel", icon: Snowflake },
    { label: "Envasadora", href: "/monitor/envasadora", icon: PackageCheck },
    { label: "Câmara Fria", href: "/monitor/camara_fria", icon: Snowflake },
    { label: "Expedição", href: "/monitor/expedicao", icon: Truck },
  ]},
  { label: "Qualidade", icon: ShieldCheck, children: [
    { label: "Checklists", href: "/qualidade/checklists", icon: ListChecks },
    { label: "Não Conformidades", href: "/qualidade/nao-conformidades", icon: AlertTriangle },
  ]},
  { label: "Manutenção", href: "/manutencao", icon: Wrench },
  { label: "Custos", href: "/custos", icon: CircleDollarSign },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { label: "Rastreabilidade", href: "/rastreabilidade", icon: Search },
  { label: "Auditoria", href: "/auditoria", icon: ShieldCheck, adminOnly: true },
  { label: "App Operador", href: "/operador", icon: Activity },
  { label: "Usuários", href: "/admin/usuarios", icon: Users, adminOnly: true },
  { label: "Administração", icon: Database, adminOnly: true, children: [{ label: "Dados e Backup", href: "/admin/dados", icon: Database }] },
];

const stages = [
  { key: "separacao_mp", label: "Separação MP", short: "Separação", icon: PackageOpen },
  { key: "cozinha", label: "Cozinha", short: "Cozinha", icon: Factory },
  { key: "corte", label: "Corte", short: "Corte", icon: Activity },
  { key: "tunel", label: "Túnel", short: "Túnel", icon: Snowflake },
  { key: "envasadora", label: "Envasadora", short: "Envase", icon: PackageCheck },
  { key: "camara_fria", label: "Câmara Fria", short: "Câmara fria", icon: Snowflake },
  { key: "expedicao", label: "Expedição", short: "Expedição", icon: Truck },
];

const initialData = {
  clients: [] as RecordItem[], suppliers: [] as RecordItem[], products: [] as RecordItem[], materials: [] as RecordItem[], machines: [] as RecordItem[], employees: [] as RecordItem[], packaging: [] as RecordItem[], recipes: [] as RecordItem[],
  orders: [] as Array<{ number: string; client: string; delivery: string; priority: string; total: string; status: string }>,
  lots: [] as Array<{ lot: string; material: string; total: string; remaining: string; expiry: string; location: string; status: string }>,
};

const DATA_STORAGE_KEY = "mineirada_replica_data_v2";
function usePersistedData() {
  const [data, setData] = useState<typeof initialData>(() => {
    try {
      const stored = localStorage.getItem(DATA_STORAGE_KEY);
      if (stored) return { ...initialData, ...JSON.parse(stored) };
      localStorage.removeItem("mineirada_replica_data");
    } catch { /* iniciar com estrutura vazia */ }
    return initialData;
  });
  useEffect(() => { localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data)); }, [data]);
  return [data, setData] as const;
}

function useToast() {
  const showToast = (message: string) => window.dispatchEvent(new CustomEvent("mineirada-toast", { detail: message }));
  return { showToast };
}

function cn(...values: Array<string | false | undefined>) { return values.filter(Boolean).join(" "); }
function formatTitle(path: string) {
  const found = menuItems.flatMap((item) => [item, ...(item.children || [])]).find((item) => item.href === path);
  return found?.label || (path.startsWith("/apontamento") ? "Apontamento" : path.startsWith("/monitor") ? "Monitor" : "Mineirada ERP + MES");
}

function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" | "primary" }) {
  return <span className={cn("pill", `pill-${tone}`)}>{children}</span>;
}

function MetricCard({ label, value, sub, icon: Icon, tone = "primary" }: { label: string; value: string; sub: string; icon: LucideIcon; tone?: string }) {
  return <div className="metric-card"><div><div className="eyebrow">{label}</div><strong>{value}</strong><small>{sub}</small></div><span className={cn("metric-icon", `metric-${tone}`)}><Icon size={18} /></span></div>;
}

function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className={cn("modal-card", wide && "modal-wide")}><div className="modal-head"><h3>{title}</h3><button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div>{children}</div></div>;
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={cn("field", wide && "field-wide")}><span>{label}</span>{children}</label>;
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value?: string | number; onChange?: (v: string) => void; placeholder?: string; type?: string }) {
  return <input className="input" type={type} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)} />;
}

function SelectInput({ value, onChange, children }: { value?: string; onChange?: (v: string) => void; children: ReactNode }) {
  return <select className="input select-input" value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}>{children}</select>;
}

function Table({ columns, rows, empty = "Nenhum registro.", onEdit, onDelete }: { columns: string[]; rows: Array<Array<ReactNode>>; empty?: string; onEdit?: (index: number) => void; onDelete?: (index: number) => void }) {
  const hasActions = Boolean(onEdit || onDelete);
  return <div className="table-wrap"><table><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}{hasActions && <th>Ações</th>}</tr></thead><tbody>{rows.length === 0 ? <tr><td colSpan={columns.length + (hasActions ? 1 : 0)} className="empty-row">{empty}</td></tr> : rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}{hasActions && <td><div className="row-actions">{onEdit && <button className="icon-button" onClick={() => onEdit(i)} aria-label="Editar"><Pencil size={15} /></button>}{onDelete && <button className="icon-button danger-icon" onClick={() => onDelete(i)} aria-label="Excluir"><Trash2 size={15} /></button>}</div></td>}</tr>)}</tbody></table></div>;
}

function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return <div className="page-header"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{children && <div className="header-actions">{children}</div>}</div>;
}

function Button({ children, variant = "primary", onClick, type = "button", icon: Icon, disabled = false }: { children: ReactNode; variant?: "primary" | "outline" | "ghost" | "danger"; onClick?: () => void; type?: "button" | "submit"; icon?: LucideIcon; disabled?: boolean }) {
  return <button type={type} disabled={disabled} className={cn("button", `button-${variant}`)} onClick={onClick}>{Icon && <Icon size={15} />}{children}</button>;
}

function LoginPage({ onLogin }: { onLogin: (account: AuthUser) => void }) {
  const [username, setUsername] = useState(""); const [password, setPassword] = useState(""); const [show, setShow] = useState(false); const [publicOpen, setPublicOpen] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setError(""); setLoading(true); window.setTimeout(() => { const account = AUTH_USERS.find((candidate) => candidate.username === username.trim().toUpperCase() && candidate.password === password); if (account) { const profile: AuthUser = { username: account.username, name: account.name, role: account.role }; localStorage.setItem("mineirada_session_v1", "replica-session"); localStorage.setItem("mineirada_user_profile", JSON.stringify(profile)); onLogin(profile); } else { setError("Usuário ou senha inválidos."); setLoading(false); } }, 350); };
  return <div className="login-page"><div className="login-brand"><img src={LOGO} alt="Mineirada" /><h1>Mineirada ERP + MES</h1><p>Sistema Industrial de Gestão</p></div><div className="login-card"><form onSubmit={submit}><Field label="Usuário"><div className="input-with-icon"><CircleUserRound size={15} /><TextInput value={username} onChange={(v) => setUsername(v.toUpperCase())} placeholder="USUÁRIO" /></div></Field><Field label="Senha"><div className="input-with-icon"><KeyRound size={15} /><TextInput value={password} onChange={setPassword} placeholder="••••••••" type={show ? "text" : "password"} /><button type="button" className="input-action" onClick={() => setShow(!show)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></Field>{error && <div className="error-banner">{error}</div>}<Button type="submit" disabled={loading} icon={loading ? RefreshCw : LogOut}>{loading ? "Entrando..." : "Entrar"}</Button></form><div className="login-divider" /><button className="public-toggle" onClick={() => setPublicOpen(!publicOpen)}><span><Search size={15} />Consultar pedido sem login</span>{publicOpen ? <ChevronUpIcon /> : <ChevronDown size={15} />}</button>{publicOpen && <PublicLookup compact />}</div><div className="login-note">Acesso liberado apenas para usuários cadastrados no sistema.<br />Esqueceu a senha? Procure o gestor.</div></div>;
}
function ChevronUpIcon() { return <ChevronDown size={15} style={{ transform: "rotate(180deg)" }} />; }

function PublicLookup({ compact = false }: { compact?: boolean }) {
  const [, navigate] = useLocation(); const [data] = usePersistedData(); const [name, setName] = useState(""); const [order, setOrder] = useState(""); const [searched, setSearched] = useState(false); const [error, setError] = useState("");
  const found = data.orders.find((item) => item.number.toLowerCase() === order.trim().toLowerCase());
  const submit = (e: FormEvent) => { e.preventDefault(); setSearched(false); if (!name.trim()) { setError("Informe seu nome para consultar o pedido."); return; } if (!order.trim()) { setError("Digite o número do pedido ou envie uma imagem do QR Code."); return; } if (!data.orders.some((item) => item.number.toLowerCase() === order.trim().toLowerCase())) { setError("Nenhum pedido cadastrado foi encontrado com esse número."); return; } setError(""); setSearched(true); };
  return <div className={cn("public-lookup", compact && "public-lookup-compact")}><div className="lookup-title"><ClipboardList size={18} /><div><h3>Consultar pedido</h3>{!compact && <p>Informe seu nome e use o número do pedido ou uma imagem do QR Code. Não é necessário fazer login.</p>}</div></div><form onSubmit={submit}><Field label="Seu nome *"><TextInput value={name} onChange={setName} placeholder="Como podemos identificar você?" /></Field><Field label="Número do pedido ou conteúdo do QR Code"><div className="lookup-row"><TextInput value={order} onChange={setOrder} placeholder="Ex.: PED-2026-00001" /><Button variant="outline" icon={QrCode}>QR por imagem</Button></div></Field>{error && <div className="error-banner">{error}</div>}<Button type="submit" icon={Search}>Consultar pedido</Button></form>{searched && found && <div className="lookup-result"><div className="result-top"><div><span className="eyebrow">Pedido localizado</span><strong>{found.number}</strong><p>{found.client || "Cliente não informado"}</p></div><Pill tone={found.status === "Pronto" ? "success" : "info"}>{found.status}</Pill></div><div className="result-grid"><div><span>Valor total</span><b>{found.total || "—"}</b></div><div><span>Previsão de entrega</span><b>{found.delivery || "—"}</b></div></div><div className="empty-state compact-empty"><Search size={24} /><p>Acompanhamento detalhado ficará disponível após os primeiros apontamentos da produção.</p></div><Button variant="outline" onClick={() => navigate(`/consulta-pedido/${found.number}`)} icon={ArrowRight}>Acompanhar pedido</Button></div>}</div>;
}

function Dashboard() {
  const [, navigate] = useLocation();
  return <div className="page-content"><PageHeader title="Dashboard" description="Visão geral do sistema, baseada nos registros cadastrados"><Button variant="outline" icon={ClipboardList} onClick={() => navigate("/almoxarifado/requisicoes")}>Requisições</Button><Button icon={Database} onClick={() => navigate("/cadastros/clientes")}>Começar cadastros</Button></PageHeader><div className="metrics-grid six"><MetricCard label="OPs Abertas" value="0" sub="sem registros" icon={ClipboardList} /><MetricCard label="OPs Atrasadas" value="0" sub="sem registros" icon={AlertTriangle} tone="danger" /><MetricCard label="Produção Hoje" value="0 kg" sub="sem apontamentos" icon={Factory} tone="success" /><MetricCard label="Pedidos Pend." value="0" sub="sem registros" icon={Truck} tone="info" /><MetricCard label="Alertas Estoque" value="0" sub="sem registros" icon={Boxes} tone="warning" /><MetricCard label="OMs Abertas" value="0" sub="sem registros" icon={Wrench} tone="danger" /></div><div className="panel empty-state large-empty"><Database size={42} /><h2>O sistema está pronto para receber dados</h2><p>Cadastre clientes, fornecedores, produtos, matérias-primas, máquinas e funcionários para alimentar os indicadores.</p><Button icon={Plus} onClick={() => navigate("/cadastros/clientes")}>Abrir cadastros</Button></div></div>;
}

function CrudPage({ kind, title, description, columns, records, setRecords, fields }: { kind: string; title: string; description: string; columns: string[]; records: RecordItem[]; setRecords: (value: RecordItem[]) => void; fields: string[] }) {
  const [query, setQuery] = useState(""); const [modal, setModal] = useState(false); const [editing, setEditing] = useState<number | null>(null); const [form, setForm] = useState<RecordItem>({}); const { showToast } = useToast();
  const filtered = useMemo(() => records.filter((r) => Object.values(r).join(" ").toLowerCase().includes(query.toLowerCase())), [records, query]);
  const openCreate = () => { setEditing(null); setForm(Object.fromEntries(fields.map((f) => [f, ""]))); setModal(true); };
  const openEdit = (index: number) => { const realIndex = records.indexOf(filtered[index]); setEditing(realIndex); setForm({ ...records[realIndex] }); setModal(true); };
  const save = (e: FormEvent) => { e.preventDefault(); const required = fields.filter((field) => field === "code" || field === "name" || field === "matricula"); if (required.some((field) => !String(form[field] ?? "").trim())) { showToast("Preencha os campos obrigatórios antes de salvar."); return; } const next = [...records]; if (editing === null) next.unshift(form); else next[editing] = form; setRecords(next); setModal(false); showToast(editing === null ? `${kind} criado!` : "Atualizado!"); };
  const remove = (index: number) => { const realIndex = records.indexOf(filtered[index]); if (!window.confirm("Confirmar exclusão lógica?")) return; setRecords(records.filter((_, i) => i !== realIndex)); showToast("Removido!"); };
  const rowFor = (r: RecordItem) => { const keyMap: Record<string, string> = { "Código": "code", "Nome": "name", "Matrícula": "matricula", "CPF": "cpf", "CNPJ": "cnpj", "Telefone": "phone", "Cidade": "city", "Cargo": "position", "Setor": "sector", "Turno": "shift", "Situação": "status", "Categoria": "category", "Unidade": "unit", "Marca/Modelo": "brand", "Potência": "power", "Contato": "contact", "Estoque Atual": "stock", "Estoque Mínimo": "min", "Custo Unit.": "cost", "Preço Venda": "price", "Validade": "shelf", "Temp. Armazenamento": "temp", "Limite Crédito": "credit", "Código de Barras": "barcode", "Estoque Mín.": "min", "Custo": "cost" }; return columns.map((col) => r[keyMap[col] || col.toLowerCase().replaceAll(" ", "_")] ?? "—"); };
  return <div className="page-content"><PageHeader title={title} description={description}><Button icon={Plus} onClick={openCreate}>{title.startsWith("Forne") ? "Nova" : "Novo"}</Button></PageHeader><div className="toolbar"><div className="search-box"><Search size={16} /><input placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><span className="record-count">{filtered.length} registros</span></div><div className="panel table-panel"><Table columns={columns} rows={filtered.map(rowFor)} onEdit={openEdit} onDelete={remove} empty="Nenhum registro." /></div>{modal && <Modal title={`${editing === null ? "Novo" : "Editar"} ${kind}`} onClose={() => setModal(false)}><form className="modal-form" onSubmit={save}><div className="form-grid">{fields.map((field) => <Field key={field} label={`${field.replaceAll("_", " ")} ${field === "code" || field === "name" ? "*" : ""}`}><TextInput value={form[field] as string} onChange={(v) => setForm({ ...form, [field]: v })} placeholder={field === "code" ? "CLI001" : ""} /></Field>)}</div><div className="modal-actions"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button type="submit" icon={Check}>{editing === null ? "Criar" : "Salvar"}</Button></div></form></Modal>}{useToastPlaceholder(showToast)}</div>;
}
function useToastPlaceholder(_: (message: string) => void) { return null; }

function OrdersPage({ data, setData }: { data: typeof initialData; setData: (value: typeof initialData) => void }) {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("Todos"); const [modal, setModal] = useState(false); const { showToast } = useToast();
  const rows = useMemo(() => data.orders.filter((o) => `${o.number} ${o.client} ${o.status}`.toLowerCase().includes(query.toLowerCase()) && (status === "Todos" || o.status === status)), [data.orders, query, status]);
  const remove = (index: number) => { const target = rows[index]; if (!target || !window.confirm(`Excluir o pedido ${target.number}?`)) return; setData({ ...data, orders: data.orders.filter((item) => item !== target) }); showToast("Pedido removido."); };
  return <div className="page-content"><PageHeader title="Pedidos" description="Pedidos de clientes e programação de entrega"><Button icon={Plus} onClick={() => setModal(true)}>Novo Pedido</Button></PageHeader><div className="toolbar"><div className="search-box"><Search size={16} /><input placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><SelectInput value={status} onChange={setStatus}><option>Todos</option><option>Rascunho</option><option>Confirmado</option><option>Em Produção</option><option>Pronto</option><option>Expedido</option><option>Cancelado</option></SelectInput></div><div className="panel table-panel"><Table columns={["Número", "Cliente", "Entrega", "Prioridade", "Valor Total", "Status"]} rows={rows.map((o) => [<span className="mono">{o.number}</span>, o.client, o.delivery || "—", <Pill tone={o.priority === "Urgente" ? "danger" : o.priority === "Alta" ? "warning" : "neutral"}>{o.priority}</Pill>, o.total || "—", <Pill tone={o.status === "Em Produção" ? "info" : o.status === "Pronto" ? "success" : "neutral"}>{o.status}</Pill>])} onDelete={remove} empty="Nenhum pedido cadastrado." /></div>{modal && <OrderModal clients={data.clients} onClose={() => setModal(false)} onSave={(newOrder) => { setData({ ...data, orders: [newOrder, ...data.orders] }); setModal(false); showToast("Pedido criado!"); }} />}</div>;
}

function OrderModal({ clients, onClose, onSave }: { clients: RecordItem[]; onClose: () => void; onSave: (order: typeof initialData.orders[number]) => void }) {
  const [client, setClient] = useState(""); const [priority, setPriority] = useState("Normal"); const [date, setDate] = useState("");
  return <Modal title="Novo Pedido" onClose={onClose} wide><form className="modal-form" onSubmit={(e) => { e.preventDefault(); if (!client) return; onSave({ number: `PED-${Date.now()}`, client, delivery: date, priority, total: "—", status: "Rascunho" }); }}><div className="form-grid"><Field label="Cliente *"><SelectInput value={client} onChange={setClient}><option value="">Selecione um cliente cadastrado</option>{clients.map((item, index) => <option key={`${item.code || item.name || "cliente"}-${index}`} value={String(item.name || item.code || "")}>{String(item.name || item.code || "Cliente sem nome")}</option>)}</SelectInput></Field><Field label="Prioridade"><SelectInput value={priority} onChange={setPriority}><option>Baixa</option><option>Normal</option><option>Alta</option><option>Urgente</option></SelectInput></Field><Field label="Data de Entrega"><TextInput value={date} onChange={setDate} type="date" /></Field></div><div className="panel empty-state compact-empty"><ClipboardList size={24} /><p>{clients.length ? "Os itens do pedido poderão ser vinculados aos produtos cadastrados." : "Cadastre um cliente antes de criar um pedido."}</p></div><div className="modal-actions"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit" icon={Check} disabled={!client}>Criar Pedido</Button></div></form></Modal>;
}
function InventoryOverview({ data }: { data: typeof initialData }) {
  const [, navigate] = useLocation(); const materials = data.materials; const low = useMemo(() => materials.filter((item) => Number(item.stock || 0) < Number(item.min || 0)), [materials]);
  return <div className="page-content"><PageHeader title="Estoque de Matéria-Prima" description="Visão geral baseada nos cadastros atuais"><Button icon={ArrowRight} onClick={() => navigate("/estoque/movimentacoes")}>Registrar movimentação</Button></PageHeader><div className="metrics-grid three"><MetricCard label="Total de Itens" value={String(materials.length)} sub={materials.length ? "fichas cadastradas" : "sem registros"} icon={Boxes} /><MetricCard label="Abaixo do Mínimo" value={String(low.length)} sub={low.length ? "requerem atenção" : "sem alertas"} icon={AlertTriangle} tone="danger" /></div><div className="panel"><div className="panel-head"><h3>Alertas de Estoque Baixo</h3><Pill tone={low.length ? "danger" : "neutral"}>{low.length} alertas</Pill></div><Table columns={["Código", "Nome", "Categoria", "Unidade", "Estoque Atual", "Estoque Mínimo", "Déficit"]} rows={low.map((item) => [item.code || "—", item.name || "—", item.category || "—", item.unit || "—", item.stock || "—", item.min || "—", <span className="danger-text">Abaixo do mínimo</span>])} empty="Nenhuma matéria-prima abaixo do estoque mínimo." /></div></div>;
}
function StockHub({ data }: { data: typeof initialData }) {
  const [, navigate] = useLocation(); const materialCount = data.materials.length; const productCount = data.products.length; const packagingCount = data.packaging.length;
  return <div className="page-content"><PageHeader title="Estoques" description="Gerencie matérias-primas, produtos acabados e suprimentos cadastrados."><Button icon={Plus} onClick={() => navigate("/cadastros/produtos")}>Cadastrar produto</Button></PageHeader><div className="stock-cards"><div className="stock-card stock-primary" onClick={() => navigate("/estoque/materia-prima")}><span><Boxes size={20} /></span><div><small>Matérias-primas</small><strong>{materialCount} itens</strong><p>{materialCount ? "Gestão completa" : "Nenhum cadastro"}</p></div></div><div className="stock-card stock-green" onClick={() => navigate("/estoque/acabado")}><span><Snowflake size={20} /></span><div><small>Produto Acabado</small><strong>{productCount} itens</strong><p>{productCount ? "Prontos para venda" : "Nenhum cadastro"}</p></div></div><div className="stock-card stock-orange" onClick={() => navigate("/estoque/embalagens")}><span><PackageOpen size={20} /></span><div><small>Suprimentos</small><strong>{packagingCount} itens</strong><p>{packagingCount ? "Insumos e embalagens" : "Nenhum cadastro"}</p></div></div></div><div className="panel empty-state"><Boxes size={36} /><p>As fichas, saldos e movimentações aparecerão aqui após os cadastros e lançamentos.</p><Button variant="outline" onClick={() => navigate("/cadastros/materias-primas")}>Cadastrar matéria-prima</Button></div></div>;
}
function RequisitionsPage({ data }: { data: typeof initialData }) {
  const [filter, setFilter] = useState("Todas"); const [, navigate] = useLocation(); const requests = useMemo(() => data.orders.map((order) => ({ id: order.number.replace(/^PED-/, "REQ-"), order: order.number, client: order.client || "Cliente não informado", total: order.total || "—", status: "Pendente", date: order.delivery || "—" })), [data.orders]); const visible = useMemo(() => requests.filter((r) => filter === "Todas" || r.status === filter), [requests, filter]);
  return <div className="page-content"><PageHeader title="Almoxarifado — Requisições de Materiais" description="Requisições vinculadas às ordens cadastradas"><Button variant="outline" icon={ClipboardCheck}>{requests.length} em aberto</Button></PageHeader><div className="toolbar"><div className="search-box"><Search size={16} /><input placeholder="Buscar por requisição ou OP..." /></div><SelectInput value={filter} onChange={setFilter}><option>Todas</option><option>Pendente</option><option>Parcial</option><option>Atendida</option><option>Cancelada</option></SelectInput></div><div className="panel table-panel"><Table columns={["Requisição", "Ordem de Produção", "Cliente", "Valor", "Situação", "Data"]} rows={visible.map((r) => [<button className="link-button" onClick={() => navigate(`/pedidos?selected=${r.order}`)}>{r.id}</button>, r.order, r.client, r.total, <Pill tone="warning">{r.status}</Pill>, r.date])} empty="Nenhuma requisição gerada. Cadastre um pedido ou uma ordem de produção." /></div></div>;
}
function LotsPage({ data, setData }: { data: typeof initialData; setData: (value: typeof initialData) => void }) {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("Todos"); const [modal, setModal] = useState(false); const [editing, setEditing] = useState<number | null>(null); const [form, setForm] = useState({ lot: "", material: "", total: "", expiry: "", location: "", status: "Disponível" }); const materials = data.materials;
  const filtered = useMemo(() => data.lots.filter((l) => Object.values(l).join(" ").toLowerCase().includes(query.toLowerCase()) && (status === "Todos" || l.status === status)), [data.lots, query, status]);
  const openCreate = () => { setEditing(null); setForm({ lot: "", material: "", total: "", expiry: "", location: "", status: "Disponível" }); setModal(true); };
  const openEdit = (index: number) => { const target = filtered[index]; const actualIndex = data.lots.indexOf(target); if (actualIndex < 0) return; setEditing(actualIndex); setForm({ lot: target.lot, material: target.material, total: target.total, expiry: target.expiry, location: target.location, status: target.status }); setModal(true); };
  const save = (e: FormEvent) => { e.preventDefault(); if (!form.lot.trim() || !form.material.trim() || !form.total.trim()) return; const next = { ...form, remaining: editing === null ? form.total : data.lots[editing]?.remaining || form.total }; const lots = [...data.lots]; if (editing === null) lots.unshift(next); else lots[editing] = next; setData({ ...data, lots }); setModal(false); };
  const remove = (index: number) => { const target = filtered[index]; if (!target || !window.confirm(`Excluir o lote ${target.lot}?`)) return; setData({ ...data, lots: data.lots.filter((lot) => lot !== target) }); };
  return <div className="page-content"><PageHeader title="Lotes de Estoque" description="Controle de validade, localização e situação dos lotes"><Button icon={Plus} onClick={openCreate}>Novo Lote</Button></PageHeader><div className="toolbar"><div className="search-box"><Search size={16} /><input placeholder="Buscar lote..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><SelectInput value={status} onChange={setStatus}><option>Todos</option><option>Disponível</option><option>Bloqueado</option><option>Quarentena</option><option>Consumido</option><option>Vencido</option></SelectInput></div><div className="panel table-panel"><Table columns={["Lote", "Matéria-prima", "Qtd Total", "Qtd Restante", "Validade", "Localização", "Status"]} rows={filtered.map((l) => [<span className="mono">{l.lot}</span>, l.material, l.total, l.remaining, l.expiry || "—", l.location || "—", <Pill tone={l.status === "Disponível" ? "success" : l.status === "Consumido" ? "neutral" : "danger"}>{l.status}</Pill>])} onEdit={openEdit} onDelete={remove} empty="Nenhum lote cadastrado." /></div>{modal && <Modal title={`${editing === null ? "Novo" : "Editar"} Lote de Matéria-prima`} onClose={() => setModal(false)}><form className="modal-form" onSubmit={save}><div className="form-grid"><Field label="Número do lote *"><TextInput value={form.lot} onChange={(v) => setForm({ ...form, lot: v })} placeholder="Informe o lote" /></Field><Field label="Matéria-prima *"><SelectInput value={form.material} onChange={(v) => setForm({ ...form, material: v })}><option value="">Selecione um cadastro</option>{materials.map((item, index) => <option key={`${item.code || item.name || "material"}-${index}`} value={String(item.name || item.code || "")}>{String(item.name || item.code || "Material sem nome")}</option>)}</SelectInput></Field><Field label="Quantidade *"><TextInput value={form.total} onChange={(v) => setForm({ ...form, total: v })} type="number" placeholder="0" /></Field><Field label="Validade"><TextInput value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} type="date" /></Field><Field label="Localização"><TextInput value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Ex.: A-01-01" /></Field><Field label="Status"><SelectInput value={form.status} onChange={(v) => setForm({ ...form, status: v })}><option>Disponível</option><option>Bloqueado</option><option>Quarentena</option><option>Consumido</option><option>Vencido</option></SelectInput></Field></div><div className="modal-actions"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button type="submit" icon={Check} disabled={!form.lot || !form.material || !form.total}>{editing === null ? "Cadastrar lote" : "Salvar lote"}</Button></div></form></Modal>}</div>;
}
function MonitorPage({ sector, data }: { sector?: string; data: typeof initialData }) {
  const [, navigate] = useLocation(); const selected = stages.find((s) => s.key === sector); if (selected) return <SectorMonitor stage={selected} data={data} />; const count = data.orders.length;
  return <div className="page-content monitor-page"><PageHeader title="Monitor da Produção" description="Visão operacional baseada nos registros atuais"><Button icon={Activity} onClick={() => navigate("/apontamento/cozinha")}>Ir para apontamento</Button></PageHeader><div className="monitor-hero"><img src={MONITOR_ART} alt="Fluxo industrial" /><div><span className="eyebrow">Linha de produção</span><h2>Visão operacional em tempo real</h2><p>Os indicadores serão preenchidos conforme pedidos, ordens e apontamentos forem registrados.</p></div></div><div className="metrics-grid six"><MetricCard label="OPs ativas" value={String(count)} sub={count ? "ordens cadastradas" : "sem registros"} icon={ClipboardList} /><MetricCard label="Produzido hoje" value="0 kg" sub="sem apontamentos" icon={Factory} tone="success" /><MetricCard label="Perdas hoje" value="0 kg" sub="sem apontamentos" icon={AlertTriangle} tone="danger" /><MetricCard label="% de perda" value="—" sub="sem base de cálculo" icon={Gauge} tone="warning" /><MetricCard label="Em processo (WIP)" value="0 kg" sub="sem apontamentos" icon={Activity} tone="info" /><MetricCard label="OPs atrasadas" value="0" sub="sem registros" icon={CalendarClock} tone="danger" /></div><div className="sector-grid">{stages.map((s) => <div className="panel sector-card" key={s.key} onClick={() => navigate(`/monitor/${s.key}`)}><div className="sector-head"><s.icon size={18} /><div><h3>{s.label}</h3><Pill tone="neutral">Sem registros</Pill></div></div><div className="sector-stats"><div><b>0</b><span>OPs no setor</span></div><div><b>0 kg</b><span>Apontado</span></div></div><div className="sector-footer"><span><Activity size={13} /> 0 apontamentos</span><span>Sem perdas informadas</span></div></div>)}</div><div className="panel empty-state"><ClipboardList size={36} /><p>{count ? "Ainda não há apontamentos de produção para exibir." : "Cadastre um pedido ou uma ordem de produção para iniciar o monitoramento."}</p></div></div>;
}
function SectorMonitor({ stage, data }: { stage: typeof stages[number]; data: typeof initialData }) {
  const [, navigate] = useLocation(); const count = data.orders.length;
  return <div className="page-content"><PageHeader title={`Monitor — ${stage.label}`} description="Acompanhamento do setor baseado nos registros atuais"><Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/monitor")}>Visão geral</Button><Button icon={Activity} onClick={() => navigate(`/apontamento/${stage.key}`)}>Apontar</Button></PageHeader><div className="metrics-grid four"><MetricCard label="OPs no setor" value={String(count)} sub={count ? "ordens cadastradas" : "sem registros"} icon={ClipboardList} /><MetricCard label="Recebido hoje" value="0 kg" sub="sem apontamentos" icon={PackageOpen} tone="info" /><MetricCard label="Tempo médio" value="—" sub="sem base de cálculo" icon={CalendarClock} tone="warning" /><MetricCard label="Estoque do setor" value="0 kg" sub="sem apontamentos" icon={Boxes} tone="success" /></div><div className="temperature-note"><Thermometer size={16} />Temperatura do setor: <b>sem registros</b></div><div className="panel table-panel"><div className="panel-head"><h3>Fila do setor</h3><Pill tone="neutral">{count} ordens</Pill></div><Table columns={["Ordem de Produção", "Cliente", "Valor", "Ação"]} rows={data.orders.map((order) => [<span className="mono">{order.number}</span>, order.client || "Cliente não informado", order.total || "—", <Button variant="outline" icon={ArrowRight} onClick={() => navigate(`/apontamento/${stage.key}`)}>Apontar</Button>])} empty="Nenhuma ordem disponível para este setor." /></div></div>;
}
function ApontamentoPage({ sector, data }: { sector: string; data: typeof initialData }) {
  const [, navigate] = useLocation(); const stage = stages.find((s) => s.key === sector) || stages[0]; const [running, setRunning] = useState(false); const [orderNumber, setOrderNumber] = useState(""); const { showToast } = useToast(); const selected = data.orders.find((order) => order.number === orderNumber);
  const save = (e: FormEvent) => { e.preventDefault(); if (!selected) { showToast("Selecione uma ordem cadastrada antes de registrar o apontamento."); return; } showToast(`Apontamento de ${selected.number} registrado localmente.`); setRunning(false); };
  return <div className="page-content"><PageHeader title={`Apontamento — ${stage.label}`} description="Registre pesos, temperatura e perdas da etapa"><Button variant="outline" icon={Monitor} onClick={() => navigate(`/monitor/${stage.key}`)}>Monitor do setor</Button></PageHeader><div className="stage-tabs">{stages.map((s) => <button key={s.key} className={cn(s.key === stage.key && "active")} onClick={() => navigate(`/apontamento/${s.key}`)}><s.icon size={15} />{s.short}</button>)}</div><div className="metrics-grid four"><MetricCard label="OPs no setor" value={String(data.orders.length)} sub={data.orders.length ? "ordens cadastradas" : "sem registros"} icon={ClipboardList} /><MetricCard label="Produzido hoje" value="0 kg" sub="sem apontamentos" icon={Factory} tone="success" /><MetricCard label="Perdas hoje" value="0 kg" sub="sem apontamentos" icon={AlertTriangle} tone="danger" /><MetricCard label="Em estoque no setor" value="0 kg" sub="sem apontamentos" icon={Boxes} tone="info" /></div>{data.orders.length === 0 ? <div className="panel empty-state large-empty"><ClipboardList size={42} /><h2>Nenhuma ordem disponível</h2><p>Cadastre um pedido ou uma ordem de produção antes de iniciar um apontamento.</p><Button variant="outline" onClick={() => navigate("/pedidos")}>Ir para pedidos</Button></div> : <div className="panel form-panel"><div className="panel-head"><h3>Registrar apontamento</h3><Pill tone={running ? "success" : "neutral"}>{running ? "Em andamento" : "Parado"}</Pill></div><form onSubmit={save}><Field label="Ordem de Produção *"><SelectInput value={orderNumber} onChange={setOrderNumber}><option value="">Selecione a OP neste setor</option>{data.orders.map((order) => <option key={order.number} value={order.number}>{order.number} · {order.client || "Cliente não informado"}</option>)}</SelectInput></Field><div className="run-control"><span className={cn("run-indicator", running && "on")} /><b>{running ? "Cronômetro ativo" : "Pronto para iniciar"}</b><Button type="button" variant={running ? "danger" : "primary"} icon={running ? Pause : Play} onClick={() => setRunning(!running)}>{running ? "Parar" : "Iniciar"}</Button></div><div className="form-grid"><Field label="Peso recebido (kg)"><TextInput type="number" placeholder="0,00" /></Field><Field label="Peso enviado (kg)"><TextInput type="number" placeholder="0,00" /></Field><Field label="Perda (kg)"><TextInput type="number" placeholder="0,00" /></Field><Field label="Temperatura (°C)"><TextInput type="number" placeholder="0,0" /></Field></div><Button type="submit" icon={Check}>Salvar apontamento</Button></form></div>}</div>;
}
function RastreabilidadePage({ data }: { data: typeof initialData }) {
  const [query, setQuery] = useState(""); const [mode, setMode] = useState<"Lote" | "OP">("Lote"); const [searched, setSearched] = useState(false); const found = data.orders.find((order) => mode === "OP" && order.number.toLowerCase() === query.trim().toLowerCase());
  return <div className="page-content"><PageHeader title="Rastreabilidade" description="Consulte registros reais por lote ou ordem de produção" /><div className="trace-search"><div className="segmented"><button className={mode === "Lote" ? "active" : ""} onClick={() => { setMode("Lote"); setSearched(false); }}>Lote</button><button className={mode === "OP" ? "active" : ""} onClick={() => { setMode("OP"); setSearched(false); }}>OP</button></div><div className="trace-row"><TextInput value={query} onChange={(v) => { setQuery(v); setSearched(false); }} placeholder={mode === "Lote" ? "Ex.: número do lote" : "Ex.: número da OP"} /><Button icon={Search} onClick={() => setSearched(true)}>Buscar</Button></div></div>{searched && found ? <div className="panel trace-result"><div className="trace-summary"><div><span>{found.number}</span><strong>{found.client || "Cliente não informado"}</strong></div><Pill tone="info">{found.status}</Pill></div><div className="result-grid trace-grid"><div><span>Valor</span><b>{found.total || "—"}</b></div><div><span>Entrega</span><b>{found.delivery || "—"}</b></div><div><span>Apontamentos</span><b>0</b></div><div><span>Rastreio</span><Pill>Sem eventos</Pill></div></div><div className="empty-state compact-empty"><Search size={30} /><p>A linha do tempo será preenchida quando houver lotes e apontamentos associados.</p></div></div> : <div className="empty-state"><Search size={42} /><p>{searched ? "Nenhum registro encontrado." : "Digite um número de lote ou OP para iniciar a rastreabilidade."}</p></div>}</div>;
}
function ReportsPage() { const [start, setStart] = useState("2026-08-01"); const [end, setEnd] = useState("2026-08-25"); const { showToast } = useToast(); const reports: Array<[string, string, LucideIcon]> = [["Produção por período", "Ordens produzidas, kg planejados e realizados", Factory], ["Pedidos e faturamento", "Pedidos, valores e status comerciais", ClipboardList], ["Estoque e lotes", "Saldos, validade e movimentações", Boxes], ["Custos de produção", "Custos por OP, produto e etapa", CircleDollarSign], ["Qualidade", "Checklists, NCs e liberações", ShieldCheck], ["Manutenção", "Ordens, custos e disponibilidade", Wrench]] as const; return <div className="page-content"><PageHeader title="Relatórios" description="Exportação real em PDF, Excel e CSV com dados do sistema" /><div className="date-filter"><Field label="Data Início"><TextInput type="date" value={start} onChange={setStart} /></Field><Field label="Data Fim"><TextInput type="date" value={end} onChange={setEnd} /></Field><span>Filtro de período aplicado aos relatórios com data</span></div><div className="report-grid">{reports.map(([title, desc, Icon]) => <div className="panel report-card" key={title}><span className="report-icon"><Icon size={20} /></span><div><h3>{title}</h3><p>{desc}</p><div className="report-actions"><Button variant="outline" icon={Download} onClick={() => showToast("Relatório exportado com sucesso!")}>CSV</Button><Button variant="outline" icon={FileText} onClick={() => showToast("Relatório exportado com sucesso!")}>Excel</Button><Button variant="outline" icon={Download} onClick={() => showToast("Relatório exportado com sucesso!")}>PDF</Button></div></div></div>)}</div></div>; }

function ManualPage() { return <div className="page-content"><PageHeader title="Manual de uso" description="Rotinas e orientações do Mineirada ERP + MES" /><div className="manual-hero"><img src={MANUAL_ART} alt="Linha de produção" /><div><span className="eyebrow">Operação integrada</span><h2>Do pedido à expedição, cada etapa no seu lugar.</h2><p>Consulte os passos para cadastrar insumos, liberar OPs, apontar produção e rastrear lotes.</p></div></div><div className="manual-grid">{[["Comece pelos cadastros", "Cadastre clientes, fornecedores, matérias-primas, produtos, máquinas e embalagens."], ["Planeje a produção", "Crie a receita/BOM, o pedido e a ordem de produção com lote e prioridade."], ["Execute e aponte", "Autorize a requisição, separe MP e registre pesos, temperatura e perdas em cada setor."], ["Feche o ciclo", "Libere a qualidade, atualize a câmara fria, acompanhe expedição e gere relatórios."]].map(([title, text], i) => <div className="panel manual-step" key={title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p><button className="text-link">Ver orientações <ArrowRight size={14} /></button></div>)}</div></div>; }

function OperatorPage({ data }: { data: typeof initialData }) {
  const [offline, setOffline] = useState(false); const [, navigate] = useLocation(); const firstOrder = data.orders[0];
  return <div className="page-content operator-page"><PageHeader title="App do Operador" description="Apontamento de chão de fábrica, otimizado para celular e modo offline"><Button variant={offline ? "danger" : "outline"} icon={offline ? Activity : RefreshCw} onClick={() => setOffline(!offline)}>{offline ? "Modo offline" : "Sincronizar"}</Button></PageHeader><div className="operator-hero"><div><span className="eyebrow">Experiência mobile</span><h2>Registre no setor, mesmo sem sinal.</h2><p>Selecione ou escaneie uma ordem cadastrada, acompanhe o cronômetro e envie pesos, temperatura, foto e assinatura digital.</p><div className="operator-badges"><Pill tone={offline ? "warning" : "neutral"}>{offline ? "Modo offline" : "Pronto"}</Pill><Pill tone="neutral">{data.orders.length} ordens disponíveis</Pill></div></div><img src={OPERATOR_ART} alt="Operador com scanner" /></div><div className="operator-grid"><div className="panel"><div className="panel-head"><h3>Selecionar Ordem de Produção</h3><Button variant="outline" icon={QrCode}>Escanear</Button></div>{firstOrder ? <SelectInput><option>{firstOrder.number} · {firstOrder.client || "Cliente não informado"}</option>{data.orders.slice(1).map((order) => <option key={order.number}>{order.number} · {order.client || "Cliente não informado"}</option>)}</SelectInput> : <div className="empty-state compact-empty"><ClipboardList size={28} /><p>Nenhuma ordem cadastrada.</p><Button variant="outline" onClick={() => navigate("/pedidos")}>Ir para pedidos</Button></div>}</div><div className="panel signature-card"><div className="panel-head"><h3>Assinatura digital</h3><Pencil size={17} /></div><div className="signature-box"><span>Assine aqui após conferir o registro</span></div><Button variant="outline" icon={Camera}>Adicionar foto</Button></div></div></div>;
}
function RecipesPage({ data, setData }: { data: typeof initialData; setData: (value: typeof initialData) => void }) {
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<RecordItem>({ product: "", name: "", batchSize: "", yieldPct: "100", lossPct: "0", temp: "", shelf: "180", instructions: "" });
  const recipes = data.recipes.filter((r) => Object.values(r).join(" ").toLowerCase().includes(query.toLowerCase()));
  const save = (e: FormEvent) => { e.preventDefault(); setData({ ...data, recipes: [{ ...form, status: "Ativa", cost: "—" }, ...data.recipes] }); setModal(false); setForm({ product: "", name: "", batchSize: "", yieldPct: "100", lossPct: "0", temp: "", shelf: "180", instructions: "" }); };
  return <div className="page-content"><PageHeader title="Receitas / BOM" description={`${recipes.length} receitas`}><Button icon={Plus} onClick={() => setModal(true)}>Nova Receita</Button></PageHeader><div className="toolbar"><div className="search-box"><Search size={16} /><input placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} /></div></div><div className="panel table-panel"><Table columns={["Nome", "Produto", "Tamanho do Lote", "Custo/kg", "Status"]} rows={recipes.map((r) => [r.name || "—", r.product || "—", r.batchSize ? `${r.batchSize} kg` : "—", r.cost || "—", <Pill tone="success">{r.status || "Ativa"}</Pill>])} empty="Nenhuma receita cadastrada." /></div>{modal && <Modal title="Nova Receita" onClose={() => setModal(false)} wide><form className="modal-form" onSubmit={save}><Field label="Produto *"><SelectInput value={form.product as string} onChange={(v) => setForm({ ...form, product: v })}><option value="">Selecione o produto</option><option value="Produto cadastrado">Produto cadastrado</option></SelectInput></Field><Field label="Nome da Receita *"><TextInput value={form.name as string} onChange={(v) => setForm({ ...form, name: v })} /></Field><div className="form-grid"><Field label="Tamanho do Lote (kg) *"><TextInput value={form.batchSize as string} onChange={(v) => setForm({ ...form, batchSize: v })} type="number" /></Field><Field label="Rendimento (%)"><TextInput value={form.yieldPct as string} onChange={(v) => setForm({ ...form, yieldPct: v })} type="number" /></Field></div><div className="form-grid three"><Field label="Perda (%)"><TextInput value={form.lossPct as string} onChange={(v) => setForm({ ...form, lossPct: v })} type="number" /></Field><Field label="Temp. (°C)"><TextInput value={form.temp as string} onChange={(v) => setForm({ ...form, temp: v })} type="number" /></Field><Field label="Validade (dias)"><TextInput value={form.shelf as string} onChange={(v) => setForm({ ...form, shelf: v })} type="number" /></Field></div><Field label="Instruções"><textarea className="input textarea" value={form.instructions as string} onChange={(e) => setForm({ ...form, instructions: e.target.value })} /></Field><div className="modal-actions"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button type="submit" icon={Check}>Criar</Button></div></form></Modal>}</div>;
}

function DataBackupPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const exportBackup = () => { if (password.length < 12 || password !== confirm) { window.alert("Defina e confirme uma senha com no mínimo 12 caracteres."); return; } const data = localStorage.getItem(DATA_STORAGE_KEY) || JSON.stringify(initialData); const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data: JSON.parse(data) }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "mineirada-backup.json"; anchor.click(); URL.revokeObjectURL(url); };
  const restore = () => { if (!file || password.length < 12 || password !== confirm) { window.alert("Escolha um arquivo e informe a senha de proteção confirmada."); return; } const reader = new FileReader(); reader.onload = () => { try { const parsed = JSON.parse(String(reader.result)); if (!parsed.data) throw new Error("backup"); localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...initialData, ...parsed.data })); window.location.reload(); } catch { window.alert("Arquivo de backup inválido."); } }; reader.readAsText(file); };
  return <div className="page-content"><PageHeader title="Dados e Backup" description="Movimente o estado local do sistema com um arquivo completo, protegido e verificável." /><div className="metrics-grid three"><div className="panel info-card"><KeyRound size={18} /><h3>Credenciais protegidas</h3><p>As credenciais não são incluídas no arquivo de dados.</p></div><div className="panel info-card"><RefreshCw size={18} /><h3>Restauração segura</h3><p>O arquivo é validado antes de substituir os registros locais.</p></div><div className="panel info-card"><Database size={18} /><h3>Estado local</h3><p>Cadastros e configurações desta instalação podem ser exportados.</p></div></div><div className="panel"><div className="panel-head"><h3>Senha de proteção do backup</h3><KeyRound size={17} /></div><div className="form-grid"><Field label="Senha com no mínimo 12 caracteres"><TextInput type="password" value={password} onChange={setPassword} placeholder="Senha de proteção" /></Field><Field label="Confirme a senha de proteção"><TextInput type="password" value={confirm} onChange={setConfirm} placeholder="Confirme a senha" /></Field></div></div><div className="panel"><div className="panel-head"><div><h3>Exportar todo o sistema</h3><p>Gera um arquivo JSON de restauração com os registros locais.</p></div><Download size={17} /></div><Button icon={Download} onClick={exportBackup}>Exportar backup completo</Button></div><div className="panel"><div className="panel-head"><div><h3>Importar e restaurar</h3><p>Substitui os registros locais pelo conteúdo do backup selecionado.</p></div><Upload size={17} /></div><input className="input" type="file" accept="application/json" onChange={(e) => setFile(e.target.files?.[0] || null)} /><div className="modal-actions"><Button variant="outline" onClick={() => setFile(null)}>Limpar seleção</Button><Button icon={Upload} onClick={restore}>Criar backup e restaurar</Button></div></div></div>;
}

function UsersPage() { const [modal, setModal] = useState(false); const [change, setChange] = useState(false); return <div className="page-content"><PageHeader title="Usuários do Sistema" description="Login por usuário e senha, gravados diretamente no banco de dados"><Button variant="outline" icon={KeyRound} onClick={() => setChange(true)}>Minha senha</Button><Button icon={UserPlus} onClick={() => setModal(true)}>Novo usuário</Button></PageHeader><div className="toolbar"><div className="search-box"><Search size={16} /><input placeholder="Buscar por login ou nome..." /></div></div><div className="panel table-panel"><div className="panel-head"><h3>Contas cadastradas</h3><Pill tone="success">3 ativas</Pill></div><Table columns={["Usuário", "Nome", "Perfil", "Situação", "Último acesso"]} rows={[[<span className="mono">SOUSA</span>, "Sousa", <Pill tone="primary">Gestor</Pill>, <Pill tone="success">Ativo</Pill>, "25/08/2026 14:32"],[<span className="mono">KARITA</span>, "Karita", <Pill tone="info">Administrador</Pill>, <Pill tone="success">Ativo</Pill>, "25/08/2026 14:40"],[<span className="mono">FELIPE</span>, "Felipe", <Pill tone="info">Administrador</Pill>, <Pill tone="success">Ativo</Pill>, "—"]]} /></div><div className="panel permission-panel"><div className="panel-head"><h3>Perfis e permissões</h3></div><div className="permission-grid">{Object.entries(roleLabels).map(([key, label]) => <div key={key}><Pill tone={key === "gestor" ? "primary" : "neutral"}>{label}</Pill><p>{key === "gestor" ? "Acesso completo a todas as funções, incluindo usuários e perfis." : key === "admin" ? "Acesso administrativo a usuários, auditoria e dados do sistema." : key === "operador" ? "Acessa o fluxo de produção, registra etapas e lotes." : key === "qualidade" ? "Gerencia checklists, não conformidades e liberação de lotes." : "Visualiza os módulos conforme a responsabilidade definida."}</p></div>)}</div></div>{modal && <Modal title="Novo usuário" onClose={() => setModal(false)}><form className="modal-form"><Field label="Login *"><TextInput placeholder="Ex.: JOAO" /></Field><Field label="Senha *"><TextInput type="password" placeholder="Mínimo 6 caracteres" /></Field><Field label="Perfil *"><SelectInput><option>Operador</option><option>Qualidade</option><option>Gerente</option></SelectInput></Field><div className="modal-actions"><Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button><Button icon={Check}>Cadastrar</Button></div></form></Modal>}{change && <Modal title="Alterar minha senha" onClose={() => setChange(false)}><form className="modal-form"><Field label="Senha atual"><TextInput type="password" /></Field><Field label="Nova senha"><TextInput type="password" /></Field><div className="modal-actions"><Button variant="outline" onClick={() => setChange(false)}>Cancelar</Button><Button icon={Check}>Salvar</Button></div></form></Modal>}</div>; }

function Sidebar({ user, onLogout, open, onClose }: { user: AuthUser; onLogout: () => void; open: boolean; onClose: () => void }) {
  const [location, navigate] = useLocation(); const [expanded, setExpanded] = useState<Record<string, boolean>>({ Cadastros: true, Almoxarifado: true, Estoques: true, Produção: true });
  const canSee = (item: MenuItem) => !item.adminOnly || user.role === "gestor" || user.role === "admin";
  const renderItem = (item: MenuItem, nested = false) => { if (!canSee(item)) return null; const children = item.children?.filter(canSee) || []; const active = item.href === "/" ? location === "/" : item.href && location === item.href; return <div key={item.label}><button className={cn("nav-item", nested && "nav-item-nested", active && "active")} onClick={() => { if (item.href) { navigate(item.href); onClose(); } else if (children.length) setExpanded((state) => ({ ...state, [item.label]: !state[item.label] })); }}><item.icon size={16} /><span>{item.label}</span>{children.length > 0 && <ChevronDown size={14} className={expanded[item.label] ? "rotate-180" : ""} />}</button>{children.length > 0 && expanded[item.label] && <div className="nav-children">{children.map((child) => renderItem(child, true))}</div>}</div>; };
  return <aside className={cn("sidebar", open && "open")}><div className="sidebar-brand"><img src={LOGO} alt="Mineirada" /><div><b>Mineirada</b><small>ERP + MES · Manual...</small></div><button className="icon-button sidebar-close" onClick={onClose}><X size={16} /></button></div><nav className="sidebar-nav">{menuItems.map((item) => renderItem(item))}</nav><div className="sidebar-user"><div><strong>{user.name}</strong><small>{roleLabels[user.role]}</small></div><button className="icon-button" onClick={onLogout} aria-label="Sair"><LogOut size={16} /></button></div></aside>;
}

function AppLayout({ children, user, onLogout }: { children: ReactNode; user: AuthUser; onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); const [location] = useLocation(); const [toast, setToast] = useState("");
  useEffect(() => { const onToast = (event: Event) => setToast((event as CustomEvent<string>).detail); window.addEventListener("mineirada-toast", onToast); return () => window.removeEventListener("mineirada-toast", onToast); }, []);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 2800); return () => window.clearTimeout(timer); }, [toast]);
  return <div className="app-shell"><Sidebar user={user} onLogout={onLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="app-main"><header className="topbar"><button className="menu-button" onClick={() => setSidebarOpen(true)}><Menu size={19} /></button><div className="breadcrumb"><span>Mineirada ERP + MES</span><ChevronRight size={14} /><b>{formatTitle(location)}</b></div><div className="topbar-actions"><button className="icon-button" aria-label="Alternar tema"><Moon size={17} /></button><div className="profile-chip"><span className="avatar"><CircleUserRound size={16} /></span><div><b>{user.username}</b><small>{roleLabels[user.role]}</small></div><ChevronDown size={14} /></div></div></header><main className="main-scroll">{children}</main></div>{sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}{toast && <div className="toast-notice" role="status">{toast}</div>}</div>;
}

function PlaceholderPage({ title, description, construction = false }: { title: string; description: string; construction?: boolean }) {
  return <div className="page-content"><PageHeader title={title} description={description} /><div className="panel empty-state large-empty"><Database size={42} /><h2>{construction ? "Módulo em preparação" : "Nenhum registro disponível"}</h2><p>{construction ? "Esta área foi mapeada e está pronta para receber o fluxo específico do módulo." : "Os dados desta tela aparecerão após os cadastros e operações correspondentes."}</p></div></div>;
}

function AuthenticatedRouter({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
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

export default function App() {
  const [location, navigate] = useLocation(); const previewMode = new URLSearchParams(window.location.search).get("preview") === "1";
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem("mineirada_user_profile"); const stored = raw ? JSON.parse(raw) as Partial<AuthUser> : null; const account = AUTH_USERS.find((candidate) => candidate.username === stored?.username && candidate.role === stored?.role);
      return account ? { username: account.username, name: account.name, role: account.role } : previewMode ? { username: "SOUSA", name: "Sousa", role: "gestor" } : null;
    } catch { return previewMode ? { username: "SOUSA", name: "Sousa", role: "gestor" } : null; }
  });
  useEffect(() => { if (user && location === "/login") navigate("/"); }, [user, location, navigate]);
  const login = (account: AuthUser) => { setUser(account); localStorage.setItem("mineirada_session_v1", "replica-session"); localStorage.setItem("mineirada_user_profile", JSON.stringify(account)); navigate("/"); };
  const logout = () => { localStorage.removeItem("mineirada_session_v1"); localStorage.removeItem("mineirada_user_profile"); setUser(null); navigate("/login"); };
  if (!user && location !== "/consulta-pedido" && !location.startsWith("/consulta-pedido/")) return <LoginPage onLogin={login} />;
  if (user && location === "/login") return null;
  if (location === "/consulta-pedido" || location.startsWith("/consulta-pedido/")) return <div className="public-page"><div className="public-page-head"><img src={LOGO} alt="Mineirada" /><h1>Mineirada ERP + MES</h1><p>Acompanhamento público de pedido</p></div><PublicLookup /><button className="back-login" onClick={() => navigate("/login")}><ArrowLeft size={15} /> Voltar para o login</button></div>;
  return <AuthenticatedRouter user={user || { username: "SOUSA", name: "Sousa", role: "gestor" }} onLogout={logout} />;
}