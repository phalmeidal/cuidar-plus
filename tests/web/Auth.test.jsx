import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Auth from '../../src/pages/Auth.jsx';

describe('Auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('logs in with the demonstrative administrator account', async () => {
    const user = userEvent.setup();
    const onAuthSuccess = vi.fn();
    render(<Auth onAuthSuccess={onAuthSuccess} />);

    await user.click(screen.getByRole('button', { name: /preencher acesso/i }));
    await user.click(screen.getByRole('button', { name: /entrar no app/i }));

    expect(onAuthSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'admin@cuidar.plus', role: 'admin' }),
    );
  });
});
