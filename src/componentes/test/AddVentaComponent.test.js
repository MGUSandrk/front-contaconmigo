import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AddVentaComponent from '../ventas/AddVentaComponent';
import ClienteServicio from '../../servicios/ClienteServicio';
import ProductoServicio from '../../servicios/ProductoServicio';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';
import VentaServicio from '../../servicios/VentaServicio';

jest.mock('../../servicios/ClienteServicio', () => ({
    listarClientes: jest.fn(),
}));

jest.mock('../../servicios/ProductoServicio', () => ({
    listarProductos: jest.fn(),
}));

jest.mock('../../servicios/PaymentTypeServicio', () => ({
    listarTiposPago: jest.fn(),
}));

jest.mock('../../servicios/VentaServicio', () => ({
    crearVenta: jest.fn(),
}));

const mockCatalogs = () => {
    ClienteServicio.listarClientes.mockResolvedValue({
        data: [
            { id: 1, fullName: 'Ana Perez', email: 'ana@test.com' },
            { id: 2, fullName: 'Luis Gomez', email: 'luis@test.com' },
        ],
    });
    ProductoServicio.listarProductos.mockResolvedValue({
        data: [
            { id: 10, name: 'Yerba', salePrice: 1200 },
            { id: 11, name: 'Azucar', salePrice: 900 },
        ],
    });
    PaymentTypeServicio.listarTiposPago.mockResolvedValue({
        data: [
            { id: 20, type: 'Efectivo' },
            { id: 21, type: 'Transferencia' },
        ],
    });
};

test('crea una venta con cliente, productos y pagos balanceados', async () => {
    mockCatalogs();
    VentaServicio.crearVenta.mockResolvedValue({ data: { id: 100 } });

    await act(async () => {
        render(
            <MemoryRouter>
                <AddVentaComponent />
            </MemoryRouter>
        );
    });

    await userEvent.type(screen.getByLabelText('Buscar Cliente:'), 'ana');
    expect(await screen.findByRole('option', { name: 'Ana Perez' })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Cliente:'), '1');

    await userEvent.type(screen.getByLabelText('Buscar Producto:'), 'yer');
    expect(await screen.findByRole('option', { name: /Yerba/ })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Producto:'), '10');
    await userEvent.clear(screen.getByLabelText('Cantidad:'));
    await userEvent.type(screen.getByLabelText('Cantidad:'), '2');
    await userEvent.click(screen.getByRole('button', { name: /agregar producto/i }));

    const saveButton = screen.getByRole('button', { name: /guardar venta/i });
    expect(saveButton).toBeDisabled();

    await userEvent.selectOptions(screen.getByLabelText('Metodo de Pago:'), '20');
    await userEvent.type(screen.getByLabelText('Monto del Pago:'), '2400');
    await userEvent.click(screen.getByRole('button', { name: /agregar pago/i }));

    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);

    await waitFor(() => {
        expect(VentaServicio.crearVenta).toHaveBeenCalledWith({
            idClient: 1,
            products: [
                {
                    idProduct: 10,
                    quantity: 2,
                },
            ],
            payments: [
                {
                    id: 20,
                    amount: 2400,
                },
            ],
        });
    });
});
