import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SideBarComponent from '../dashboard/SideBarComponent';
import { getRoleFromToken } from '../../utiles/authUtils';

jest.mock('../../utiles/authUtils', () => ({
    getRoleFromToken: jest.fn(),
}));

beforeEach(() => {
    getRoleFromToken.mockReturnValue('USER');
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

test('muestra el acceso a ventas', () => {
    render(
        <MemoryRouter initialEntries={['/inicio']}>
            <SideBarComponent />
        </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /venta/i })).toHaveAttribute('href', '/add-venta');
});

test('muestra el acceso a empresa abajo para administradores', () => {
    getRoleFromToken.mockReturnValue('ADMIN');

    render(
        <MemoryRouter initialEntries={['/inicio']}>
            <SideBarComponent />
        </MemoryRouter>
    );

    const companyLink = screen.getByRole('link', { name: /empresa/i });

    expect(companyLink).toHaveAttribute('href', '/empresa');
    expect(companyLink.closest('[data-testid="sidebar-bottom-section"]')).toBeInTheDocument();
});
