import {
  connectivity,
  connectivityHistory,
  fallEvents,
  fallsByPeriod,
  fallsOverTime,
  fallsSummary,
  movementPatterns,
  riskSummary,
  userProfile,
} from '../services/mockData';

export function useMockMonitoring() {
  const highestPeriod = fallsByPeriod.reduce((max, item) =>
    item.falls > max.falls ? item : max,
  );

  const movementStatus =
    movementPatterns.at(-1).mobility < 70
      ? 'Redução de mobilidade'
      : movementPatterns.at(-1).abrupt > 40
        ? 'Movimentos bruscos'
        : 'Atividade normal';

  return {
    userProfile,
    riskSummary,
    fallsSummary,
    connectivity,
    fallsOverTime,
    fallsByPeriod,
    highestPeriod,
    movementPatterns,
    movementStatus,
    connectivityHistory,
    fallEvents,
  };
}
