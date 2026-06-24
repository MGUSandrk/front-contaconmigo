import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRouteInicio';
import { getRoleFromToken } from './authUtils';

jest.mock('./authUtils', () => ({
  getRoleFromToken: jest.fn(),
}));

test('renders nested routes through outlet when user has required role', () => {
  localStorage.setItem('token', 'fake-token');
  getRoleFromToken.mockReturnValue('USER');

  render(
    <MemoryRouter initialEntries={['/productos']}>
      <Routes>
        <Route element={<PrivateRoute requiredRole="USER" />}>
          <Route path="/productos" element={<div>Productos protegidos</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Productos protegidos')).toBeInTheDocument();
});

test('allows nested routes when user role is included in required roles', () => {
  localStorage.setItem('token', 'fake-token');
  getRoleFromToken.mockReturnValue('SELLER');

  render(
    <MemoryRouter initialEntries={['/ventas']}>
      <Routes>
        <Route element={<PrivateRoute requiredRole={['COUNTABLE', 'SELLER']} />}>
          <Route path="/ventas" element={<div>Ventas protegidas</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Ventas protegidas')).toBeInTheDocument();
});
