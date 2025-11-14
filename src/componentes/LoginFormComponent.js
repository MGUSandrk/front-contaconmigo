import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginServicio from "../servicios/LoginServicio";
import { FaChartLine } from 'react-icons/fa'; // Necesitas instalar react-icons si aún no lo has hecho: npm install react-icons

const LoginFormComponent = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // --- ESTILOS BASADOS EN LA LANDING PAGE ---
  const styles = {
    mainContainer: {
        // Fondo suave y limpio de la landing page
        background: 'linear-gradient(135deg, #F5E6E8 0%, #E8F4F8 100%)',
        minHeight: '100vh', 
        display: 'flex',
        // Centrado vertical
        alignItems: 'center',
        // Centrado horizontal
        justifyContent: 'center', 
        // Tipografía de la landing page
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    loginCard: {
        // Estilo de tarjeta moderna: bordes muy redondeados y sombra suave
        background: '#FFFFFF',
        borderRadius: '30px',
        padding: '2.5rem',
        marginBottom: '90px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1)', 
        border: '1px solid #F0F0F0'
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#2C3E50', // Color de texto principal
        marginBottom: '1.5rem'
    },
    buttonPrimary: {
        // Botón con el color de acento de la landing: #A8DADC
        background: '#A8DADC',
        color: '#2C3E50',
        borderRadius: '30px', // Forma de píldora
        padding: '10px 24px',
        fontWeight: '600',
        border: 'none',
        transition: 'all 0.3s ease'
    },
    formControl: {
        borderRadius: '10px',
        padding: '12px',
        border: '1px solid #E8E8E8'
    },
    logo: {
        color: '#2C3E50',
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '0.5rem'
    }
  };


  const handlLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Error! No ingresó un nombre de usuario!');
    } else if (!password.trim()) {
      setError('Error! No ingresó una contraseña!');
    } else {
      const user = { username, password }
      LoginServicio.authUsuario(user).then((response) => {
        console.log(response.data);
        const token = response.data.token;
        localStorage.setItem('token', token)

        navigate('/inicio');
      }).catch(err => {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          // Si el error viene del back
          setError(err.response.data.message);
        } else {
          // Si es un error genérico
          setError('Ocurrió un error al intentar iniciar sesión. Por favor, intenta de nuevo.');
        }
        // Limpia el campo contraseña
        setPassword('');
      })
    }
  }

  return (
    // Contenedor principal con fondo y centrado
    <div style={styles.mainContainer}>
      <div className='container'>
        <div className='row justify-content-center'> 
          {/* Columna con tamaño adecuado para login, centrada por justify-content-center */}
          <div className='col-md-6 col-lg-4'> 
            <div style={styles.loginCard}>
                
                {/* Logo y Título */}
                <div className="text-center mb-4">
                    <div style={styles.logo}>
                        <FaChartLine style={{ color: '#A8DADC', fontSize: '1.25rem' }} className="me-2" />
                        ContaConmigo
                    </div>
                    <h2 style={styles.title}>Iniciar Sesión</h2>
                </div>

              <form>
                <div className='form-group mb-3'>
                  <label className='form-label fw-bold' style={{ color: '#5A6C7D' }}>Usuario</label>
                  <input
                    type='text'
                    placeholder='Nombre Usuario'
                    name='username'
                    className='form-control'
                    style={styles.formControl}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className='form-group mb-4'>
                  <label className='form-label fw-bold' style={{ color: '#5A6C7D' }}>Contraseña</label>
                  <input
                    type='password'
                    placeholder='Contraseña'
                    name='password'
                    className='form-control'
                    style={styles.formControl}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className='alert alert-danger'>{error}</div>}
                <div className='d-grid'>
                  <button 
                    style={styles.buttonPrimary} 
                    className='btn btn-lg' 
                    onClick={(e) => handlLogin(e)}
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginFormComponent;