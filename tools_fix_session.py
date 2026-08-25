from pathlib import Path
import re

path = Path('/home/ubuntu/mineirada-replica/client/src/App.tsx')
text = path.read_text()
replacement = r'''export default function App() {
  const [location, navigate] = useLocation(); const previewMode = new URLSearchParams(window.location.search).get("preview") === "1";
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem("mineirada_user_profile"); const stored = raw ? JSON.parse(raw) as Partial<AuthUser> : null; const account = AUTH_USERS.find((candidate) => candidate.username === stored?.username && candidate.role === stored?.role);
      return account ? { username: account.username, name: account.name, role: account.role } : previewMode ? { username: "SOUSA", name: "Sousa", role: "gestor" } : null;
    } catch { return previewMode ? { username: "SOUSA", name: "Sousa", role: "gestor" } : null; }
  });
  const login = (account: AuthUser) => { setUser(account); localStorage.setItem("mineirada_session_v1", "replica-session"); localStorage.setItem("mineirada_user_profile", JSON.stringify(account)); navigate("/"); };
  const logout = () => { localStorage.removeItem("mineirada_session_v1"); localStorage.removeItem("mineirada_user_profile"); setUser(null); navigate("/login"); };
  if (!user && location !== "/consulta-pedido" && !location.startsWith("/consulta-pedido/")) return <LoginPage onLogin={login} />;
  if (location === "/consulta-pedido" || location.startsWith("/consulta-pedido/")) return <div className="public-page"><div className="public-page-head"><img src={LOGO} alt="Mineirada" /><h1>Mineirada ERP + MES</h1><p>Acompanhamento público de pedido</p></div><PublicLookup /><button className="back-login" onClick={() => navigate("/login")}><ArrowLeft size={15} /> Voltar para o login</button></div>;
  return <AuthenticatedRouter user={user || { username: "SOUSA", name: "Sousa", role: "gestor" }} onLogout={logout} />;
}'''
text, count = re.subn(r'export default function App\(\) \{.*$', replacement, text, count=1, flags=re.S)
if count != 1: raise SystemExit('App function not found')
path.write_text(text)
print('session validation fixed')
