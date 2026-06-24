import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InicioComponent from '../dashboard/InicioComponent';
import PlanDeCuentasComponent from '../contabilidad/PlanDeCuentasComponent';
import PlanDeCuentasServicio from '../../servicios/PlanDeCuentasServicio';

jest.mock('../dashboard/SideBarComponent', () => () => <aside data-testid="main-sidebar" />);
jest.mock('../contabilidad/SidebarCuentasComponent', () => () => <aside data-testid="accounts-sidebar" />);
jest.mock('../contabilidad/InfoCuentasComponent', () => () => <main data-testid="account-info" />);

jest.mock('../../servicios/PlanDeCuentasServicio', () => ({
    getSaldoCuenta: jest.fn(),
    getResultado: jest.fn(),
}));

beforeEach(() => {
    PlanDeCuentasServicio.getSaldoCuenta.mockResolvedValue({ data: { balance: 0 } });
    PlanDeCuentasServicio.getResultado.mockResolvedValue({ data: { results: 0 } });
});

test('inicio mantiene el layout del sidebar a pantalla completa', async () => {
    render(
        <MemoryRouter>
            <InicioComponent />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(PlanDeCuentasServicio.getResultado).toHaveBeenCalled();
    });

    expect(screen.getByTestId('main-sidebar').parentElement).toHaveStyle({
        minHeight: 'var(--app-content-min-height)',
    });
});

test('plan de cuentas mantiene sus sidebars a pantalla completa', () => {
    render(
        <MemoryRouter>
            <PlanDeCuentasComponent />
        </MemoryRouter>
    );

    expect(screen.getByTestId('main-sidebar').parentElement).toHaveStyle({
        minHeight: 'var(--app-content-min-height)',
    });
});
