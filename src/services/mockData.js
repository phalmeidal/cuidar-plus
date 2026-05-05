export const userProfile = {
  name: 'Misael',
  age: 72,
  room: 'Casa - Sala e quarto',
};

export const riskSummary = {
  score: 78,
  level: 'Alto',
  reason: 'Mais quedas nos últimos dias e mobilidade reduzida à noite.',
  trend: 'Aumento',
};

export const fallsSummary = {
  today: 1,
  sevenDays: 4,
  thirtyDays: 11,
  trendDirection: 'up',
  trendText: 'Aumento de 18% na última semana',
};

export const connectivity = {
  isConnected: true,
  disconnectedFor: '0 min',
  uptime: '98%',
  lastSync: 'há 2 min',
};

export const fallsOverTime = [
  { date: '01/04', falls: 0 },
  { date: '05/04', falls: 1 },
  { date: '09/04', falls: 0 },
  { date: '13/04', falls: 2 },
  { date: '17/04', falls: 1 },
  { date: '21/04', falls: 0 },
  { date: '25/04', falls: 2 },
  { date: '29/04', falls: 3 },
  { date: '03/05', falls: 2 },
];

export const fallsByPeriod = [
  { period: 'Manhã', falls: 2 },
  { period: 'Tarde', falls: 3 },
  { period: 'Noite', falls: 6 },
];

export const movementPatterns = [
  { day: 'Seg', mobility: 86, abrupt: 18 },
  { day: 'Ter', mobility: 82, abrupt: 22 },
  { day: 'Qua', mobility: 76, abrupt: 31 },
  { day: 'Qui', mobility: 72, abrupt: 34 },
  { day: 'Sex', mobility: 68, abrupt: 42 },
  { day: 'Sáb', mobility: 70, abrupt: 37 },
  { day: 'Dom', mobility: 64, abrupt: 46 },
];

export const connectivityHistory = [
  { day: 'Seg', online: 24 },
  { day: 'Ter', online: 22 },
  { day: 'Qua', online: 24 },
  { day: 'Qui', online: 21 },
  { day: 'Sex', online: 23 },
  { day: 'Sáb', online: 20 },
  { day: 'Dom', online: 24 },
];

export const fallEvents = [
  {
    id: 1,
    date: '05/05/2026',
    time: '07:42',
    intensity: 'Alta',
    type: 'Queda confirmada',
    location: 'Quarto',
    note: 'Impacto forte detectado próximo à cama.',
  },
  {
    id: 2,
    date: '03/05/2026',
    time: '22:18',
    intensity: 'Média',
    type: 'Desequilíbrio',
    location: 'Corredor',
    note: 'Movimento brusco seguido de parada curta.',
  },
  {
    id: 3,
    date: '29/04/2026',
    time: '21:05',
    intensity: 'Alta',
    type: 'Queda confirmada',
    location: 'Banheiro',
    note: 'Evento crítico em área de maior risco.',
  },
  {
    id: 4,
    date: '25/04/2026',
    time: '15:31',
    intensity: 'Baixa',
    type: 'Tropeço',
    location: 'Sala',
    note: 'Recuperação rápida sem impacto relevante.',
  },
  {
    id: 5,
    date: '17/04/2026',
    time: '09:14',
    intensity: 'Média',
    type: 'Desequilíbrio',
    location: 'Cozinha',
    note: 'Oscilação detectada durante caminhada.',
  },
];
