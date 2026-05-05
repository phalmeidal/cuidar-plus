import { BarChart3, ChevronRight, FileText } from 'lucide-react';
import RiskCard from '../components/RiskCard.jsx';
import { SummaryCards } from '../components/StatusCards.jsx';
import { useMockMonitoring } from '../hooks/useMockMonitoring.js';
import './Dashboard.css';

export default function Dashboard({ onNavigate }) {
  const { userProfile, riskSummary, fallsSummary, connectivity } = useMockMonitoring();

  return (
    <section className="page dashboard-page">
      <header className="dashboard-hero">
        <div className="page-header">
          <p className="eyebrow">Painel de cuidado</p>
          <h1>Olá, {userProfile.name}</h1>
          <p>
            Visão rápida de quedas, risco atual e conexão dos sensores em {userProfile.room}.
          </p>
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
