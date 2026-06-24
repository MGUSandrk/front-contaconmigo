import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AddProductoComponent from '../productos/AddProductoComponent';
import ProductoServicio from '../../servicios/ProductoServicio';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';

jest.mock('../../servicios/ProductoServicio', () => ({
    crearProducto: jest.fn(),
}));

jest.mock('../../servicios/PaymentTypeServicio', () => ({
    listarTiposPago: jest.fn(),
}));

test('crea un producto con sus lotes', async () => {
    ProductoServicio.crearProducto.mockResolvedValue({ data: { id: 1 } });
    PaymentTypeServicio.listarTiposPago.mockResolvedValue({
        data: [
            { id: 1, type: 'Efectivo', balance: 5000 },
            { id: 2, type: 'Transferencia', balance: 2500 },
        ],
    });

    await act(async () => {
        render(
            <MemoryRouter>
                <AddProductoComponent />
            </MemoryRouter>
        );
    });

    await userEvent.type(screen.getByLabelText('Nombre del Producto:'), 'Yerba');
    await userEvent.type(screen.getByLabelText('Precio de Venta:'), '1200');
    await userEvent.type(screen.getByLabelText('Precio Unitario:'), '800');
    await userEvent.type(screen.getByLabelText('Stock:'), '5');
    expect(await screen.findByRole('option', { name: 'Efectivo' })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Metodo de Pago:'), '1');
    expect(screen.getByText('Monto disponible: $ 5.000,00')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Monto del Pago:'), '4000');
    await userEvent.click(screen.getByRole('button', { name: /agregar pago/i }));

    await userEvent.click(screen.getByRole('button', { name: /guardar producto/i }));

    await waitFor(() => {
        expect(ProductoServicio.crearProducto).toHaveBeenCalledWith({
            name: 'Yerba',
            salePrice: 1200,
            lots: [
                {
                    unitPrice: 800,
                    stock: 5,
                },
            ],
            payments: [
                {
                    id: '1',
                    amount: '4000',
                },
            ],
        });
    });
});

test('no permite guardar hasta que el pendiente sea cero', async () => {
    ProductoServicio.crearProducto.mockResolvedValue({ data: { id: 1 } });
    PaymentTypeServicio.listarTiposPago.mockResolvedValue({
        data: [
            { id: 1, type: 'Efectivo' },
            { id: 2, type: 'Transferencia' },
        ],
    });

    await act(async () => {
        render(
            <MemoryRouter>
                <AddProductoComponent />
            </MemoryRouter>
        );
    });

    await userEvent.type(screen.getByLabelText('Nombre del Producto:'), 'Yerba');
    await userEvent.type(screen.getByLabelText('Precio de Venta:'), '1200');
    await userEvent.type(screen.getByLabelText('Precio Unitario:'), '800');
    await userEvent.type(screen.getByLabelText('Stock:'), '5');

    const saveButton = screen.getByRole('button', { name: /guardar producto/i });
    expect(saveButton).toBeDisabled();

    expect(await screen.findByRole('option', { name: 'Efectivo' })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Metodo de Pago:'), '1');
    await userEvent.type(screen.getByLabelText('Monto del Pago:'), '3000');
    await userEvent.click(screen.getByRole('button', { name: /agregar pago/i }));

    expect(saveButton).toBeDisabled();

    await userEvent.selectOptions(screen.getByLabelText('Metodo de Pago:'), '2');
    await userEvent.type(screen.getByLabelText('Monto del Pago:'), '1000');
    await userEvent.click(screen.getByRole('button', { name: /agregar pago/i }));

    expect(saveButton).toBeEnabled();
});
