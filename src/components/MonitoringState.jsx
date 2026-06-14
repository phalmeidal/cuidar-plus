import { AlertTriangle, LoaderCircle, RefreshCw } from 'lucide-react';
import './MonitoringState.css';

export default function MonitoringState({ loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="monitoring-state glass-card" role="status">
        <LoaderCircle className="state-spinner" size={30} />
        <h2>Carregando monitoramento</h2>
        <p>Consultando a API e o banco PostgreSQL.</p>
      </div>
    );
  }

  return (
    <div className="monitoring-state glass-card" role="alert">
      <AlertTriangle size={30} />
      <h2>API de monitoramento indisponível</h2>
      <p>{error}</p>
      <button className="primary-button" onClick={onRetry} type="button">
        <RefreshCw size={18} />
        Tentar novamente
      </button>
    </div>
  );
}
