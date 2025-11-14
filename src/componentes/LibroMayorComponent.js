import React, { useEffect, useState } from 'react';
import SideBarComponent from './SideBarComponent';
import PlanDeCuentasServicio from '../servicios/PlanDeCuentasServicio';
import { Link } from 'react-router-dom';
import LibroMayorServicio from '../servicios/LibroMayorServicio';
import { FaCalendarAlt, FaChartLine, FaTimesCircle, FaCoins, FaSearch } from 'react-icons/fa';

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = '#A8DADC';  
const TEXT_COLOR = '#2C3E50';     
const BACKGROUND_COLOR = '#F8F9FA'; 
const CARD_COLOR = '#FFFFFF';
const DEFAULT_CASH_ACCOUNT_CODE = '1.1.1'; // Código contable asumido para la cuenta 'Caja'
const MAX_PERIOD_DAYS = 31; // Límite de 1 mes (31 días)

// Función para sumar un día a una fecha ISO (YYYY-MM-DD)
const getNextDayISO = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

// Función para formatear la fecha a DD-MM-AAAA (solo fecha, ignorando hora)
const formatLatinDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        return dateString;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

// Función para formatear el valor como moneda
const formatCurrency = (value) => {
    return `$ ${parseFloat(value).toFixed(2)}`;
};

// Función para obtener el rango de fechas de la última semana en formato YYYY-MM-DD
const getLastWeekRange = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7); 

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return {
        fechaDesde: formatDate(lastWeek),
        fechaHasta: formatDate(today),
    };
};


