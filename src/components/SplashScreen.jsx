import { HeartPulse } from 'lucide-react';
import './SplashScreen.css';

export default function SplashScreen() {
  return (
    <section className="splash" aria-label="Carregando Cuidar+">
      <div className="splash-card">
        <div className="splash-logo">
          <HeartPulse size={42} strokeWidth={2.5} />
        </div>
        <h1>Cuidar+</h1>
        <p>Monitoramento claro para agir antes do risco virar urgência.</p>
        <div className="loading-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
