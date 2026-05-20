import { Activity, BarChart3, HeartPulse, Home, ListChecks, UserRound } from 'lucide-react';
import './AppShell.css';

const navItems = [
  { id: 'dashboard', label: 'Inicio', icon: Home },
  { id: 'analytics', label: 'Analises', icon: BarChart3 },
  { id: 'details', label: 'Detalhes', icon: ListChecks },
  { id: 'profile', label: 'Perfil', icon: UserRound },
];

export default function AppShell({ activePage, onNavigate, currentUser, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegacao principal">
        <button className="brand" onClick={() => onNavigate('dashboard')} aria-label="Ir para inicio">
          <span className="brand-mark">
            <HeartPulse size={24} strokeWidth={2.5} />
          </span>
          <span>
            <strong>Cuidar+</strong>
            <small>monitoramento inteligente</small>
          </span>
        </button>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={activePage === item.id ? 'nav-item active' : 'nav-item'}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <Activity size={18} />
          <span>
            {currentUser?.role === 'admin' ? 'Acesso administrador ativo' : 'Dados atualizados em tempo simulado'}
          </span>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
