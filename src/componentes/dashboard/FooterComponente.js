import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const FooterComponente = () => {

    const styles = {
        footer: {
            background: '#F8F9FA',
            padding: '1.5rem 0',
            
            position: 'fixed',
            bottom: 0,
            width: '100%',
            zIndex: 1000, 
            borderTop: '1px solid #E8E8E8',
        },
        text: {
            color: '#5A6C7D', 
            margin: 0, 
            fontSize: '0.9rem'
        },
        brandText: {
            color: '#2C3E50', 
            fontWeight: '600', 
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start', // Mantiene ContaConmigo a la izquierda
        },
        brandIcon: {
            color: '#A8DADC', 
            fontSize: '1.25rem'
        }
    };

    return (
        <footer style={styles.footer}>
            <div className="container">
                {/* Usamos d-flex para controlar la alineación del row */}
                <div className="d-flex align-items-center justify-content-between">
                    
                    {/* 1. Marca (Pegada a la izquierda) */}
                    <div style={{ flexGrow: 0, paddingRight: '15px' }}>
                        <div style={styles.brandText}>
                            <FaChartLine style={styles.brandIcon} className="me-2" />
                            ContaConmigo
                        </div>
                    </div>
                    
                    {/* 2. Copyright (Centrado usando margin: auto para empujar) */}
                    <div style={{ flexGrow: 1, textAlign: 'center' }}>
                        <p style={styles.text}>© 2025 Desarrollado por Nicolás Alfaro y Mirko Sandrk.</p>
                    </div>

                    {/* 3. Columna fantasma para forzar el centrado del texto en el medio del footer */}
                    <div style={{ flexGrow: 0, paddingLeft: '15px', visibility: 'hidden' }}> 
                        <div style={styles.brandText}>
                             {/* Repetimos la marca para que ocupe el mismo espacio en el lado derecho */}
                            <FaChartLine style={styles.brandIcon} className="me-2" />
                            ContaConmigo
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterComponente;