import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AddTipoPagoComponent from '../pagos/AddTipoPagoComponent';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';
import PlanDeCuentasServicio from '../../servicios/PlanDeCuentasServicio';

jest.mock('../../servicios/PaymentTypeServicio', () => ({
    crearTipoPago: jest.fn(),
}));

jest.mock('../../servicios/PlanDeCuentasServicio', () => ({
    getBalanceAccounts: jest.fn(),
}));

test('crea un tipo de pago con cuenta asociada', async () => {
    PaymentTypeServicio.crearTipoPago.mockResolvedValue({ data: { id: 1 } });
    PlanDeCuentasServicio.getBalanceAccounts.mockResolvedValue({
        data: [
            { id: 10, code: '1.1.1', name: 'Caja' },
            { id: 11, code: '1.1.2', name: 'Banco' },
        ],
    });

    await act(async () => {
        render(
            <MemoryRouter>
                <AddTipoPagoComponent />
            </MemoryRouter>
        );
    });

    await userEvent.type(screen.getByLabelText('Tipo de Pago:'), 'Efectivo');
    expect(await screen.findByRole('option', { name: '1.1.1 - Caja' })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Cuenta Asociada:'), '10');

    await userEvent.click(screen.getByRole('button', { name: /guardar tipo de pago/i }));

    await waitFor(() => {
        expect(PaymentTypeServicio.crearTipoPago).toHaveBeenCalledWith({
            type: 'Efectivo',
            accountId: 10,
        });
    });
});
