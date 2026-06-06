import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio hero heading', async () => {
  render(<App />);
  const heading = await screen.findByRole('heading', {
    name: /hello, my name is/i,
  });
  expect(heading).toBeInTheDocument();
});
