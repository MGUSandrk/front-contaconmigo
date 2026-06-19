import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

test('renders landing page', () => {
  render(<App />);
  const linkElement = screen.getByRole('link', { name: /iniciar sesion/i });
  expect(linkElement).toBeInTheDocument();
});
