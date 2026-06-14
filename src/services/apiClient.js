const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `A API respondeu com status ${response.status}.`);
  }

  return response.json();
}

export function getMonitoringData() {
  return Promise.all([
    request('/api/profile'),
    request('/api/summary'),
    request('/api/events'),
    request('/api/analytics'),
  ]).then(([profile, summary, events, analytics]) => ({
    ...profile,
    ...summary,
    ...events,
    ...analytics,
  }));
}

export function createFallEvent(event) {
  return request('/api/events', { method: 'POST', body: JSON.stringify(event) });
}
