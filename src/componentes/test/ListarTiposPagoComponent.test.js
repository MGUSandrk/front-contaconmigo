import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListarTiposPagoComponent from '../pagos/ListarTiposPagoComponent';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';

jest.mock('../../servicios/PaymentTypeServicio', () => ({
    listarTiposPago: jest.fn(),
}));

jest.mock('../../utiles/authUtils', () => ({
    getRoleFromToken: () => 'ADMIN',
}));

test('muestra la lista de tipos de pago con cuenta asociada', async () => {
    PaymentTypeServicio.listarTiposPago.mockResolvedValue({
        data: [
            { id: 1, type: 'Efectivo', accountId: 10 },
            { id: 2, type: 'Transferencia', accountId: 11, accountCode: '1.1.2', accountName: 'Banco' },
        ],
    });

    render(
        <MemoryRouter>
            <ListarTiposPagoComponent />
        </MemoryRouter>
    );

    expect(await screen.findByText('Efectivo')).toBeInTheDocument();
    expect(screen.getByText('Cuenta #10')).toBeInTheDocument();
    expect(screen.getByText('1.1.2 - Banco')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /agregar tipo de pago/i })).toHaveAttribute('href', '/add-tipo-pago');
});
