import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListarVentasComponent from '../ventas/ListarVentasComponent';
import VentaServicio from '../../servicios/VentaServicio';

jest.mock('../../servicios/VentaServicio', () => ({
    listarVentas: jest.fn(),
    obtenerFactura: jest.fn(),
}));

beforeEach(() => {
    VentaServicio.listarVentas.mockReset();
    VentaServicio.obtenerFactura.mockReset();
    global.URL.createObjectURL = jest.fn(() => 'blob:factura-12');
    global.URL.revokeObjectURL = jest.fn();
    window.open = jest.fn();
});

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

test('abre la factura de una venta en una nueva pestana', async () => {
    VentaServicio.listarVentas.mockResolvedValue({
        data: [
            {
                id: 12,
                dateCreated: '2026-06-30T14:45:00.000Z',
                clientFullName: 'Ana Perez',
                sellerUsername: 'vendedor1',
                entityName: 'Sucursal Centro',
                totalPrice: 1530.5,
            },
        ],
    });
    VentaServicio.obtenerFactura.mockResolvedValue({
        data: new Blob(['pdf'], { type: 'application/pdf' }),
    });

    render(
        <MemoryRouter>
            <ListarVentasComponent />
        </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: /factura/i }));

    await waitFor(() => {
        expect(VentaServicio.obtenerFactura).toHaveBeenCalledWith(12);
        expect(window.open).toHaveBeenCalledWith('blob:factura-12', '_blank', 'noopener,noreferrer');
    });
});

test('no muestra error cuando el navegador abre la factura sin devolver referencia de ventana', async () => {
    VentaServicio.listarVentas.mockResolvedValue({
        data: [
            {
                id: 12,
                dateCreated: '2026-06-30T14:45:00.000Z',
                clientFullName: 'Ana Perez',
                sellerUsername: 'vendedor1',
                entityName: 'Sucursal Centro',
                totalPrice: 1530.5,
            },
        ],
    });
    VentaServicio.obtenerFactura.mockResolvedValue({
        data: new Blob(['pdf'], { type: 'application/pdf' }),
    });
    window.open = jest.fn(() => null);

    render(
        <MemoryRouter>
            <ListarVentasComponent />
        </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: /factura/i }));

    await waitFor(() => {
        expect(window.open).toHaveBeenCalledWith('blob:factura-12', '_blank', 'noopener,noreferrer');
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
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
