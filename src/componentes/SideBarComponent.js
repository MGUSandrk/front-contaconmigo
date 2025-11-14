import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { FaUsers } from 'react-icons/fa'; 
import { LuBookOpenCheck, LuNotebookTabs } from 'react-icons/lu';
import { MdAccountTree } from "react-icons/md";
import { TbMapDollar } from 'react-icons/tb';
import { getRoleFromToken } from '../utiles/authUtils';

// --- ICONOS Y ETIQUETAS ---
const MENU_ITEMS = [
    { to: "/inicio", icon: IoHomeOutline, label: "Inicio" },
    { to: "/plan-de-cuentas", icon: MdAccountTree, label: "Plan de Cuentas" },
    { to: "/asientos", icon: LuBookOpenCheck, label: "Reg. Asientos" },
    { to: "/libro-diario", icon: LuNotebookTabs, label: "Libro Diario" },
    { to: "/libro-mayor", icon: TbMapDollar, label: "Libro Mayor" },
];

// --- ESTILOS DE MARCA AJUSTADOS ---
const BASE_WIDTH = '4.5rem';    
const EXPANDED_WIDTH = '14rem'; 
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

        // CLAVE 1: Ajuste de padding: usa 0 de padding horizontal si está colapsado para permitir el centrado
        const linkPadding = isExpanded ? '15px 15px' : '15px 0'; 
        
        const linkStyle = {
            display: 'flex',
            alignItems: 'center',
            padding: linkPadding, // Aplicamos el padding condicional
            textDecoration: 'none',
            fontWeight: isActive ? '600' : '400',
            backgroundColor: isActive ? PRIMARY_COLOR : 'transparent',
            color: isActive ? TEXT_COLOR : TEXT_COLOR, 
            borderRadius: '0',
            transition: 'background-color 0.2s ease, color 0.2s ease'
        };

        const hoverStyle = {
            backgroundColor: isActive ? PRIMARY_COLOR : '#E0E0E0', 
            color: TEXT_COLOR,
        }

        // CLAVE 2: Contenedor para forzar el centrado
        const iconContainerStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-start' : 'center', // Centrado si colapsado
            width: isExpanded ? 'auto' : '100%', // Ancho completo si colapsado
        };


        return (
            <li className="nav-item w-100" key={item.to}>
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
                    <div style={iconContainerStyle}> {/* Contenedor para centrar el icono */}
                        <item.icon 
                            size={25} 
                            color={isActive ? TEXT_COLOR : ICON_INACTIVE_COLOR}
                        />
                        
                        {/* Texto (solo visible si está expandido) */}
                        {isExpanded && (
                            <span style={{ marginLeft: '1rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                {item.label}
                            </span>
                        )}
                    </div>
                </Link>
            </li>
        );
    };

    return (
        <div 
            className="d-flex flex-column flex-shrink-0 vh-100 border-end" 
            style={{ 
                width: isExpanded ? EXPANDED_WIDTH : BASE_WIDTH,
                backgroundColor: BACKGROUND_COLOR, 
                transition: 'width 0.3s ease',
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
                    <li className="nav-item w-100">
                        {renderLink({ to: '/usuarios', icon: FaUsers, label: 'Gestión Usuarios' })}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default SideBarComponent;