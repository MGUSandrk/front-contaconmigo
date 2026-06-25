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

test('muestra la lista de clientes con sus datos fiscales principales', async () => {
    ClienteServicio.listarClientes.mockResolvedValue({
        data: [
            {
                id: 1,
                fullName: 'Ana Perez',
                email: 'ana@test.com',
                cuit: '20-12345678-9',
                vatCondition: 'IVA_RESPONSABLE_INSCRIPTO',
                documentType: 'CUIT',
                documentNumber: '30123456789',
                commercialAddress: 'Calle 123',
            },
            {
                id: 2,
                fullName: 'Luis Gomez',
                email: 'luis@test.com',
                cuit: '',
                vatCondition: 'CONSUMIDOR_FINAL',
                documentType: null,
                documentNumber: null,
                commercialAddress: null,
            },
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
    expect(screen.getByText('Responsable Inscripto')).toBeInTheDocument();
    expect(screen.getByText('CUIT 30123456789')).toBeInTheDocument();
    expect(screen.getByText('Calle 123')).toBeInTheDocument();
    expect(screen.getByText('Consumidor Final')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /agregar cliente/i })).toHaveAttribute('href', '/add-cliente');
});
