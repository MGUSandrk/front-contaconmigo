import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListarVentasComponent from '../ventas/ListarVentasComponent';
import VentaServicio from '../../servicios/VentaServicio';

jest.mock('../../servicios/VentaServicio', () => ({
    listarVentas: jest.fn(),
}));

test('muestra el historial de ventas con fecha y total formateados', async () => {
    VentaServicio.listarVentas.mockResolvedValue({
        data: [
            {
                id: 12,
                dateCreated: '2026-06-30T14:45:00.000Z',
                clientId: 4,
                clientFullName: 'Ana Perez',
                sellerId: 7,
                sellerUsername: 'vendedor1',
                entityId: 2,
                entityName: 'Sucursal Centro',
                totalPrice: 1530.5,
            },
        ],
    });

    render(
        <MemoryRouter>
            <ListarVentasComponent />
        </MemoryRouter>
    );

    expect(await screen.findByText('Ana Perez')).toBeInTheDocument();
    expect(screen.getByText('vendedor1')).toBeInTheDocument();
    expect(screen.getByText('Sucursal Centro')).toBeInTheDocument();
    expect(screen.getByText('$ 1.530,50')).toBeInTheDocument();
    expect(screen.getByText(/30\/6\/2026/)).toBeInTheDocument();
});

test('muestra estado vacio cuando no hay ventas', async () => {
    VentaServicio.listarVentas.mockResolvedValue({ data: [] });

    render(
        <MemoryRouter>
            <ListarVentasComponent />
        </MemoryRouter>
    );

    expect(await screen.findByText('No hay ventas registradas.')).toBeInTheDocument();
});

test('muestra el mensaje de error del backend', async () => {
    VentaServicio.listarVentas.mockRejectedValue({
        response: {
            data: {
                message: 'No se pudo consultar ventas',
            },
        },
    });

    render(
        <MemoryRouter>
            <ListarVentasComponent />
        </MemoryRouter>
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo consultar ventas');
});
