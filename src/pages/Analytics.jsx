import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Clock3, PlugZap, TrendingUp } from 'lucide-react';
import { useMockMonitoring } from '../hooks/useMockMonitoring.js';
import './Analytics.css';

const tooltipStyle = {
  border: '1px solid rgba(95, 126, 115, 0.18)',
  borderRadius: 14,
  boxShadow: '0 16px 36px rgba(20, 83, 45, 0.12)',
};

export default function Analytics() {
  const {
    fallsOverTime,
    fallsByPeriod,
    highestPeriod,
    movementPatterns,
    movementStatus,
    connectivity,
    connectivityHistory,
  } = useMockMonitoring();

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Análises</p>
        <h1>Comportamento e risco</h1>
        <p>Dados técnicos traduzidos em sinais simples para decisão rápida.</p>
      </header>

      <div className="grid two">
        <article className="glass-card">
          <div className="card-body">
            <div className="section-title">
              <span className="icon-bubble red">
                <TrendingUp size={21} />
              </span>
              <div>
                <h2>Frequência de quedas</h2>
                <p>Mais eventos recentes indicam atenção imediata.</p>
              </div>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer>
                <LineChart data={fallsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.18)" />
                  <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="falls"
                    name="Quedas"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#dc2626' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>

        <article className="glass-card">
          <div className="card-body">
            <div className="section-title">
              <span className="icon-bubble yellow">
                <Clock3 size={21} />
              </span>
              <div>
                <h2>Análise por horário</h2>
                <p>Maior incidência no período {highestPeriod.period.toLowerCase()}.</p>
              </div>
            </div>
            <span className="badge yellow">Prioridade: {highestPeriod.period}</span>
            <div className="chart-wrap">
              <ResponsiveContainer>
                <BarChart data={fallsByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.18)" />
                  <XAxis dataKey="period" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="falls" name="Quedas" fill="#eab308" radius={[12, 12, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>

        <article className="glass-card">
          <div className="card-body">
            <div className="section-title">
              <span className="icon-bubble">
                <Activity size={21} />
              </span>
              <div>
                <h2>Padrões de movimento</h2>
                <p>{movementStatus}. Caminhada mais lenta e mudanças bruscas subiram.</p>
              </div>
            </div>
            <span className="badge red">{movementStatus}</span>
            <div className="chart-wrap">
              <ResponsiveContainer>
                <LineChart data={movementPatterns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.18)" />
                  <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="mobility" name="Mobilidade" stroke="#16a34a" strokeWidth={3} />
                  <Line type="monotone" dataKey="abrupt" name="Movimentos bruscos" stroke="#dc2626" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>

        <article className="glass-card">
          <div className="card-body">
            <div className="section-title">
              <span className={connectivity.isConnected ? 'icon-bubble' : 'icon-bubble red'}>
                <PlugZap size={21} />
              </span>
              <div>
                <h2>Conectividade</h2>
                <p>Status atual do sensor e histórico de horas online.</p>
              </div>
            </div>
            <div className="status-large">
              <span className={connectivity.isConnected ? 'status-dot online' : 'status-dot offline'} />
              {connectivity.isConnected ? 'Conectado' : 'Desconectado'}
            </div>
            <div className="chart-wrap compact">
              <ResponsiveContainer>
                <BarChart data={connectivityHistory}>
                  <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="online" name="Horas online" fill="#16a34a" radius={[12, 12, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
