import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AddClienteComponent from '../clientes/AddClienteComponent';
import ClienteServicio from '../../servicios/ClienteServicio';

jest.mock('../../servicios/ClienteServicio', () => ({
    crearCliente: jest.fn(),
}));

test('crea un cliente identificado con el contrato fiscal de la API', async () => {
    ClienteServicio.crearCliente.mockResolvedValue({ data: { id: 1 } });

    render(
        <MemoryRouter>
            <AddClienteComponent />
        </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Nombre Completo:'), 'Ana Perez');
    await userEvent.type(screen.getByLabelText('Email:'), 'ana@test.com');
    await userEvent.type(screen.getByLabelText('CUIT:'), '20-12345678-9');
    await userEvent.selectOptions(screen.getByLabelText('Condicion frente al IVA:'), 'IVA_RESPONSABLE_INSCRIPTO');
    await userEvent.selectOptions(screen.getByLabelText('Tipo de Documento:'), 'CUIT');
    await userEvent.type(screen.getByLabelText('Numero de Documento:'), '30123456789');
    await userEvent.type(screen.getByLabelText('Domicilio Comercial:'), 'Calle 123');

    await userEvent.click(screen.getByRole('button', { name: /guardar cliente/i }));

    await waitFor(() => {
        expect(ClienteServicio.crearCliente).toHaveBeenCalledWith({
            fullName: 'Ana Perez',
            email: 'ana@test.com',
            cuit: '20-12345678-9',
            vatCondition: 'IVA_RESPONSABLE_INSCRIPTO',
            documentType: 'CUIT',
            documentNumber: '30123456789',
            commercialAddress: 'Calle 123',
        });
    });
});

test('crea un consumidor final sin exigir documento ni domicilio', async () => {
    ClienteServicio.crearCliente.mockResolvedValue({ data: { id: 2 } });

    render(
        <MemoryRouter>
            <AddClienteComponent />
        </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Nombre Completo:'), 'Consumidor Final');
    await userEvent.type(screen.getByLabelText('Email:'), 'cf@test.com');
    await userEvent.selectOptions(screen.getByLabelText('Condicion frente al IVA:'), 'CONSUMIDOR_FINAL');

    await userEvent.click(screen.getByRole('button', { name: /guardar cliente/i }));

    await waitFor(() => {
        expect(ClienteServicio.crearCliente).toHaveBeenCalledWith({
            fullName: 'Consumidor Final',
            email: 'cf@test.com',
            cuit: '',
            vatCondition: 'CONSUMIDOR_FINAL',
            documentType: null,
            documentNumber: null,
            commercialAddress: null,
        });
    });
});
