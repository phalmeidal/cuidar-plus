import { BarChart3, ChevronRight, FileText } from 'lucide-react';
import MonitoringState from '../components/MonitoringState.jsx';
import RiskCard from '../components/RiskCard.jsx';
import { SummaryCards } from '../components/StatusCards.jsx';
import { useMonitoring } from '../hooks/useMonitoring.js';
import './Dashboard.css';

export default function Dashboard({ onNavigate, currentUser }) {
  const { data, error, loading, reload } = useMonitoring();

  if (!data) {
    return <MonitoringState loading={loading} error={error} onRetry={reload} />;
  }

  const { userProfile, riskSummary, fallsSummary, connectivity } = data;

  return (
    <section className="page dashboard-page">
      <header className="dashboard-hero">
        <div className="page-header">
          <p className="eyebrow">Painel de cuidado</p>
          <h1>Olá, {currentUser?.name || userProfile.name}</h1>
          <p>Visão rápida de quedas, risco atual e conexão dos sensores em {userProfile.room}.</p>
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={() => onNavigate('analytics')}>
            <BarChart3 size={18} />
            Ver Análises
            <ChevronRight size={18} />
          </button>
          <button className="secondary-button" onClick={() => onNavigate('details')}>
            <FileText size={18} />
            Detalhes
          </button>
        </div>
      </header>

      <RiskCard risk={riskSummary} />
      <SummaryCards fallsSummary={fallsSummary} connectivity={connectivity} />
    </section>
  );
}
