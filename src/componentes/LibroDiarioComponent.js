import React, { useEffect, useState } from 'react'
import SideBarComponent from './SideBarComponent';
import { Link } from 'react-router-dom';
import LibroDiarioServicio from '../servicios/LibroDiarioServicio';
import { FaCalendarAlt, FaPlusSquare, FaTimesCircle, FaChartLine, FaSearch } from 'react-icons/fa';
import { LuBookOpenCheck } from 'react-icons/lu';

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = '#A8DADC';  
const TEXT_COLOR = '#2C3E50';     
const BACKGROUND_COLOR = '#F8F9FA'; 
const CARD_COLOR = '#FFFFFF';
const MAX_PERIOD_DAYS = 62; // Límite de 2 meses (62 días) para el Libro Diario

// Función para formatear la fecha a DD-MM-AAAA
const formatLatinDate = (dateString) => {
    if (!dateString) return '';
    try {
        // 1. Extraemos solo la parte de la fecha (YYYY-MM-DD), eliminando la hora.
        const datePart = dateString.split(' ')[0].split('T')[0]; 
        
        // 2. Forzamos la interpretación como medianoche UTC para evitar cambios por zona horaria.
        const dateObj = new Date(datePart + 'T00:00:00Z');
        
        // 3. Usamos Intl.DateTimeFormat para el formato DD/MM/AAAA.
        const formatter = new Intl.DateTimeFormat('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC' 
        });
        
        return formatter.format(dateObj).replace(/\//g, '-'); 
    } catch (e) {
        console.error("Error al formatear fecha:", dateString, e);
        return dateString.split(' ')[0] || dateString; 
    }
};

