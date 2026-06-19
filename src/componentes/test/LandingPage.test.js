import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

test('muestra el nuevo mensaje integral, servicios y contexto academico', () => {
    render(
        <MemoryRouter>
            <LandingPage />
        </MemoryRouter>
    );

    expect(screen.getByRole('heading', {
        name: /gestiona ventas, productos, clientes y contabilidad en un solo sistema/i,
    })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /iniciar sesion/i })).toHaveAttribute('href', '/login');

    expect(screen.getByRole('heading', { name: /^ventas$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^productos$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^productos por lote$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^clientes$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^contabilidad$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^reportes$/i })).toBeInTheDocument();

    expect(screen.getAllByText(/sistemas administrativos/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/nico alfaro/i)).toBeInTheDocument();
    expect(screen.getByText(/mirko sandrk/i)).toBeInTheDocument();
    expect(screen.getAllByText(/react/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/spring boot/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/postgresql/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/MGUSandrk\/front-contaconmigo/i)).toBeInTheDocument();
    expect(screen.getByText(/MGUSandrk\/back-contaconmigo/i)).toBeInTheDocument();
});
