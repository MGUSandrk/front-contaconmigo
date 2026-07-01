import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ListarProductosComponent from '../productos/ListarProductosComponent';
import ProductoServicio from '../../servicios/ProductoServicio';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';

jest.mock('../../servicios/ProductoServicio', () => ({
    listarProductos: jest.fn(),
    crearLotProducto: jest.fn(),
}));

jest.mock('../../servicios/PaymentTypeServicio', () => ({
    listarTiposPago: jest.fn(),
}));

jest.mock('../../utiles/authUtils', () => ({
    getRoleFromToken: () => 'ADMIN',
}));

test('muestra productos con cantidad total del backend y permite ver los lotes', async () => {
    ProductoServicio.listarProductos.mockResolvedValue({
        data: [
            {
                id: 1,
                name: 'Yerba',
                salePrice: 1200,
                totalStock: 20,
                lots: [
                    { id: 10, unitPrice: 800, stock: 5 },
                    { id: 11, unitPrice: 850, stock: 7 },
                ],
            },
            {
                id: 2,
                name: 'Azucar',
                salePrice: 900,
                totalStock: 3,
                lots: [
                    { id: 12, unitPrice: 500, stock: 3 },
                ],
            },
        ],
    });

    render(
        <MemoryRouter>
            <ListarProductosComponent />
        </MemoryRouter>
    );

    expect(await screen.findByText('Yerba')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /ver lotes de yerba/i }));

    expect(screen.getByRole('dialog', { name: /lotes de yerba/i })).toBeInTheDocument();
    expect(screen.getByText('$ 800,00')).toBeInTheDocument();
    expect(screen.getByText('$ 850,00')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /cerrar/i }));

    expect(screen.queryByRole('dialog', { name: /lotes de yerba/i })).not.toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('Buscar producto por nombre'), 'azu');

    await waitFor(() => {
        expect(screen.queryByText('Yerba')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Azucar')).toBeInTheDocument();
});

test('permite agregar un lot con pagos desde la lista de productos', async () => {
    ProductoServicio.listarProductos.mockResolvedValue({
        data: [
            {
                id: 1,
                name: 'Yerba',
                salePrice: 1200,
                totalStock: 20,
                lots: [
                    { id: 10, unitPrice: 800, stock: 5 },
                ],
            },
        ],
    });
    ProductoServicio.crearLotProducto.mockResolvedValue({ data: { id: 99 } });
    PaymentTypeServicio.listarTiposPago.mockResolvedValue({
        data: [
            { id: 1, type: 'Efectivo', balance: 5000 },
            { id: 2, type: 'Transferencia', balance: 2500 },
        ],
    });

    render(
        <MemoryRouter>
            <ListarProductosComponent />
        </MemoryRouter>
    );

    expect(await screen.findByText('Yerba')).toBeInTheDocument();

    await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: /agregar lot a yerba/i }));
    });

    expect(screen.getByRole('dialog', { name: /agregar lot a yerba/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del Producto:')).toHaveValue('Yerba');
    expect(screen.getByLabelText('Precio de Venta:')).toHaveValue(1200);

    await userEvent.type(screen.getByLabelText('Precio Unitario:'), '800');
    await userEvent.type(screen.getByLabelText('Stock:'), '5');
    expect(await screen.findByRole('option', { name: 'Efectivo' })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Metodo de Pago:'), '1');
    await userEvent.type(screen.getByLabelText('Monto del Pago:'), '4000');
    await userEvent.click(screen.getByRole('button', { name: /agregar pago/i }));

    await userEvent.click(screen.getByRole('button', { name: /guardar lot/i }));

    await waitFor(() => {
        expect(ProductoServicio.crearLotProducto).toHaveBeenCalledWith(1, {
            lot: {
                unitPrice: 800,
                stock: 5,
            },
            payments: [
                {
                    id: '1',
                    amount: '4000',
                },
            ],
        });
    });
    await waitFor(() => {
        expect(ProductoServicio.listarProductos).toHaveBeenCalledTimes(2);
    });
});
