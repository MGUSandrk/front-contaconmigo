import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EmpresaComponent from '../empresa/EmpresaComponent';
import EntityServicio from '../../servicios/EntityServicio';

jest.mock('../../servicios/EntityServicio', () => ({
    obtenerEntidad: jest.fn(),
    modificarEntidad: jest.fn(),
}));

jest.mock('../../utiles/authUtils', () => ({
    getRoleFromToken: () => 'ADMIN',
}));

test('carga y modifica nombre y metodo de costeo de la empresa', async () => {
    EntityServicio.obtenerEntidad.mockResolvedValue({
        data: {
            id: 1,
            name: 'Vieja empresa',
            costingMethod: 'FIFO',
        },
    });
    EntityServicio.modificarEntidad.mockResolvedValue({});

    await act(async () => {
        render(
            <MemoryRouter>
                <EmpresaComponent />
            </MemoryRouter>
        );
    });

    const nameInput = await screen.findByLabelText('Nombre de la Empresa:');
    expect(nameInput).toHaveValue('Vieja empresa');
    expect(screen.getByLabelText('Metodo de Costeo:')).toHaveValue('FIFO');

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Nueva empresa');
    await userEvent.selectOptions(screen.getByLabelText('Metodo de Costeo:'), 'WAC');
    await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
        expect(EntityServicio.modificarEntidad).toHaveBeenCalledWith({
            name: 'Nueva empresa',
            costingMethod: 'WAC',
        });
    });
    expect(await screen.findByText('Datos de empresa actualizados correctamente.')).toBeInTheDocument();
});
