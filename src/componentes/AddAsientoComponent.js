import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Nota: Dejé las importaciones de servicios y componentes internos tal como estaban, 
// asumiendo que las rutas son correctas en tu proyecto local, pero el error 
// se mitigará al usar las librerías de íconos correctamente.
import AsientoServicio from '../servicios/AsientoServicio';
import SideBarComponent from './SideBarComponent';
import PlanDeCuentasServicio from '../servicios/PlanDeCuentasServicio';
// Corregido: Asumo que estos módulos están disponibles en el entorno.
import { FaSave, FaTimesCircle, FaPlus, FaCalculator, FaTrash } from 'react-icons/fa';
import { LuBookOpenCheck } from 'react-icons/lu';

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = '#A8DADC';  
const TEXT_COLOR = '#2C3E50';     
const BACKGROUND_COLOR = '#F8F9FA'; 
const CARD_COLOR = '#FFFFFF';

const AddAsientoComponent = () => {
  const [description, setDescription] = useState('');
  // accounts ahora almacenará solo las cuentas activas e imputables
  const [accounts, setAccounts] = useState([]); 
  const [movements, setMovements] = useState([{ account: '', debit: '', credit: '' }]); // Usar account para el backend
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [hasCredit, setHasCredit] = useState(false);
  const [checkDouble, setCheckDouble] = useState(false);

  const navigate = useNavigate();

  // Calcula totales en tiempo real
  const totalDebit = movements.reduce((sum, movement) => sum + (parseFloat(movement.debit) || 0), 0);
  const totalCredit = movements.reduce((sum, movement) => sum + (parseFloat(movement.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;
  
  // 1. Cargar Cuentas Imputables y Filtrar por Activas al montar
  useEffect(() => {
    PlanDeCuentasServicio.getBalanceAccounts().then((response) => {
      // --- FILTRADO POR CUENTAS ACTIVAS ---
      // Filtramos la respuesta para incluir solo las cuentas donde 'active' es true
      const activeAccounts = response.data.filter(cuenta => cuenta.active === true);
      setAccounts(activeAccounts);
      // -------------------------
    }).catch(error => {
      console.error("Error al cargar cuentas:", error);
      // En caso de error, el error de servicios prevalece sobre el de validación.
      setError('No se pudieron cargar las cuentas imputables.');
    });
  }, []);

  // 2. Manejadores de Movimientos
  const handleAddMovement = () => {
    // Verificar que la última línea tenga una cuenta seleccionada antes de añadir una nueva
    const lastMovement = movements[movements.length - 1];
    if (movements.length > 0 && !lastMovement.account) {
        setError('Debe seleccionar una cuenta en el movimiento anterior antes de agregar uno nuevo.');
        return;
    }
    setError(''); // Limpiar errores si se cumple la condición
    setMovements([...movements, { account: '', debit: '', credit: '' }]);
  };

  const handleRemoveMovement = (index) => {
    const list = [...movements];
    list.splice(index, 1);
    setMovements(list);

    // Recalcula el estado hasCredit al eliminar
    const updatedHasCredit = list.some(m => parseFloat(m.credit || 0) > 0);
    setHasCredit(updatedHasCredit);
    setError(''); // Limpiar errores al remover
  };

  const handleMovementChange = (index, event) => {
    const { name, value } = event.target;
    let list = [...movements];
    let movement = list[index];
    
    // Si es una cuenta, guardamos el ID
    if (name === 'account') {
        movement[name] = value;
        setMovements(list);
        setError(''); // Limpiar errores al cambiar cuenta
        return;
    }

    // Manejo de valores numéricos para Debe/Haber
    // Reemplaza coma por punto para facilitar el parseo en distintos locales
    const cleanValue = value.replace(',', '.');
    const numericValue = cleanValue === '' ? '' : parseFloat(cleanValue);

    if (cleanValue !== '' && (isNaN(numericValue) || numericValue < 0)) {
        movement[name] = cleanValue; // Mantiene el valor ingresado para que el usuario pueda corregir
        setMovements(list);
        setError('Error: Los valores de Debe/Haber deben ser números positivos.');
        return;
    }

    // Lógica para que solo un campo tenga valor (Debe o Haber)
    if (name === 'debit') {
      movement['credit'] = '';
    } else if (name === 'credit') {
      movement['debit'] = '';
    }
    
    movement[name] = cleanValue; // Guardar el valor limpio (string) para el input

    // Recalcular hasCredit
    const checkList = [...list];
    const isCreditPresent = checkList.some(m => parseFloat(m.credit || 0) > 0);
    setHasCredit(isCreditPresent);

    // Lógica para no agregar debe si ya hay un haber y no es asiento doble
    if (name === 'debit' && parseFloat(cleanValue) > 0 && isCreditPresent && !checkDouble) {
        // En este caso, revertimos el cambio de debe
        movement[name] = ''; 
        setError('Error: Para registrar movimientos de Debe después de haber registrado un Haber, debe marcar "Permitir Asiento Doble".');
    } else {
        setError('');
    }

    setMovements(list);
  };

  // 3. Guardar Asiento
  const guardarAsiento = async (e) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
        setError('Error: La descripción de la operación no puede estar vacía.');
        return;
    }

    if (movements.length < 2) {
      setError('Error: Un asiento contable debe tener al menos dos movimientos.');
      return;
    }

    if (!isBalanced) {
      setError(`Error: El asiento no balancea. Debe: $${totalDebit.toFixed(2)} vs. Haber: $${totalCredit.toFixed(2)}.`);
      return;
    }

    const hasUnselectedAccount = movements.some(movement => !movement.account);
    if (hasUnselectedAccount) {
      setError('Error: Todos los movimientos deben tener una cuenta seleccionada.');
      return;
    }
    
    // Asegurarse de que los valores numéricos se envíen como números (parseFloat)
    const finalMovements = movements.map(m => ({
        account: m.account,
        // Convertimos a número, asegurando que el string vacío sea 0
        debit: parseFloat(m.debit || 0), 
        credit: parseFloat(m.credit || 0),
    }));

    const asiento = { description, movements: finalMovements };
    setIsSaving(true);

    try {
        await AsientoServicio.crearAsiento(asiento);
        navigate('/libro-diario');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ocurrió un error al guardar el asiento.');
    } finally {
        setIsSaving(false);
    }
  };

  // 4. Componente de Totales y Balance
  const TotalsDisplay = () => (
    <div className='row mt-4 p-3 border-top' style={{ backgroundColor: isBalanced ? '#E6F4EA' : '#FCEAE7', borderRadius: '0 0 10px 10px' }}>
      <div className='col-12 col-md-4 d-flex align-items-center mb-2 mb-md-0' style={{ color: TEXT_COLOR, fontWeight: '600' }}>
        <FaCalculator className='me-2' />
        Estado: 
        <span className={`ms-2 p-1 rounded ${isBalanced ? 'text-success' : 'text-danger'}`} style={{ backgroundColor: isBalanced ? '#C6E9D1' : '#F7C4C0'}}>
            {isBalanced ? 'BALANCEADO' : 'PENDIENTE'}
        </span>
      </div>
      <div className='col-6 col-md-4 text-end mb-2 mb-md-0' style={{ fontWeight: '700', color: TEXT_COLOR }}>
        Total Debe: <span className='text-success'>${totalDebit.toFixed(2)}</span>
      </div>
      <div className='col-6 col-md-4 text-end' style={{ fontWeight: '700', color: TEXT_COLOR }}>
        Total Haber: <span className='text-danger'>${totalCredit.toFixed(2)}</span>
      </div>
    </div>
  );

  return (
    <div className='d-flex' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh' }}>
      <SideBarComponent />
      
      <div className='flex-grow-1 p-0 p-md-3'>
        <div className='col-lg-10 offset-lg-1'>
          {/* Tarjeta de Formulario Estilizada */}
          <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
            
            {/* Encabezado */}
            <div className='card-header text-center d-flex align-items-center justify-content-center' style={{ 
                backgroundColor: PRIMARY_COLOR, 
                color: TEXT_COLOR,
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px',
                padding: '1.5rem 0'
            }}>
                <LuBookOpenCheck size={28} className='me-3' />
                <h2 className='d-inline-block m-0' style={{ fontWeight: '700' }}>
                    Registro de Asiento Contable
                </h2>
            </div>
            
            <div className='card-body p-4 p-md-5'>
              <form onSubmit={guardarAsiento}>
                
                {/* 1. Descripción de la Operación */}
                <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Detalle del Asiento</h4>
                <div className='form-group mb-5'>
                  <label className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>Descripción de la Operación:</label>
                  <input
                    type='text'
                    placeholder='Ej: Venta de mercaderías según factura A-001...'
                    name='description'
                    className='form-control form-control-lg'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSaving}
                    required
                    style={{ borderColor: PRIMARY_COLOR }}
                  />
                </div>
                
                {/* 2. Movimientos Contables (Tabla estilizada) */}
                <h4 className='mb-4' style={{ color: TEXT_COLOR }}>Movimientos</h4>

                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: '8px' }}>
                    <table className="table table-hover mb-0">
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#F0F0F0', zIndex: 5 }}>
                            <tr>
                                <th style={{ width: '50%', color: TEXT_COLOR }}>Cuenta Imputable</th>
                                <th style={{ width: '20%', color: TEXT_COLOR }} className='text-center'>Debe ($)</th>
                                <th style={{ width: '20%', color: TEXT_COLOR }} className='text-center'>Haber ($)</th>
                                <th style={{ width: '10%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map((movement, index) => (
                                <tr key={index}>
                                    {/* Columna Cuenta */}
                                    <td>
                                        <select
                                            className="form-select"
                                            name="account"
                                            value={movement.account}
                                            onChange={(e) => handleMovementChange(index, e)}
                                            disabled={isSaving}
                                            required
                                            style={{ borderColor: PRIMARY_COLOR, minWidth: '150px' }}
                                        >
                                            <option value="" disabled>-- Seleccione una cuenta --</option>
                                            {accounts.map(cuenta => (
                                                // accounts ya están filtradas y solo contienen cuentas activas
                                                <option key={cuenta.id} value={cuenta.id}>{cuenta.code} - {cuenta.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    
                                    {/* Columna Debe */}
                                    <td>
                                        <input
                                            type='number'
                                            placeholder='0.00'
                                            name='debit'
                                            className='form-control text-end'
                                            value={movement.debit}
                                            onChange={(e) => handleMovementChange(index, e)}
                                            step="0.01"
                                            disabled={isSaving}
                                            style={{ minWidth: '100px' }}
                                        />
                                    </td>
                                    
                                    {/* Columna Haber */}
                                    <td>
                                        <input
                                            type='number'
                                            placeholder='0.00'
                                            name='credit'
                                            className='form-control text-end'
                                            value={movement.credit}
                                            onChange={(e) => handleMovementChange(index, e)}
                                            step="0.01"
                                            disabled={isSaving}
                                            style={{ minWidth: '100px' }}
                                        />
                                    </td>

                                    {/* Columna Eliminar */}
                                    <td className='text-center'>
                                        {movements.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleRemoveMovement(index)}
                                                disabled={isSaving}
                                                title="Eliminar movimiento"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. Opciones y Botones de Movimiento */}
                <div className='d-flex justify-content-between align-items-center mt-3 mb-4'>
                    <button
                        type="button"
                        className='btn btn-outline-secondary'
                        onClick={handleAddMovement}
                        disabled={isSaving}
                    >
                        <FaPlus className="me-2" /> Agregar Movimiento
                    </button>

                    <div className='form-check'>
                        <input
                            type='checkbox'
                            name='checkDouble'
                            id='checkDouble'
                            className='form-check-input'
                            checked={checkDouble}
                            onChange={(e) => setCheckDouble(e.target.checked)}
                            disabled={isSaving}
                        />
                        <label className='form-check-label' htmlFor='checkDouble' style={{ fontWeight: '600' }}>
                            Permitir Asiento Doble
                        </label>
                    </div>
                </div>

                {/* Totales y Estado de Balance */}
                <TotalsDisplay />

                {/* Mensaje de Error */}
                {error && <div className="alert alert-danger mt-4">{error}</div>}

                {/* Botones de Acción Final */}
                <div className='d-grid gap-2 d-md-flex justify-content-md-end mt-4 pt-3 border-top'>
                    <button 
                        className='btn btn-lg me-md-2' 
                        type="submit"
                        disabled={isSaving || !isBalanced} // Deshabilitar si no balancea
                        style={{
                            backgroundColor: isBalanced ? PRIMARY_COLOR : '#E0E0E0', 
                            color: isBalanced ? TEXT_COLOR : '#7F8C8D', 
                            fontWeight: '600'
                        }}
                    >
                        {isSaving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Guardando...
                            </>
                        ) : (
                            <><FaSave className="me-2" /> Guardar Asiento</>
                        )}
                    </button>
                    
                    <Link 
                        to='/inicio' 
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
  );
};

export default AddAsientoComponent;
