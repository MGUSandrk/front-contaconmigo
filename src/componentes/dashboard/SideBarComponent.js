import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { FaBoxOpen, FaCreditCard, FaShoppingCart, FaUserTie, FaUsers } from 'react-icons/fa'; 
import { LuBookOpenCheck, LuNotebookTabs } from 'react-icons/lu';
import { MdAccountTree } from "react-icons/md";
import { TbMapDollar } from 'react-icons/tb';
import { getRoleFromToken } from '../../utiles/authUtils';

// --- ICONOS Y ETIQUETAS ---
const MENU_ITEMS = [
    { to: "/inicio", icon: IoHomeOutline, label: "Inicio" },
    { to: "/add-venta", icon: FaShoppingCart, label: "Ventas" },
    { to: "/plan-de-cuentas", icon: MdAccountTree, label: "Plan de Cuentas" },
    { to: "/asientos", icon: LuBookOpenCheck, label: "Reg. Asientos" },
    { to: "/libro-diario", icon: LuNotebookTabs, label: "Libro Diario" },
    { to: "/libro-mayor", icon: TbMapDollar, label: "Libro Mayor" },
    { to: "/productos", icon: FaBoxOpen, label: "Productos" },
    { to: "/clientes", icon: FaUserTie, label: "Clientes" },
    { to: "/tipos-pago", icon: FaCreditCard, label: "Tipos de Pago" },
];

const BASE_WIDTH = '3.9rem';    
const EXPANDED_WIDTH = '14rem'; 
const ICON_RAIL_WIDTH = BASE_WIDTH;
const PRIMARY_COLOR = '#A8DADC';  
const TEXT_COLOR = '#2C3E50';     
const BACKGROUND_COLOR = '#F8F9FA'; 
const ICON_INACTIVE_COLOR = 'rgba(44, 62, 80, 0.7)'; 

const SideBarComponent = () => {

    const [isExpanded, setIsExpanded] = useState(false);
    const userRole = getRoleFromToken();
    const location = useLocation();

    // Función que renderiza un solo item de la barra lateral
    const renderLink = (item) => {
        const isActive = location.pathname === item.to;

        const linkStyle = {
            display: 'flex',
            alignItems: 'center',
            minHeight: '55px',
            padding: '0',
            textDecoration: 'none',
            fontWeight: isActive ? '600' : '400',
            backgroundColor: isActive ? PRIMARY_COLOR : 'transparent',
            color: isActive ? TEXT_COLOR : TEXT_COLOR, 
            borderRadius: '0',
            overflow: 'hidden',
            transition: 'background-color 0.2s ease, color 0.2s ease'
        };

        const hoverStyle = {
            backgroundColor: isActive ? PRIMARY_COLOR : '#E0E0E0', 
            color: TEXT_COLOR,
        }

        const iconRailStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: ICON_RAIL_WIDTH,
            minWidth: ICON_RAIL_WIDTH,
            flexShrink: 0,
            transform: isExpanded ? 'translateX(-4px)' : 'translateX(0)',
            transition: 'transform 0.45s ease',
        };

        const labelStyle = {
            display: 'inline-block',
            maxWidth: isExpanded ? '9rem' : '0',
            opacity: isExpanded ? 1 : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transform: isExpanded ? 'translateX(0)' : 'translateX(-6px)',
            transition: 'max-width 0.36s ease, opacity 0.22s ease, transform 0.36s ease',
        };

        return (
            <li className="nav-item w-90" key={item.to}>
                <Link 
                    to={item.to}
                    style={linkStyle}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = linkStyle.backgroundColor;
                    }}
                >
                    <div
                        style={iconRailStyle}
                        data-testid={`sidebar-icon-rail-${item.to}`}
                    >
                        <item.icon 
                            size={25} 
                            color={isActive ? TEXT_COLOR : ICON_INACTIVE_COLOR}
                        />
                    </div>
                    <span
                        style={labelStyle}
                        data-testid={`sidebar-label-${item.to}`}
                    >
                        {item.label}
                    </span>
                </Link>
            </li>
        );
    };

    return (
        <div 
            className="d-flex flex-column flex-shrink-0 vh-90 border-end" 
            data-testid="main-sidebar"
            style={{ 
                width: isExpanded ? EXPANDED_WIDTH : BASE_WIDTH,
                backgroundColor: BACKGROUND_COLOR, 
                transition: 'width 0.38s ease',
                position: 'sticky', 
                top: 0,
                zIndex: 10,
            }}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            
            {/* Menu Principal */}
            <ul 
                className="nav nav-pills flex-column mb-auto" 
                style={{ paddingTop: '15px' }} 
            >
                {MENU_ITEMS.map(renderLink)}
                
                {/* Enlace de Administrador Condicional */}
                {userRole === 'ADMIN' && (
                    renderLink({ to: '/usuarios', icon: FaUsers, label: 'Gestión Usuarios' })
                )}
            </ul>
        </div>
    );
};

export default SideBarComponent;
