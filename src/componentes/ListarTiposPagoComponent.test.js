import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListarTiposPagoComponent from './ListarTiposPagoComponent';
import PaymentTypeServicio from '../servicios/PaymentTypeServicio';

jest.mock('../servicios/PaymentTypeServicio', () => ({
    listarTiposPago: jest.fn(),
}));

jest.mock('../utiles/authUtils', () => ({
    getRoleFromToken: () => 'ADMIN',
}));

test('muestra la lista de tipos de pago con cuenta asociada', async () => {
    PaymentTypeServicio.listarTiposPago.mockResolvedValue({
        data: [
            { id: 1, type: 'Efectivo', accountId: 10 },
            { id: 2, type: 'Transferencia', account: { id: 11, code: '1.1.2', name: 'Banco' } },
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
