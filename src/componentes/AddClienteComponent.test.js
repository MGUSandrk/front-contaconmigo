import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AddClienteComponent from './AddClienteComponent';
import ClienteServicio from '../servicios/ClienteServicio';

jest.mock('../servicios/ClienteServicio', () => ({
    crearCliente: jest.fn(),
}));

test('crea un cliente con el contrato de la API', async () => {
    ClienteServicio.crearCliente.mockResolvedValue({ data: { id: 1 } });

    render(
        <MemoryRouter>
            <AddClienteComponent />
        </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Nombre Completo:'), 'Ana Perez');
    await userEvent.type(screen.getByLabelText('Email:'), 'ana@test.com');
    await userEvent.type(screen.getByLabelText('CUIT:'), '20-12345678-9');

    await userEvent.click(screen.getByRole('button', { name: /guardar cliente/i }));

    await waitFor(() => {
        expect(ClienteServicio.crearCliente).toHaveBeenCalledWith({
            fullName: 'Ana Perez',
            email: 'ana@test.com',
            cuit: '20-12345678-9',
        });
    });
});
