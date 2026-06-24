import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AddUsuarioComponent from '../dashboard/AddUsuarioComponent';
import UsuarioServicio from '../../servicios/UsuarioServicio';

jest.mock('../../servicios/UsuarioServicio', () => ({
    crearUsuario: jest.fn(),
}));

test('permite crear usuario con los roles actuales', async () => {
    UsuarioServicio.crearUsuario.mockResolvedValue({ data: { id: 2 } });

    render(
        <MemoryRouter>
            <AddUsuarioComponent />
        </MemoryRouter>
    );

    const roleSelect = screen.getByRole('combobox');

    expect(screen.getByRole('option', { name: 'Administrador' })).toHaveValue('ADMIN');
    expect(screen.getByRole('option', { name: 'Contable' })).toHaveValue('COUNTABLE');
    expect(screen.getByRole('option', { name: 'Vendedor' })).toHaveValue('SELLER');
    expect(screen.queryByRole('option', { name: 'Usuario' })).not.toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('Nombre de Usuario'), 'contador');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'secreta');
    await userEvent.selectOptions(roleSelect, 'COUNTABLE');
    await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: /guardar/i }));
    });

    expect(await screen.findByText("Usuario 'contador' registrado con éxito.")).toBeInTheDocument();
    expect(UsuarioServicio.crearUsuario).toHaveBeenCalledWith({
        username: 'contador',
        password: 'secreta',
        role: 'COUNTABLE',
    });
});
