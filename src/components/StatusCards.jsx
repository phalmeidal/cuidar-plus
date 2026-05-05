import { Activity, CalendarDays, PlugZap, TrendingDown, TrendingUp } from 'lucide-react';

export function SummaryCards({ fallsSummary, connectivity }) {
  const TrendIcon = fallsSummary.trendDirection === 'up' ? TrendingUp : TrendingDown;
  const trendTone = fallsSummary.trendDirection === 'up' ? 'red' : 'green';

  return (
    <section className="grid three">
      <article className="glass-card">
        <div className="card-body metric">
          <div>
            <p className="metric-value">{fallsSummary.today}</p>
            <p className="metric-label">queda hoje</p>
          </div>
          <span className="icon-bubble red">
            <Activity size={22} />
          </span>
        </div>
      </article>
      <article className="glass-card">
        <div className="card-body metric">
          <div>
            <p className="metric-value">{fallsSummary.sevenDays}</p>
            <p className="metric-label">últimos 7 dias</p>
          </div>
          <span className="icon-bubble yellow">
            <CalendarDays size={22} />
          </span>
        </div>
      </article>
      <article className="glass-card">
        <div className="card-body metric">
          <div>
            <p className="metric-value">{fallsSummary.thirtyDays}</p>
            <p className="metric-label">últimos 30 dias</p>
          </div>
          <span className={`icon-bubble ${trendTone}`}>
            <TrendIcon size={22} />
          </span>
        </div>
      </article>
      <article className="glass-card trend-card">
        <div className="card-body">
          <span className={`badge ${trendTone}`}>
            <TrendIcon size={17} />
            {fallsSummary.trendDirection === 'up' ? 'Aumento' : 'Redução'}
          </span>
          <p>{fallsSummary.trendText}. Atenção maior nos horários de rotina noturna.</p>
        </div>
      </article>
      <article className="glass-card connectivity-card">
        <div className="card-body">
          <div className="metric">
            <div>
              <span className={`badge ${connectivity.isConnected ? 'green' : 'red'}`}>
                <PlugZap size={17} />
                {connectivity.isConnected ? 'Conectado' : 'Desconectado'}
              </span>
              <p className="metric-label">Tempo desconectado: {connectivity.disconnectedFor}</p>
            </div>
            <p className="metric-value">{connectivity.uptime}</p>
          </div>
          <p>Última sincronização {connectivity.lastSync}.</p>
        </div>
      </article>
    </section>
  );
}
