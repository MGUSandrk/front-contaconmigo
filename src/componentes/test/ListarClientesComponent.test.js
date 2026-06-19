import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListarClientesComponent from '../clientes/ListarClientesComponent';
import ClienteServicio from '../../servicios/ClienteServicio';

jest.mock('../../servicios/ClienteServicio', () => ({
    listarClientes: jest.fn(),
}));

jest.mock('../../utiles/authUtils', () => ({
    getRoleFromToken: () => 'ADMIN',
}));

test('muestra la lista de clientes con sus datos principales', async () => {
    ClienteServicio.listarClientes.mockResolvedValue({
        data: [
            { id: 1, fullName: 'Ana Perez', email: 'ana@test.com', cuit: '20-12345678-9' },
            { id: 2, fullName: 'Luis Gomez', email: 'luis@test.com', cuit: '20-98765432-1' },
        ],
    });

    render(
        <MemoryRouter>
            <ListarClientesComponent />
        </MemoryRouter>
    );

    expect(await screen.findByText('Ana Perez')).toBeInTheDocument();
    expect(screen.getByText('ana@test.com')).toBeInTheDocument();
    expect(screen.getByText('20-12345678-9')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /agregar cliente/i })).toHaveAttribute('href', '/add-cliente');
});
