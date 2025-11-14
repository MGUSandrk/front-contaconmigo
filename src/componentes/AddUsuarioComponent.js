import React, { useState } from 'react'
import UsuarioServicio from '../servicios/UsuarioServicio'
import { Link, useNavigate } from 'react-router-dom'
import { FaUserPlus, FaSave, FaTimesCircle } from 'react-icons/fa'

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = '#A8DADC';  
const TEXT_COLOR = '#2C3E50';     
const BACKGROUND_COLOR = '#F8F9FA'; 
const CARD_COLOR = '#FFFFFF';

const AddUsuarioComponent = () => {
  
  const [username, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('ADMIN')
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const guardarUsuario = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Validación de campos
    if (!username || !password || !role) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setIsSaving(true);

    const user = { username, password, role };
    
    // 2. Llamada al servicio
    UsuarioServicio.crearUsuario( user ).then((response) => {
      console.log("Usuario creado:", response.data);
      setSuccess(`Usuario '${username}' registrado con éxito.`);
      
      // Limpiar formulario
      setUsuario('');
      setPassword('');
      setRole('ADMIN');

      // Navegar después de un pequeño delay para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/usuarios');
      }, 1500);

    }).catch(apiError => {
      console.error("Error al registrar usuario:", apiError);
      setError(apiError.response?.data?.message || 'Error al registrar el usuario. El nombre de usuario puede ya existir.');
    }).finally(() => {
      setIsSaving(false);
    })
  }
  
  return (
    <div className='d-flex justify-content-center align-items-center' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh' }}>
      <div className='col-lg-6 col-md-8 col-sm-10'>
        {/* Tarjeta principal del Registro de Usuario */}
        <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
          
          {/* Encabezado */}
          <div className='card-header' style={{ 
              backgroundColor: PRIMARY_COLOR, 
              color: TEXT_COLOR,
              borderTopLeftRadius: '15px',
              borderTopRightRadius: '15px',
              padding: '1.5rem'
          }}>
              <h2 className='d-flex align-items-center m-0' style={{ fontWeight: '700' }}>
                  <FaUserPlus size={28} className='me-3' />
                  Registro de Usuario
              </h2>
          </div>

          {/* Cuerpo del Card */}
          <div className='card-body p-4 p-md-5'>

            {/* Mensajes de feedback */}
            {error && (
                <div className='alert alert-danger mb-4' role='alert'>
                    {error}
                </div>
            )}
            {success && (
                <div className='alert alert-success mb-4' role='alert'>
                    {success}
                </div>
            )}

            <form onSubmit={guardarUsuario}>
              {/* Campo Usuario */}
              <div className='form-group mb-4'>
                <label className='form-label fw-bold'>Usuario</label>
                <input 
                  type='text' 
                  placeholder='Nombre de Usuario'
                  name = 'username'
                  className = 'form-control'
                  value = { username }
                  onChange = { (e) => setUsuario(e.target.value) }
                  required
                  style={{ borderColor: PRIMARY_COLOR }}
                />
              </div>

              {/* Campo Contraseña */}
              <div className='form-group mb-4'>
                <label className='form-label fw-bold'>Contraseña</label>
                <input 
                  type = 'password' 
                  placeholder = 'Contraseña' 
                  name = 'password' 
                  className = 'form-control'
                  value = { password }
                  onChange = { (e) => setPassword(e.target.value) }
                  required
                  style={{ borderColor: PRIMARY_COLOR }}
                />
              </div>

              {/* Campo Rol */}
              <div className='form-group mb-5'>
                <label className='form-label fw-bold'>Rol</label>
                <select
                  className="form-select" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ borderColor: PRIMARY_COLOR }}
                >
                  <option value='ADMIN'>Administrador</option>
                  <option value='USER'>Usuario</option>
                </select>
              </div>

              {/* Botones */}
              <div className='d-flex justify-content-end'>
                <button 
                  type='submit' 
                  className='btn btn-success d-flex align-items-center me-3' 
                  disabled={isSaving}
                >
                  {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Guardando...
                      </>
                  ) : (
                      <>
                        <FaSave className='me-2' /> Guardar
                      </>
                  )}
                </button>
                
                <Link to='/usuarios' className='btn btn-danger d-flex align-items-center'>
                  <FaTimesCircle className='me-2' /> Cancelar
                </Link>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddUsuarioComponent
