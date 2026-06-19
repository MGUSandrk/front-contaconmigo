import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaChartLine } from 'react-icons/fa'; 
import { IoLogOutOutline } from "react-icons/io5"; // CAMBIO: Nuevo icono moderno

const HeaderComponente = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === '/login' || location.pathname === '/'; 

  // --- ESTILOS BASADOS EN LA LANDING PAGE ---
  const styles = {
    navbar: {
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E8E8', 
        padding: '0.50rem 0'
    },
    brandText: {
        color: '#2C3E50', 
        fontSize: '1.5rem',
        fontWeight: '700', 
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none'
    },
    brandIcon: {
        color: '#A8DADC', 
        fontSize: '1.25rem'
    },
    logoutLink: { // Nuevo estilo para el enlace completo
        color: '#5A6C7D', 
        transition: 'color 0.3s ease',
        display: 'flex',
        alignItems: 'center', // Alinea el ícono y el texto verticalmente
        textDecoration: 'none',
        fontWeight: '500',
    },
    logoutIcon: {
        // Estilo del icono (un gris sutil que no sea tan fuerte como el negro)
        color: '#5A6C7D', 
        transition: 'color 0.3s ease',
        marginRight: '0.4rem', // Espacio entre el icono y el texto
    }
  };

  return (
    <div>
      <header>
        <nav className='navbar navbar-expand-md' style={styles.navbar}>
          <div className='container-fluid d-flex justify-content-between w-100 px-4'>
            
            {/* Logo / Marca */}
            <a 
              href='/inicio' 
              className='navbar-brand' 
              style={styles.brandText}
            >
              <FaChartLine style={styles.brandIcon} className="me-2" />
              ContaConmigo
            </a>
            
            {/* Renderizado Condicional del Logout */}
            {!isLoginPage && (
              <a 
                href='/login' 
                className='nav-link' 
                onClick={() => localStorage.removeItem('token')}
                style={styles.logoutLink} // Aplicamos el estilo de Flexbox
              >
                <IoLogOutOutline // CAMBIO: Usamos el nuevo ícono
                  size={24} // Un tamaño más estándar
                  style={styles.logoutIcon}
                  title="Cerrar Sesión" 
                /> {/* CAMBIO: Agregamos el texto */}
              </a>
            )} 
           
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderComponente;