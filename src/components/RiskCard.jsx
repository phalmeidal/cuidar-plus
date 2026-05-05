import { AlertTriangle, ShieldCheck } from 'lucide-react';

const levelClass = {
  Baixo: 'green',
  Médio: 'yellow',
  Alto: 'red',
};

export default function RiskCard({ risk }) {
  const tone = levelClass[risk.level] ?? 'yellow';
  const Icon = risk.level === 'Baixo' ? ShieldCheck : AlertTriangle;

  return (
    <article className={`risk-card glass-card ${tone}`}>
      <div className="card-body risk-card-body">
        <div>
          <p className="eyebrow">Score de risco</p>
          <div className="risk-score-row">
            <strong>{risk.score}</strong>
            <span className={`badge ${tone}`}>
              <Icon size={18} />
              {risk.level}
            </span>
          </div>
          <p>{risk.reason}</p>
        </div>
        <div className="risk-ring" aria-label={`Score ${risk.score} de 100`}>
          <span>{risk.score}%</span>
        </div>
      </div>
    </article>
  );
}
