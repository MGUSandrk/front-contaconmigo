import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SideBarComponent from '../dashboard/SideBarComponent';
import { getRoleFromToken } from '../../utiles/authUtils';

jest.mock('../../utiles/authUtils', () => ({
    getRoleFromToken: jest.fn(),
}));

beforeEach(() => {
    getRoleFromToken.mockReturnValue('SELLER');
});

test('mantiene estable la columna de iconos y anima el texto al expandir y cerrar', () => {
    render(
        <MemoryRouter initialEntries={['/inicio']}>
            <SideBarComponent />
        </MemoryRouter>
    );

    const sidebar = screen.getByTestId('main-sidebar');
    const iconRail = screen.getByTestId('sidebar-icon-rail-/inicio');
    const label = screen.getByTestId('sidebar-label-/inicio');

    expect(sidebar).toHaveStyle({ width: '3.9rem' });
    expect(iconRail).toHaveStyle({
        width: '3.9rem',
        transform: 'translateX(0)',
    });
    expect(label).toHaveStyle({
        opacity: '0',
        maxWidth: '0',
    });

    fireEvent.mouseEnter(sidebar);

    expect(sidebar).toHaveStyle({ width: '14rem' });
    expect(iconRail).toHaveStyle({
        width: '3.9rem',
        transform: 'translateX(-4px)',
    });
    expect(label).toHaveStyle({
        opacity: '1',
        maxWidth: '9rem',
    });

    fireEvent.mouseLeave(sidebar);

    expect(iconRail).toHaveStyle({
        transform: 'translateX(0)',
        transition: 'transform 0.45s ease',
    });
    expect(label).toHaveStyle({
        opacity: '0',
        maxWidth: '0',
    });
});

test('muestra a vendedores los accesos de inicio, productos, clientes, ventas y tipos de pago', () => {
    render(
        <MemoryRouter initialEntries={['/inicio']}>
            <SideBarComponent />
        </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/inicio');
    expect(screen.getByRole('link', { name: /productos/i })).toHaveAttribute('href', '/productos');
    expect(screen.getByRole('link', { name: /clientes/i })).toHaveAttribute('href', '/clientes');
    expect(screen.getByRole('link', { name: /agregar venta/i })).toHaveAttribute('href', '/add-venta');
    expect(screen.getByRole('link', { name: /tipos de pago/i })).toHaveAttribute('href', '/tipos-pago');
    expect(screen.queryByRole('link', { name: /historial de ventas/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /plan de cuentas/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /gestión usuarios/i })).not.toBeInTheDocument();
});

test('muestra a contables los accesos contables y oculta los de ventas', () => {
    getRoleFromToken.mockReturnValue('COUNTABLE');

    render(
        <MemoryRouter initialEntries={['/inicio']}>
            <SideBarComponent />
        </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/inicio');
    expect(screen.getByRole('link', { name: /plan de cuentas/i })).toHaveAttribute('href', '/plan-de-cuentas');
    expect(screen.getByRole('link', { name: /reg. asientos/i })).toHaveAttribute('href', '/asientos');
    expect(screen.getByRole('link', { name: /libro diario/i })).toHaveAttribute('href', '/libro-diario');
    expect(screen.getByRole('link', { name: /libro mayor/i })).toHaveAttribute('href', '/libro-mayor');
    expect(screen.queryByRole('link', { name: /productos/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /agregar venta/i })).not.toBeInTheDocument();
});

test('muestra a administradores todos los accesos y empresa abajo', () => {
    getRoleFromToken.mockReturnValue('ADMIN');

    render(
        <MemoryRouter initialEntries={['/inicio']}>
            <SideBarComponent />
        </MemoryRouter>
    );

    const companyLink = screen.getByRole('link', { name: /empresa/i });

    expect(screen.getByRole('link', { name: /plan de cuentas/i })).toHaveAttribute('href', '/plan-de-cuentas');
    expect(screen.getByRole('link', { name: /productos/i })).toHaveAttribute('href', '/productos');
    expect(screen.getByRole('link', { name: /historial de ventas/i })).toHaveAttribute('href', '/ventas');
    expect(screen.getByRole('link', { name: /gestión usuarios/i })).toHaveAttribute('href', '/usuarios');
    expect(companyLink).toHaveAttribute('href', '/empresa');
    expect(companyLink.closest('[data-testid="sidebar-bottom-section"]')).toBeInTheDocument();
});
