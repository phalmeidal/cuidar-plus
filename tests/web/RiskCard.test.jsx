import { render, screen } from '@testing-library/react';
import RiskCard from '../../src/components/RiskCard.jsx';

describe('RiskCard', () => {
  it('renders the score and risk level', () => {
    render(
      <RiskCard
        risk={{
          score: 78,
          level: 'Alto',
          reason: 'Mais quedas nos últimos dias.',
        }}
      />,
    );

    expect(screen.getByText('77')).toBeInTheDocument();
    expect(screen.getByText('Alto')).toBeInTheDocument();
    expect(screen.getByLabelText('Score 78 de 100')).toBeInTheDocument();
  });
});