// Función para formatear el valor como moneda
const formatCurrency = (value) => {
    if (value === null || typeof value === 'undefined') return ''; 
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    // Usamos 'es-AR' para formato de moneda (Ej: $ 1.234,56)
    return numValue.toLocaleString('es-AR', { 
        style: 'currency', 
        currency: 'ARS',
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
};


const LibroDiarioComponent = () => {

    const [asientos, setAsientos] = useState([]);
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState(''); 
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [cargando, setCargando] = useState(false);
    // Título inicial actualizado para reflejar la carga de los últimos asientos
    const [reporteTitulo, setReporteTitulo] = useState('Últimos 10 Asientos Registrados'); 

    // Función de validación de fechas (período máximo de 62 días)
    const validateDates = (desde, hasta) => {
        // ... (Tu función de validación actual)
        if (!desde || !hasta) {
            setValidationError(''); 
            return false;
        }

        const dateDesde = new Date(desde + 'T00:00:00');
        const dateHasta = new Date(hasta + 'T00:00:00');

        if (isNaN(dateDesde.getTime()) || isNaN(dateHasta.getTime())) {
            setValidationError('Formato de fecha inválido.');
            return false;
        }

        if (dateDesde.getTime() > dateHasta.getTime()) {
            setValidationError('La fecha "Desde" no puede ser posterior a la fecha "Hasta".');
            return false;
        }

        const diffTime = dateHasta.getTime() - dateDesde.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

        if (diffDays > MAX_PERIOD_DAYS) {
            setValidationError(`El período seleccionado no puede ser mayor a ${MAX_PERIOD_DAYS} días (2 meses).`);
            return false;
        }

        setValidationError(''); 
        return true;
    };
    
    // 1. EFECTO DE CARGA INICIAL: Obtener los últimos 10 asientos al montar.
    useEffect(() => {
        setCargando(true);
        setError(''); 
        
        LibroDiarioServicio.getLastAsientos() // Llama al nuevo servicio para los últimos 10
            .then((response) => {
                const fetchedAsientos = response.data || [];
                setAsientos(fetchedAsientos);
                setReporteTitulo('Últimos 10 Asientos Registrados');
                setError('');
            })
            .catch(err => {
                console.error("Error al obtener últimos asientos:", err);
                setAsientos([]);
                setError('Error al cargar los últimos asientos. Intente buscar por período.');
                setReporteTitulo('Error al cargar datos iniciales');
            })
            .finally(() => {
                setCargando(false);
            });
            
    }, []); // Se ejecuta solo una vez al montar

    // FUNCIÓN DE BÚSQUEDA EXPLÍCITA POR RANGO DE FECHAS
    const handleBuscarAsientos = () => {
        const datesValid = validateDates(fechaDesde, fechaHasta);

        if (!fechaDesde || !fechaHasta) {
            setValidationError('Debe seleccionar ambas fechas para buscar por período.');
            return;
        }

        if (datesValid) {
            setCargando(true);
            setError(''); 
            setAsientos([]); 
            setValidationError('');
            
            // Enviamos la fecha final del usuario directamente.
            // Opcionalmente, puedes añadir el timestamp de caché aquí si el problema persiste.
            LibroDiarioServicio.getAsientosPorPeriodo(fechaDesde, fechaHasta)
                .then((response) => {
                    const fetchedAsientos = response.data || [];
                    setAsientos(fetchedAsientos);
                    
                    setReporteTitulo(`Asientos del ${formatLatinDate(fechaDesde)} al ${formatLatinDate(fechaHasta)}`);
                    setError('');
                })
                .catch(err => {
                    console.error("Error al obtener libro diario:", err);
                    setAsientos([]);
                    
                    const errorMessage = err.response?.data?.message || '';
                    const isNoDataError = (err.response?.status === 404 || errorMessage.toLowerCase().includes('no se encontraron'));

                    if (!isNoDataError) {
                        setError(err.response?.data?.message || 'No se pudo establecer conexión con el servidor o hubo un error interno.');
                    } else {
                        // Es un error 404/No data, no mostramos el mensaje de error de API, solo el título
                        setError('');
                    } 
                    setReporteTitulo(`Asientos del ${formatLatinDate(fechaDesde)} al ${formatLatinDate(fechaHasta)}`);
                })
                .finally(() => {
                    setCargando(false);
                });
        }
    };

    // Manejadores de cambio de fecha
    const handleFechaDesdeChange = (e) => {
        setFechaDesde(e.target.value);
        setValidationError(''); 
        setError(''); 
    };

    const handleFechaHastaChange = (e) => {
        setFechaHasta(e.target.value);
        setValidationError('');
        setError('');
    };

    // Función para limpiar los filtros y volver a la carga inicial de los últimos asientos
    const handleLimpiarFiltro = () => {
        setFechaDesde('');
        setFechaHasta('');
        setError('');
        setValidationError(''); 
        // Llama a la carga inicial de nuevo
        // La forma más limpia de hacerlo es usando una función separada o re-ejecutando el efecto inicial, 
        // pero por simplicidad, hacemos la llamada aquí de forma directa:
        setCargando(true);
        LibroDiarioServicio.getLastAsientos()
            .then((response) => {
                setAsientos(response.data || []);
                setReporteTitulo('Últimos 10 Asientos Registrados');
            })
            .catch(() => {
                setAsientos([]);
                setReporteTitulo('Error al recargar datos');
            })
            .finally(() => {
                setCargando(false);
            });
    };

    // 2. Renderizado del componente
    return (
        <div className='d-flex' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh' }}>
            {/* Componente de la barra lateral */}
            <SideBarComponent />
            
            <div className='flex-grow-1 p-0 p-md-5'>
                <div className='col-lg-12'>
                    {/* Tarjeta principal del Libro Diario */}
                    <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
                        
                        {/* Encabezado */}
                        <div className='card-header d-flex flex-column flex-md-row align-items-center justify-content-between' style={{ 
                            backgroundColor: PRIMARY_COLOR, 
                            color: TEXT_COLOR,
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                            padding: '1.5rem'
                        }}>
                            <h2 className='d-flex align-items-center m-0 mb-3 mb-md-0' style={{ fontWeight: '700' }}>
                                <LuBookOpenCheck size={28} className='me-3' />
                                Libro Diario
                            </h2>
                            {/* Botones de acción */}
                            <div className='d-flex gap-3'>
                                <Link to='/asientos' className='btn btn-success d-flex align-items-center' style={{ fontWeight: '600' }}>
                                    <FaPlusSquare className='me-2' /> Nuevo Asiento
                                </Link>
                                <Link to='/libro-mayor' className='btn btn-info d-flex align-items-center' style={{ fontWeight: '600' }}>
                                    <FaChartLine className='me-2' /> Ver Mayor
                                </Link>
                            </div>
                        </div>

                        {/* Cuerpo del Card */}
                        <div className='card-body p-4 p-md-5'>
                            
                            {/* Selector de Fechas y Filtro */}
                            <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Filtros de Período</h4>
                            <div className='d-flex flex-wrap align-items-end mb-4 p-3 border rounded' style={{ backgroundColor: '#F0F0F0' }}>
                                
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
                                
                                {/* Botón Buscar (NUEVO) */}
                                <button 
                                    onClick={handleBuscarAsientos} 
                                    className='btn btn-primary d-flex align-items-center mb-2 me-3'
                                    style={{ fontWeight: '600', backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, color: TEXT_COLOR }}
                                >
                                    <FaSearch className='me-2' /> Buscar
                                </button>
                                
                                {/* Botón Limpiar Filtro */}
                                <button 
                                    onClick={handleLimpiarFiltro} 
                                    className='btn btn-secondary d-flex align-items-center mb-2'
                                >
                                    <FaTimesCircle className='me-2' /> Limpiar Filtro
                                </button>
                                
                                <span className='ms-3 mb-2 text-muted fst-italic' style={{ fontSize: '0.9rem' }}>
                                    (Máx. {MAX_PERIOD_DAYS} días. Use "Buscar" para filtrar.)
                                </span>
                            </div>

                            {/* Título Dinámico del Reporte */}
                            <h5 className='mb-4 text-muted fw-bold'>{reporteTitulo}</h5>
                            
                            {/* Mensaje de Error (Muestra error de Validación o error de API) */}
                            {(validationError || error) && (
                                <div className='alert alert-danger mb-4' role='alert'>
                                    {validationError || error}
                                </div>
                            )}

                            {/* Contenido principal (Cargando, Tabla o Info) */}
                            {cargando ? (
                                <div className='d-flex justify-content-center my-5'>
                                    <div className='spinner-border text-primary' role='status' style={{ width: '3rem', height: '3rem' }}>
                                        <span className='visually-hidden'>Cargando...</span>
                                    </div>
                                    <p className='ms-3 pt-1' style={{ color: TEXT_COLOR }}>Cargando asientos...</p>
                                </div>
                            ) : asientos && asientos.length > 0 ? (
                                <div className="table-responsive">
                                    <table className='table table-bordered table-striped' style={{ fontSize: '0.9rem' }}>
                                        <thead style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR }}>
                                            <tr>
                                                <th style={{ width: '10%' }}>Fecha</th>
                                                <th style={{ width: '30%'}}>Operación</th>
                                                <th style={{ width: '40%' }}>Cuentas</th>
                                                <th style={{ width: '10%', textAlign: 'right' }}>Debe</th>
                                                <th style={{ width: '10%', textAlign: 'right' }}>Haber</th>
                                            </tr>
                                        </thead>
                                        {asientos.map(asiento => (
                                            <tbody key={asiento.id} style={{ borderBottom: '3px solid #E0E0E0' }}>
                                                {asiento.movementDTOS.map((movimiento, index) => (
                                                    <tr key={`${asiento.id}-${movimiento.id}`}>
                                                        {/* Columna Fecha */}
                                                        {index === 0 ? (
                                                            <td rowSpan={asiento.movementDTOS.length} className='align-middle text-center' style={{ fontWeight: 'bold' }}>
                                                                {/* Aplicación del formato DD-MM-AAAA */}
                                                                {formatLatinDate(asiento.date)}
                                                            </td>
                                                        ) : null}
                                                        {/* Columna Operación */}
                                                        {index === 0 ? (
                                                            <td rowSpan={asiento.movementDTOS.length} className='align-middle' style={{ fontStyle: 'italic', backgroundColor: '#F9F9F9' }}>
                                                                {asiento.description}
                                                            </td>
                                                        ) : null}
                                                        
                                                        {/* Columna Cuentas */}
                                                        <td className={movimiento.credit > 0 ? 'ps-5' : ''} style={{ fontWeight: movimiento.credit > 0 ? 'normal' : '500' }}>
                                                            {movimiento.credit > 0 ? `A ${movimiento.account}` : movimiento.account}
                                                        </td>

                                                        {/* Columna Debe */}
                                                        <td className='text-end'>
                                                            {movimiento.debit > 0 ? formatCurrency(movimiento.debit) : ''}
                                                        </td>
                                                        
                                                        {/* Columna Haber */}
                                                        <td className='text-end'>
                                                            {movimiento.credit > 0 ? formatCurrency(movimiento.credit) : ''}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        ))}
                                    </table>
                                </div>
                            ) : (
                                // Mensaje de No Hay Datos (Aplica si se buscó por período sin resultados)
                                (!cargando && (!fechaDesde || !fechaHasta) && reporteTitulo.includes('Últimos')) ? (
                                    <div className='alert alert-info mt-3' role='alert'>
                                        <FaCalendarAlt className='me-2' />
                                        No hay asientos registrados. Utilice el botón "Nuevo Asiento" para empezar.
                                    </div>
                                ) : (fechaDesde && fechaHasta && !cargando && !validationError) ? (
                                    <div className='alert alert-info mt-3' role='alert'>
                                        <FaSearch className='me-2' />
                                        No hay asientos registrados para este período.
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LibroDiarioComponent;
