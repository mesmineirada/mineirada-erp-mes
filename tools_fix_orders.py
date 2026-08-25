from pathlib import Path
import re

path = Path('/home/ubuntu/mineirada-replica/client/src/App.tsx')
text = path.read_text()
replacement = r'''function OrdersPage({ data, setData }: { data: typeof initialData; setData: (value: typeof initialData) => void }) {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("Todos"); const [modal, setModal] = useState(false); const { showToast } = useToast();
  const rows = data.orders.filter((o) => `${o.number} ${o.client} ${o.status}`.toLowerCase().includes(query.toLowerCase()) && (status === "Todos" || o.status === status));
  const remove = (index: number) => { const target = rows[index]; if (!target || !window.confirm(`Excluir o pedido ${target.number}?`)) return; setData({ ...data, orders: data.orders.filter((item) => item !== target) }); showToast("Pedido removido."); };
  return <div className="page-content"><PageHeader title="Pedidos" description="Pedidos de clientes e programação de entrega"><Button icon={Plus} onClick={() => setModal(true)}>Novo Pedido</Button></PageHeader><div className="toolbar"><div className="search-box"><Search size={16} /><input placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><SelectInput value={status} onChange={setStatus}><option>Todos</option><option>Rascunho</option><option>Confirmado</option><option>Em Produção</option><option>Pronto</option><option>Expedido</option><option>Cancelado</option></SelectInput></div><div className="panel table-panel"><Table columns={["Número", "Cliente", "Entrega", "Prioridade", "Valor Total", "Status"]} rows={rows.map((o) => [<span className="mono">{o.number}</span>, o.client, o.delivery || "—", <Pill tone={o.priority === "Urgente" ? "danger" : o.priority === "Alta" ? "warning" : "neutral"}>{o.priority}</Pill>, o.total || "—", <Pill tone={o.status === "Em Produção" ? "info" : o.status === "Pronto" ? "success" : "neutral"}>{o.status}</Pill>])} onDelete={remove} empty="Nenhum pedido cadastrado." /></div>{modal && <OrderModal clients={data.clients} onClose={() => setModal(false)} onSave={(newOrder) => { setData({ ...data, orders: [newOrder, ...data.orders] }); setModal(false); showToast("Pedido criado!"); }} />}</div>;
}

function OrderModal({ clients, onClose, onSave }: { clients: RecordItem[]; onClose: () => void; onSave: (order: typeof initialData.orders[number]) => void }) {
  const [client, setClient] = useState(""); const [priority, setPriority] = useState("Normal"); const [date, setDate] = useState("");
  return <Modal title="Novo Pedido" onClose={onClose} wide><form className="modal-form" onSubmit={(e) => { e.preventDefault(); if (!client) return; onSave({ number: `PED-${Date.now()}`, client, delivery: date, priority, total: "—", status: "Rascunho" }); }}><div className="form-grid"><Field label="Cliente *"><SelectInput value={client} onChange={setClient}><option value="">Selecione um cliente cadastrado</option>{clients.map((item, index) => <option key={`${item.code || item.name || "cliente"}-${index}`} value={String(item.name || item.code || "")}>{String(item.name || item.code || "Cliente sem nome")}</option>)}</SelectInput></Field><Field label="Prioridade"><SelectInput value={priority} onChange={setPriority}><option>Baixa</option><option>Normal</option><option>Alta</option><option>Urgente</option></SelectInput></Field><Field label="Data de Entrega"><TextInput value={date} onChange={setDate} type="date" /></Field></div><div className="panel empty-state compact-empty"><ClipboardList size={24} /><p>{clients.length ? "Os itens do pedido poderão ser vinculados aos produtos cadastrados." : "Cadastre um cliente antes de criar um pedido."}</p></div><div className="modal-actions"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit" icon={Check} disabled={!client}>Criar Pedido</Button></div></form></Modal>;
}'''
pattern = r'function OrdersPage\b.*?(?=\nfunction InventoryOverview\b)'
text, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
if count != 1: raise SystemExit('orders block not found')
path.write_text(text)
print('orders fixed')
