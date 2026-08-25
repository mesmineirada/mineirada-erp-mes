from pathlib import Path

path = Path('/home/ubuntu/mineirada-replica/client/src/App.tsx')
text = path.read_text()
if 'function AppLayout' in text:
    print('layout already exists')
    raise SystemExit(0)

layout = r'''function Sidebar({ user, onLogout, open, onClose }: { user: AuthUser; onLogout: () => void; open: boolean; onClose: () => void }) {
  const [, navigate] = useLocation(); const [expanded, setExpanded] = useState<Record<string, boolean>>({ Cadastros: true, Almoxarifado: true, Estoques: true, Produção: true });
  const canSee = (item: MenuItem) => !item.adminOnly || user.role === "gestor" || user.role === "admin";
  const renderItem = (item: MenuItem, nested = false) => { if (!canSee(item)) return null; const children = item.children?.filter(canSee) || []; const active = item.href === "/" ? location.pathname === "/" : item.href && location.pathname === item.href; return <div key={item.label}><button className={cn("nav-item", nested && "nav-item-nested", active && "active")} onClick={() => { if (item.href) { navigate(item.href); onClose(); } else if (children.length) setExpanded((state) => ({ ...state, [item.label]: !state[item.label] })); }}><item.icon size={16} /><span>{item.label}</span>{children.length > 0 && <ChevronDown size={14} className={expanded[item.label] ? "rotate-180" : ""} />}</button>{children.length > 0 && expanded[item.label] && <div className="nav-children">{children.map((child) => renderItem(child, true))}</div>}</div>; };
  return <aside className={cn("sidebar", open && "open")}><div className="sidebar-brand"><img src={LOGO} alt="Mineirada" /><div><b>Mineirada</b><small>ERP + MES · Manual...</small></div><button className="icon-button sidebar-close" onClick={onClose}><X size={16} /></button></div><nav className="sidebar-nav">{menuItems.map((item) => renderItem(item))}</nav><div className="sidebar-user"><div><strong>{user.name}</strong><small>{roleLabels[user.role]}</small></div><button className="icon-button" onClick={onLogout} aria-label="Sair"><LogOut size={16} /></button></div></aside>;
}

function AppLayout({ children, user, onLogout }: { children: ReactNode; user: AuthUser; onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); const [location] = useLocation();
  return <div className="app-shell"><Sidebar user={user} onLogout={onLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="app-main"><header className="topbar"><button className="menu-button" onClick={() => setSidebarOpen(true)}><Menu size={19} /></button><div className="breadcrumb"><span>Mineirada ERP + MES</span><ChevronRight size={14} /><b>{formatTitle(location)}</b></div><div className="topbar-actions"><button className="icon-button" aria-label="Alternar tema"><Moon size={17} /></button><div className="profile-chip"><span className="avatar"><CircleUserRound size={16} /></span><div><b>{user.username}</b><small>{roleLabels[user.role]}</small></div><ChevronDown size={14} /></div></div></header><main className="main-scroll">{children}</main></div>{sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}</div>;
}

function PlaceholderPage({ title, description, construction = false }: { title: string; description: string; construction?: boolean }) {
  return <div className="page-content"><PageHeader title={title} description={description} /><div className="panel empty-state large-empty"><Database size={42} /><h2>{construction ? "Módulo em preparação" : "Nenhum registro disponível"}</h2><p>{construction ? "Esta área foi mapeada e está pronta para receber o fluxo específico do módulo." : "Os dados desta tela aparecerão após os cadastros e operações correspondentes."}</p></div></div>;
}

'''
text = text.replace('function AuthenticatedRouter', layout + 'function AuthenticatedRouter', 1)
path.write_text(text)
print('layout restored')
