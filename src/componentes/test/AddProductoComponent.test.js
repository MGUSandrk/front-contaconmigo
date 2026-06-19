import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AddProductoComponent from '../productos/AddProductoComponent';
import ProductoServicio from '../../servicios/ProductoServicio';

jest.mock('../../servicios/ProductoServicio', () => ({
    crearProducto: jest.fn(),
}));

test('crea un producto con sus lotes', async () => {
    ProductoServicio.crearProducto.mockResolvedValue({ data: { id: 1 } });

    render(
        <MemoryRouter>
            <AddProductoComponent />
        </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Nombre del Producto:'), 'Yerba');
    await userEvent.type(screen.getByLabelText('Precio de Venta:'), '1200');
    await userEvent.type(screen.getByLabelText('Precio Unitario:'), '800');
    await userEvent.type(screen.getByLabelText('Stock:'), '5');

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
        });
    });
});
