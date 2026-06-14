import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../../src/pages/Dashboard.jsx';

describe('Dashboard API states', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading and then data returned by the API', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(response({ userProfile: { name: 'Misael', age: 72, room: 'Sala' } }))
      .mockResolvedValueOnce(
        response({
          riskSummary: { score: 78, level: 'Alto', reason: 'Atenção.' },
          fallsSummary: {
            today: 1,
            sevenDays: 4,
            thirtyDays: 11,
            trendDirection: 'up',
            trendText: 'Aumento',
          },
          connectivity: {
            isConnected: true,
            disconnectedFor: '0 min',
            uptime: '98%',
            lastSync: 'há 2 min',
          },
        }),
      )
      .mockResolvedValueOnce(response({ fallEvents: [] }))
      .mockResolvedValueOnce(response({}));

    render(<Dashboard currentUser={{ name: 'Cuidador' }} onNavigate={vi.fn()} />);

    expect(screen.getByText(/carregando monitoramento/i)).toBeInTheDocument();
    expect(await screen.findByText(/olá, cuidador/i)).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
  });

  it('shows an error and retries the API request', async () => {
    const user = userEvent.setup();
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('API fora do ar'));

    render(<Dashboard currentUser={{ name: 'Cuidador' }} onNavigate={vi.fn()} />);

    expect(await screen.findByText(/api de monitoramento indisponível/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(8));
  });
});

function response(body) {
  return {
    ok: true,
    json: () => Promise.resolve(body),
  };
}
