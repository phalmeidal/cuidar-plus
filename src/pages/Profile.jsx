import { CalendarDays, LogOut, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import { getUsersSummary } from '../services/authService.js';
import './Profile.css';

export default function Profile({ currentUser, onLogout }) {
  const isAdmin = currentUser.role === 'admin';
  const summary = isAdmin ? getUsersSummary() : null;

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Perfil</p>
        <h1>{currentUser.name}</h1>
        <p>
          Gerencie sua conta e confira o nivel de acesso liberado para este prototipo.
        </p>
      </header>

      <article className="profile-card glass-card">
        <div className="card-body">
          <div className="profile-avatar">
            <UserRound size={34} />
          </div>
          <div className="profile-main">
            <span className={`badge ${isAdmin ? 'red' : 'green'}`}>
              <ShieldCheck size={17} />
              {isAdmin ? 'Administrador' : 'Cuidador'}
            </span>
            <h2>{currentUser.email}</h2>
            <p>{currentUser.monitoredPerson}</p>
          </div>
        </div>
      </article>

      <div className="grid two">
        <article className="glass-card">
          <div className="card-body profile-info">
            <CalendarDays size={22} />
            <div>
              <h3>Conta criada</h3>
              <p>{currentUser.createdAt}</p>
            </div>
          </div>
        </article>
        <article className="glass-card">
          <div className="card-body profile-info">
            <UserRound size={22} />
            <div>
              <h3>Contato</h3>
              <p>{currentUser.phone}</p>
            </div>
          </div>
        </article>
      </div>

      {isAdmin && (
        <article className="glass-card admin-panel">
          <div className="card-body">
            <span className="badge red">
              <ShieldCheck size={17} />
              Area administrativa
            </span>
            <h2>Resumo do sistema</h2>
            <p>Acesso liberado para acompanhar contas mockadas deste dispositivo.</p>
            <div className="admin-stats">
              <div>
                <strong>{summary.totalUsers}</strong>
                <span>contas</span>
              </div>
              <div>
                <strong>{summary.admins}</strong>
                <span>admins</span>
              </div>
              <div>
                <strong>{summary.caregivers}</strong>
                <span>cuidadores</span>
              </div>
            </div>
          </div>
        </article>
      )}

      <button className="logout-button" onClick={onLogout} type="button">
        <LogOut size={18} />
        Sair da conta
      </button>
    </section>
  );
}
