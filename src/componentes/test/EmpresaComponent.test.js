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

test('carga y modifica los datos fiscales de la empresa', async () => {
    EntityServicio.obtenerEntidad.mockResolvedValue({
        data: {
            id: 1,
            name: 'Vieja empresa',
            costingMethod: 'FIFO',
            cuit: '30123456789',
            commercialAddress: 'Calle 123',
            grossIncomeNumber: '12345',
            vatCondition: 'IVA_RESPONSABLE_INSCRIPTO',
            activityStartDate: '2024-03-15T00:00:00.000+00:00',
            salesPoint: 1,
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
    expect(screen.getByLabelText('CUIT:')).toHaveValue('30123456789');
    expect(screen.getByLabelText('Domicilio Comercial:')).toHaveValue('Calle 123');
    expect(screen.getByLabelText('Numero de Ingresos Brutos:')).toHaveValue('12345');
    expect(screen.getByLabelText('Condicion frente al IVA:')).toHaveValue('IVA_RESPONSABLE_INSCRIPTO');
    expect(screen.getByLabelText('Inicio de Actividad:')).toHaveValue('2024-03-15');
    expect(screen.getByLabelText('Punto de Venta:')).toHaveValue(1);

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Nueva empresa');
    await userEvent.selectOptions(screen.getByLabelText('Metodo de Costeo:'), 'WAC');
    await userEvent.clear(screen.getByLabelText('CUIT:'));
    await userEvent.type(screen.getByLabelText('CUIT:'), '27234567890');
    await userEvent.clear(screen.getByLabelText('Domicilio Comercial:'));
    await userEvent.type(screen.getByLabelText('Domicilio Comercial:'), 'Avenida 456');
    await userEvent.clear(screen.getByLabelText('Numero de Ingresos Brutos:'));
    await userEvent.type(screen.getByLabelText('Numero de Ingresos Brutos:'), '67890');
    await userEvent.selectOptions(screen.getByLabelText('Condicion frente al IVA:'), 'RESPONSABLE_MONOTRIBUTO');
    await userEvent.clear(screen.getByLabelText('Inicio de Actividad:'));
    await userEvent.type(screen.getByLabelText('Inicio de Actividad:'), '2024-04-20');
    await userEvent.clear(screen.getByLabelText('Punto de Venta:'));
    await userEvent.type(screen.getByLabelText('Punto de Venta:'), '2');
    await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
        expect(EntityServicio.modificarEntidad).toHaveBeenCalledWith({
            name: 'Nueva empresa',
            costingMethod: 'WAC',
            cuit: '27234567890',
            commercialAddress: 'Avenida 456',
            grossIncomeNumber: '67890',
            vatCondition: 'RESPONSABLE_MONOTRIBUTO',
            activityStartDate: '2024-04-20T00:00:00.000Z',
            salesPoint: 2,
        });
    });
    expect(await screen.findByText('Datos de empresa actualizados correctamente.')).toBeInTheDocument();
});
