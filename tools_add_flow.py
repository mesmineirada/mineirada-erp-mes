from pathlib import Path

path = Path('/home/ubuntu/mineirada-replica/client/src/App.tsx')
text = path.read_text()
if 'function ProductionFlowPage' in text:
    print('flow already exists')
    raise SystemExit(0)
flow = r'''function ProductionFlowPage({ data }: { data: typeof initialData }) {
  const stages = ["Planejada", "Em produção", "Pausada", "Concluída", "Cancelada"];
  return <div className="page-content"><PageHeader title="Fluxo de Produção" description="Acompanhe as ordens por etapa e situação"><div className="audit-count"><Activity size={16} />{data.productionOrders.length} ordens</div></PageHeader><div className="flow-board">{stages.map((stage) => { const orders = data.productionOrders.filter((order) => order.status === stage); return <section className="flow-column" key={stage}><div className="flow-column-head"><h3>{stage}</h3><Pill tone={stage === "Concluída" ? "success" : stage === "Cancelada" ? "danger" : "neutral"}>{orders.length}</Pill></div>{orders.length ? orders.map((order) => <article className="flow-card" key={order.number}><span className="mono">{order.number}</span><strong>{order.product}</strong><small>{order.quantity} · entrega {order.delivery || "sem data"}</small><Pill tone={order.priority === "Urgente" ? "danger" : order.priority === "Alta" ? "warning" : "neutral"}>{order.priority}</Pill></article>) : <div className="flow-empty">Nenhuma ordem</div>}</section>; })}</div></div>;
}
'''
text = text.replace('\nfunction MovementsPage', '\n' + flow + '\nfunction MovementsPage', 1)
text = text.replace('else if (location === "/producao/ordens") content = <PlaceholderPage title="Ordens de Produção" description="Planeje e acompanhe as ordens da fábrica" />;', 'else if (location === "/producao/ordens") content = <ProductionOrdersPage {...common} />;')
text = text.replace('else if (location === "/producao/fluxo") content = <PlaceholderPage title="Fluxo de Produção" description="Acompanhe o fluxo por etapa e setor" />;', 'else if (location === "/producao/fluxo") content = <ProductionFlowPage data={data} />;')
text = text.replace('else if (location === "/estoque/movimentacoes") content = <PlaceholderPage title="Movimentações" description="Entradas, baixas e transferências entre setores" />;', 'else if (location === "/estoque/movimentacoes") content = <MovementsPage {...common} />;')
text = text.replace('else if (location === "/qualidade/checklists") content = <PlaceholderPage title="Checklists" description="Controle de qualidade e inspeções" />;', 'else if (location === "/qualidade/checklists") content = <QualityPage {...common} category="Checklist" />;')
text = text.replace('else if (location === "/qualidade/nao-conformidades") content = <PlaceholderPage title="Não Conformidades" description="Controle de qualidade e liberação de lotes" />;', 'else if (location === "/qualidade/nao-conformidades") content = <QualityPage {...common} category="Não conformidade" />;')
text = text.replace('else if (location === "/manutencao") content = <PlaceholderPage title="Manutenção" description="Ordens de manutenção e disponibilidade de máquinas" />;', 'else if (location === "/manutencao") content = <MaintenancePage {...common} />;')
text = text.replace('else if (location === "/auditoria") content = <PlaceholderPage title="Auditoria" description="Eventos e histórico de alterações" />;', 'else if (location === "/auditoria") content = <AuditPage data={data} />;')
path.write_text(text)
print('flow and routes added')