const LibroMayorComponent = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState(''); // Nuevo estado para errores de validación de fechas
    const [cuentas, setCuentas] = useState([]);
    const [selectedCuentaId, setSelectedCuentaId] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [cargando, setCargando] = useState(false);
    const [saldoInicial, setSaldoInicial] = useState(0);
    const [saldoFinal, setSaldoFinal] = useState(0);
    const [selectedCuentaName, setSelectedCuentaName] = useState('...');


    // Función de validación de fechas
    const validateDates = (desde, hasta) => {
        if (!desde || !hasta) {
            setValidationError(''); // No hay error si falta una fecha
            return false;
        }

        const dateDesde = new Date(desde);
        const dateHasta = new Date(hasta);

        // 1. Validar que fechaDesde no sea posterior a fechaHasta
        if (dateDesde.getTime() > dateHasta.getTime()) {
            setValidationError('La fecha "Desde" no puede ser posterior a la fecha "Hasta".');
            return false;
        }

        // 2. Validar que el periodo no sea mayor a 31 días
        // Sumamos 1 a la diferencia en días porque es inclusivo
        const diffTime = Math.abs(dateHasta.getTime() - dateDesde.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

        if (diffDays > MAX_PERIOD_DAYS) {
            setValidationError(`El período seleccionado no puede ser mayor a ${MAX_PERIOD_DAYS} días (1 mes).`);
            return false;
        }

        setValidationError(''); // Si las validaciones pasan, limpiamos el error
        return true;
    };


    // 1. Carga las cuentas y establece valores por defecto
    useEffect(() => {
        setError(''); 
        PlanDeCuentasServicio.getBalanceAccounts().then((response) => {
            const fetchedCuentas = response.data;
            setCuentas(fetchedCuentas);

            let accountToSelect = null;
            const defaultCashAccount = fetchedCuentas.find(c => c.code === DEFAULT_CASH_ACCOUNT_CODE);
            
            if (defaultCashAccount) {
                accountToSelect = defaultCashAccount;
            } else if (fetchedCuentas.length > 0) {
                accountToSelect = fetchedCuentas[0];
            }

            if (accountToSelect) {
                const { fechaDesde, fechaHasta } = getLastWeekRange();
                
                setSelectedCuentaId(accountToSelect.id);
                setFechaDesde(fechaDesde);
                setFechaHasta(fechaHasta);
            }

        }).catch(error => {
            console.error("Error al cargar las cuentas:", error);
            setError('Error al cargar la lista de cuentas.');
        });
    }, []);
    
    // 2. Almacena el nombre de la cuenta seleccionada
    useEffect(() => {
        const selectedAccount = cuentas.find(c => c.id === selectedCuentaId);
        setSelectedCuentaName(selectedAccount ? selectedAccount.name : '...');
    }, [selectedCuentaId, cuentas]);


    // 3. Efecto para buscar los datos del libro mayor (Solo si las fechas son válidas)
    useEffect(() => {
        const datesValid = validateDates(fechaDesde, fechaHasta);

        // Solo procede si hay una cuenta seleccionada y las fechas son válidas
        if (selectedCuentaId && fechaDesde && fechaHasta && datesValid) {
            setCargando(true);
            setError(''); 
            
            const fechaExclusivaHasta = getNextDayISO(fechaHasta);


            LibroMayorServicio.getMovimientosPorCuentaYPeriodo(selectedCuentaId, fechaDesde, fechaExclusivaHasta)
                .then((response) => {
                    const data = response.data;
                    const fetchedMovements = data.movements;
                    
                    setMovimientos(fetchedMovements);
                    setSaldoInicial(data.initialBalance);

                    if (fetchedMovements && fetchedMovements.length > 0) {
                        const ultimoMovimiento = fetchedMovements[fetchedMovements.length - 1];
                        setSaldoFinal(ultimoMovimiento.account_balance); 
                    } else {
                        setSaldoFinal(data.initialBalance || 0); 
                    }
                    
                    setError('');
                })
                .catch(err => {
                    console.error("Error al obtener libro mayor:", err);
                    setMovimientos([]);
                    setSaldoInicial(0);
                    setSaldoFinal(0);

                    // Lógica para evitar error de "no hay datos"
                    const errorMessage = err.response?.data?.message || '';
                    const isNoDataError = (err.response?.status === 404 || errorMessage.toLowerCase().includes('no se encontraron'));

                    if (!isNoDataError) {
                        setError('');
                    } 
                })
                .finally(() => {
                    setCargando(false);
                });
        } else if (!selectedCuentaId || !fechaDesde || !fechaHasta) {
            // Limpiar movimientos y errores si faltan datos esenciales, pero no hay un error de validación
            if (!validationError) {
                setMovimientos([]);
                setSaldoInicial(0);
                setSaldoFinal(0);
                setError(''); 
            }
        }
    }, [selectedCuentaId, fechaDesde, fechaHasta, cuentas.length, validationError]); // Dependencia de validationError


    // Manejadores de cambio con validación
    const handleFechaDesdeChange = (e) => {
        const newDesde = e.target.value;
        setFechaDesde(newDesde);
        validateDates(newDesde, fechaHasta);
    };

    const handleFechaHastaChange = (e) => {
        const newHasta = e.target.value;
        setFechaHasta(newHasta);
        validateDates(fechaDesde, newHasta);
    };

    // Variable booleana para simplificar la lógica de renderizado
    const showTable = movimientos.length > 0 || saldoInicial !== 0;
    const isReadyToSearch = selectedCuentaId && fechaDesde && fechaHasta;


    return (
        <div className='d-flex' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh' }}>
            <SideBarComponent />
            
            <div className='flex-grow-1 p-0 p-md-5'>
                <div className='col-lg-12'>
                    {/* Tarjeta principal del Libro Mayor */}
                    <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
                        
                        {/* Encabezado */}
                        <div className='card-header d-flex flex-column flex-md-row align-items-center justify-content-between' style={{ 
                            backgroundColor: PRIMARY_COLOR, 
                            color: TEXT_COLOR,
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                            padding: '1.5rem'
                        }}>
                            <h2 className='d-flex align-items-center m-0' style={{ fontWeight: '700' }}>
                                <FaChartLine size={28} className='me-3' />
                                Libro Mayor - Cuenta: {selectedCuentaName}
                            </h2>
                            <Link to='/inicio' className='btn btn-secondary d-flex align-items-center mt-3 mt-md-0' style={{ fontWeight: '600' }}>
                                <FaTimesCircle className='me-2' /> Volver a Inicio
                            </Link>
                        </div>

                        {/* Cuerpo del Card */}
                        <div className='card-body p-4 p-md-5'>
                            
                            {/* Selector de Filtros */}
                            <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Filtros de Búsqueda</h4>
                            <div className='d-flex flex-wrap align-items-end mb-4 p-3 border rounded' style={{ backgroundColor: '#F0F0F0' }}>
                                
                                {/* Control de selección de cuenta */}
                                <div className='form-group me-4 mb-2'>
                                    <label className='form-label' style={{ fontWeight: '600' }}>Cuenta Imputable:</label>
                                    <select
                                        className="form-select"
                                        name="cuenta"
                                        value={selectedCuentaId}
                                        onChange={(e) => setSelectedCuentaId(e.target.value)}
                                        style={{ borderColor: PRIMARY_COLOR, minWidth: '200px' }}
                                    >
                                        <option value="" disabled>-- Seleccione una cuenta --</option>
                                        {cuentas.map(account => (
                                            <option key={account.id} value={account.id}>{account.code} - {account.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Control de fecha "Desde" */}
                                <div className='form-group me-4 mb-2'>
                                    <label className='form-label' style={{ fontWeight: '600' }}>Desde:</label>
                                    <input
                                        type='date'
                                        className={`form-control ${validationError ? 'is-invalid' : ''}`}
                                        value={fechaDesde}
                                        onChange={handleFechaDesdeChange}
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    />
                                </div>
                                
                                {/* Control de fecha "Hasta" */}
                                <div className='form-group me-4 mb-2'>
                                    <label className='form-label' style={{ fontWeight: '600' }}>Hasta:</label>
                                    <input
                                        type='date'
                                        className={`form-control ${validationError ? 'is-invalid' : ''}`}
                                        value={fechaHasta}
                                        onChange={handleFechaHastaChange}
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    />
                                </div>
                            </div>
                            
                            {/* Mensajes de Error y Validación */}
                            {(validationError || error) && (
                                <div className='alert alert-danger mb-4' role='alert'>
                                    {validationError || error}
                                </div>
                            )}

                            {/* Contenido principal (Cargando, Tabla o Info) */}
                            {cargando ? (
                                <div className='d-flex justify-content-center my-5'>
                                    <div className='spinner-border text-primary' role='status' style={{ width: '3rem', height: '3rem' }}>
                                        <span className='visually-hidden'>Generando movimientos...</span>
                                    </div>
                                    <p className='ms-3 pt-1' style={{ color: TEXT_COLOR }}>Generando movimientos...</p>
                                </div>
                            ) : (
                                (isReadyToSearch && !validationError) ? ( // Solo si está listo para buscar Y no hay error de validación
                                    showTable ? (
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped" style={{ fontSize: '0.9rem' }}>
                                                <thead style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR }}>
                                                    <tr>
                                                        <th style={{ width: '15%' }}>Fecha</th>
                                                        <th style={{ width: '37%'}}>Operación</th>
                                                        <th style={{ width: '16%', textAlign: 'right' }}>Debe</th>
                                                        <th style={{ width: '16%', textAlign: 'right' }}>Haber</th>
                                                        <th style={{ width: '16%', textAlign: 'right' }}>Saldo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* Fila de Saldo Inicial */}
                                                    <tr className="table-secondary fw-bold">
                                                        <td></td>
                                                        <td>SALDO INICIAL</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td className='text-end'>{formatCurrency(saldoInicial)}</td>
                                                    </tr>
                                                    
                                                    {/* Movimientos del Período */}
                                                    {movimientos.map((mov, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td className='text-center'>{formatLatinDate(mov.dateCreated)}</td>
                                                                <td>{mov.description}</td>
                                                                <td className='text-end text-success'>{mov.debit > 0 ? formatCurrency(mov.debit) : ''}</td>
                                                                <td className='text-end text-danger'>{mov.credit > 0 ? formatCurrency(mov.credit) : ''}</td>
                                                                <td className='text-end'>{formatCurrency(mov.account_balance)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                    
                                                    {/* Fila de Saldo Final */}
                                                    <tr className="table-dark fw-bold">
                                                        {/* Usamos la fecha original para mostrar en la tabla */}
                                                        <td colSpan="4" className='text-end'>SALDO FINAL AL {formatLatinDate(fechaHasta)}</td>
                                                        <td className='text-end'>{formatCurrency(saldoFinal)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        // Mensaje Informativo (Solo si los filtros están puestos, son válidos y la búsqueda no arrojó resultados)
                                        <div className='alert alert-info mt-3' role='alert'>
                                            <FaSearch className='me-2' />
                                            No se encontraron movimientos en el período seleccionado para esta cuenta. 
                                        </div>
                                    )
                                ) : (
                                    // Mensaje inicial (si faltan filtros o si hay un error de validación activo)
                                    !validationError && (
                                        <div className='alert alert-info mt-3' role='alert'>
                                            <FaSearch className='me-2' />
                                            Seleccione una cuenta y un rango de fechas para generar el reporte del libro mayor.
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibroMayorComponent;
