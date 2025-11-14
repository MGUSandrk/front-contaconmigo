import React, { useState, useEffect } from 'react';
import PlanDeCuentasServicio from '../servicios/PlanDeCuentasServicio';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SideBarComponent from './SideBarComponent';
import { FaSave, FaTimesCircle, FaPlusCircle } from 'react-icons/fa';
import RefreshService from '../servicios/RefreshService';

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = '#A8DADC';  
const TEXT_COLOR = '#2C3E50';     
const BACKGROUND_COLOR = '#F8F9FA'; 
const CARD_COLOR = '#FFFFFF';

const AddCuentaComponent = () => {

    const location = useLocation();
    // idParent puede venir de la URL o ser null si se agrega una cuenta de nivel superior
    const idParent = location.state?.idParent || null;

    const [name, setName] = useState('');
    // Revertimos al estado booleano: true si recibe saldo (Balance), false si es Agrupadora (Control)
    const [receivesBalance, setReceivesBalance] = useState(false); 
    const [parentAccount, setParentAccount] = useState(null); // Para mostrar el nombre del padre
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    // 1. Cargar la cuenta padre si existe y establecer el valor por defecto del checkbox
    useEffect(() => {
        if (idParent) {
            PlanDeCuentasServicio.getCuentaById(idParent)
                .then(response => {
                    setParentAccount(response.data);
                })
                .catch(err => {
                    console.error("No se pudo cargar la cuenta padre:", err);
                    setParentAccount({ name: "Error al cargar", code: "N/A" });
                });
            
            // Si tiene padre, por defecto asumimos que es una subcuenta imputable.
            setReceivesBalance(true); 
        } else {
            // Si no tiene padre, por defecto es una cuenta agrupadora de nivel superior (Control).
            setReceivesBalance(false); 
        }
    }, [idParent]);

    const saveAccount = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
             setError("Por favor, ingrese un nombre para la cuenta.");
             return;
        }

        // Validación clave: Si recibe saldo, DEBE tener padre.
        if (receivesBalance && !idParent) {
             setError("Una cuenta que recibe saldo (imputable) siempre debe estar dentro de otra cuenta. Desmarque la opción 'Recibe Saldo' si es una cuenta de nivel superior.");
             return;
        }

        const account = { name }; 
        let serviceCall;
        
        setIsSaving(true); 

        try {
            if (receivesBalance) {
                // Cuenta Imputable (Balance)
                serviceCall = PlanDeCuentasServicio.crearCuentaBalance(account, idParent);
            } else {
                // Cuenta Agrupadora (Control)
                if (idParent) {
                    serviceCall = PlanDeCuentasServicio.crearCuentaControlId(account, idParent);
                } else {
                    // Cuenta Control de Nivel Superior (Activo, Pasivo, etc.)
                    serviceCall = PlanDeCuentasServicio.crearCuentaControl(account);
                }
            }
            
            await serviceCall; 
            
            // Simulación de carga para mejor UX
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Dispara la recarga del Plan de Cuentas
            RefreshService.triggerRefresh();

            navigate('/plan-de-cuentas'); 

        } catch (err) {
            console.error("Error al guardar la cuenta:", err);
            setError(err.response?.data?.message || 'Ocurrió un error al guardar la cuenta.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className='d-flex vh-100' style={{ backgroundColor: BACKGROUND_COLOR }}>
            <SideBarComponent />
            
            <div className='flex-grow-1 p-5 d-flex justify-content-center'>
                <div className='col-lg-7 col-md-10'>
                    {/* Tarjeta de Formulario Estilizada */}
                    <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
                        
                        <div className='card-header text-center d-flex align-items-center justify-content-center' style={{ 
                            backgroundColor: PRIMARY_COLOR, 
                            color: TEXT_COLOR,
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                            padding: '1.5rem 0'
                        }}>
                            {/* Ajustamos la talla del ícono para que sea más visible */}
                            <FaPlusCircle size={28} className='me-3' />
                            <h2 className='d-inline-block m-0' style={{ fontWeight: '700' }}>
                                Registro de Nueva Cuenta
                            </h2>
                        </div>
                        
                        <div className='card-body p-4 p-md-5'>
                            
                            {/* Mostrar Cuenta Padre si existe */}
                            {idParent && parentAccount && (
                                <div className='alert alert-light border' style={{ 
                                    borderColor: PRIMARY_COLOR, 
                                    backgroundColor: '#F7F7F7',
                                    color: TEXT_COLOR,
                                    fontWeight: '600',
                                    marginBottom: '25px'
                                }}>
                                    Se está agregando una subcuenta a: 
                                    <span style={{ color: PRIMARY_COLOR, marginLeft: '5px' }}>
                                        {parentAccount.code} - {parentAccount.name}
                                    </span>
                                </div>
                            )}

                            <form onSubmit={saveAccount}>
                                
                                {/* Campo Nombre */}
                                <div className='form-group mb-4'>
                                    <label className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>Nombre de la Cuenta:</label>
                                    <input
                                        type='text'
                                        placeholder='Ej: Caja, Mercaderías, Capital Social...'
                                        name='account'
                                        className='form-control form-control-lg'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isSaving}
                                        required
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    />
                                </div>
                                
                                {/* CHECKBOX (Recibe Saldo) - Restaurado */}
                                <div className='form-group mb-4 p-3' style={{ backgroundColor: BACKGROUND_COLOR, borderRadius: '8px' }}>
                                    <div className='form-check'>
                                        <input
                                            type='checkbox'
                                            name='receivesBalance'
                                            id='receivesBalanceCheck'
                                            className='form-check-input'
                                            checked={receivesBalance}
                                            onChange={(e) => setReceivesBalance(e.target.checked)}
                                            // Deshabilitar el cambio si NO tiene padre (debe ser control)
                                            disabled={isSaving || !idParent} 
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                        <label className='form-check-label' htmlFor='receivesBalanceCheck' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                            Recibe Saldo (Cuenta Imputable)
                                        </label>
                                    </div>
                                    
                                    {/* Ayuda contextual */}
                                    <small className='form-text d-block mt-2' style={{ color: '#7F8C8D' }}>
                                        Si está marcado, esta cuenta recibirá directamente los movimientos (hoja del árbol).
                                    </small>
                                    
                                    {!idParent && (
                                        <span className='d-block text-danger mt-1' style={{fontWeight: '500'}}>
                                            ¡Advertencia! Las cuentas de nivel superior deben ser Agrupadoras (no pueden recibir saldo).
                                        </span>
                                    )}
                                </div>
                                
                                {/* Mensaje de Error */}
                                {error && <div className='alert alert-danger mt-3'>{error}</div>}

                                {/* Botones de Acción */}
                                <div className='d-grid gap-2 d-md-flex justify-content-md-end mt-4'>
                                    <button 
                                        className='btn btn-lg me-md-2' 
                                        type="submit"
                                        disabled={isSaving} 
                                        style={{
                                            backgroundColor: PRIMARY_COLOR, 
                                            color: TEXT_COLOR, 
                                            fontWeight: '600'
                                        }}
                                    >
                                        {isSaving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            <><FaSave className="me-2" /> Guardar Cuenta</>
                                        )}
                                    </button>
                                    
                                    <Link 
                                        to='/plan-de-cuentas' 
                                        className='btn btn-secondary btn-lg'
                                        tabIndex={isSaving ? -1 : 0} 
                                        style={isSaving ? { pointerEvents: 'none', opacity: 0.6 } : {}}
                                    >
                                        <FaTimesCircle className="me-2" /> Cancelar
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCuentaComponent;
