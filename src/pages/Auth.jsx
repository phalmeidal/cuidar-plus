import { HeartPulse, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { adminCredentials, login, register } from '../services/authService.js';
import './Auth.css';

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  monitoredPerson: '',
};

export default function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    try {
      const user = isLogin ? login({ email: form.email, password: form.password }) : register(form);
      onAuthSuccess(user);
    } catch (authError) {
      setError(authError.message);
    }
  }

  function fillAdminLogin() {
    setMode('login');
    setForm((current) => ({
      ...current,
      email: adminCredentials.email,
      password: adminCredentials.password,
    }));
    setError('');
  }

  return (
    <section className="auth-page">
      <div className="auth-brand">
        <span className="auth-logo">
          <HeartPulse size={34} strokeWidth={2.5} />
        </span>
        <div>
          <p className="eyebrow">Bem-vindo</p>
          <h1>Cuidar+</h1>
          <p>Entre para acompanhar riscos, quedas e conectividade em tempo simulado.</p>
        </div>
      </div>

      <div className="auth-card glass-card">
        <div className="card-body">
          <div className="auth-tabs" role="tablist" aria-label="Acesso">
            <button
              className={isLogin ? 'active' : ''}
              onClick={() => setMode('login')}
              type="button"
            >
              Entrar
            </button>
            <button
              className={!isLogin ? 'active' : ''}
              onClick={() => setMode('register')}
              type="button"
            >
              Cadastro
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <label>
                  Nome completo
                  <span className="input-shell">
                    <UserRound size={18} />
                    <input
                      required
                      value={form.name}
                      onChange={(event) => updateField('name', event.target.value)}
                      placeholder="Seu nome"
                    />
                  </span>
                </label>
                <label>
                  Telefone
                  <span className="input-shell">
                    <UserRound size={18} />
                    <input
                      value={form.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </span>
                </label>
                <label>
                  Pessoa monitorada
                  <span className="input-shell">
                    <ShieldCheck size={18} />
                    <input
                      value={form.monitoredPerson}
                      onChange={(event) => updateField('monitoredPerson', event.target.value)}
                      placeholder="Ex: Dona Maria"
                    />
                  </span>
                </label>
              </>
            )}

            <label>
              E-mail
              <span className="input-shell">
                <Mail size={18} />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="voce@email.com"
                />
              </span>
            </label>

            <label>
              Senha
              <span className="input-shell">
                <LockKeyhole size={18} />
                <input
                  required
                  minLength={6}
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Minimo de 6 caracteres"
                />
              </span>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button className="primary-button auth-submit" type="submit">
              {isLogin ? 'Entrar no app' : 'Criar conta'}
            </button>
          </form>

          <button className="admin-shortcut" onClick={fillAdminLogin} type="button">
            <ShieldCheck size={17} />
            Preencher acesso de administrador
          </button>
        </div>
      </div>
    </section>
  );
}
