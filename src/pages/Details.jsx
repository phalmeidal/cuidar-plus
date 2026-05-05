import { Filter, MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMockMonitoring } from '../hooks/useMockMonitoring.js';
import './Details.css';

const intensityClass = {
  Alta: 'red',
  Média: 'yellow',
  Baixa: 'green',
};

export default function Details() {
  const { fallEvents } = useMockMonitoring();
  const [period, setPeriod] = useState('Todos');
  const [type, setType] = useState('Todos');

  const filteredEvents = useMemo(() => {
    return fallEvents.filter((event) => {
      const hour = Number(event.time.split(':')[0]);
      const eventPeriod = hour < 12 ? 'Manhã' : hour < 18 ? 'Tarde' : 'Noite';
      return (period === 'Todos' || eventPeriod === period) && (type === 'Todos' || event.type === type);
    });
  }, [fallEvents, period, type]);

  const eventTypes = ['Todos', ...new Set(fallEvents.map((event) => event.type))];

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Detalhes</p>
        <h1>Eventos de quedas</h1>
        <p>Lista organizada por data, intensidade e contexto para acompanhamento rápido.</p>
      </header>

      <div className="filters glass-card">
        <div className="card-body filters-body">
          <div className="filter-title">
            <Filter size={20} />
            <strong>Filtros</strong>
          </div>
          <label>
            Período
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>
              {['Todos', 'Manhã', 'Tarde', 'Noite'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Tipo
            <select value={type} onChange={(event) => setType(event.target.value)}>
              {eventTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="events-list">
        {filteredEvents.map((event) => (
          <article className="event-item glass-card" key={event.id}>
            <div className="card-body event-body">
              <div className="event-date">
                <strong>{event.date}</strong>
                <span>{event.time}</span>
              </div>
              <div className="event-main">
                <span className={`badge ${intensityClass[event.intensity]}`}>
                  Intensidade {event.intensity}
                </span>
                <h2>{event.type}</h2>
                <p>{event.note}</p>
              </div>
              <div className="event-location">
                <MapPin size={18} />
                {event.location}
              </div>
            </div>
          </article>
        ))}

        {filteredEvents.length === 0 && (
          <div className="empty-state glass-card">
            <div className="card-body">
              <Search size={28} />
              <h2>Nenhum evento encontrado</h2>
              <p>Ajuste os filtros para visualizar outros registros mockados.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
