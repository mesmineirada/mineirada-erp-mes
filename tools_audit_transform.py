from pathlib import Path
import re

path = Path('/home/ubuntu/mineirada-replica/client/src/App.tsx')
text = path.read_text()
new_dashboard = '''function Dashboard() {
  const [, navigate] = useLocation();
  return <div className="page-content"><PageHeader title="Dashboard" description="Visão geral do sistema, baseada nos registros cadastrados"><Button variant="outline" icon={ClipboardList} onClick={() => navigate("/almoxarifado/requisicoes")}>Requisições</Button><Button icon={Database} onClick={() => navigate("/cadastros/clientes")}>Começar cadastros</Button></PageHeader><div className="metrics-grid six"><MetricCard label="OPs Abertas" value="0" sub="sem registros" icon={ClipboardList} /><MetricCard label="OPs Atrasadas" value="0" sub="sem registros" icon={AlertTriangle} tone="danger" /><MetricCard label="Produção Hoje" value="0 kg" sub="sem apontamentos" icon={Factory} tone="success" /><MetricCard label="Pedidos Pend." value="0" sub="sem registros" icon={Truck} tone="info" /><MetricCard label="Alertas Estoque" value="0" sub="sem registros" icon={Boxes} tone="warning" /><MetricCard label="OMs Abertas" value="0" sub="sem registros" icon={Wrench} tone="danger" /></div><div className="panel empty-state large-empty"><Database size={42} /><h2>O sistema está pronto para receber dados</h2><p>Cadastre clientes, fornecedores, produtos, matérias-primas, máquinas e funcionários para alimentar os indicadores.</p><Button icon={Plus} onClick={() => navigate("/cadastros/clientes")}>Abrir cadastros</Button></div></div>;
}'''
updated, count = re.subn(r'function Dashboard\(\) \{.*?\n\}\n\nfunction CrudPage', new_dashboard + '\n\nfunction CrudPage', text, count=1, flags=re.S)
if count != 1:
    raise SystemExit('Dashboard block not found')
path.write_text(updated)
print('dashboard replaced')
