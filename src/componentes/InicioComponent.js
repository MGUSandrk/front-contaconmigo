import React, { useState, useEffect } from 'react'; 
import SideBarComponent from './SideBarComponent';
import { FaFileInvoiceDollar, FaChartLine, FaDollarSign, FaTools, FaPlusCircle, FaListAlt } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import PlanDeCuentasServicio from '../servicios/PlanDeCuentasServicio';

// Función auxiliar para formatear números como moneda ARS
const formatCurrency = (number) => {
    if (number === null || typeof number === 'undefined') return '0,00'; // Muestra 0.00 mientras carga o si es nulo
    
    // CORRECCIÓN CLAVE: Intentamos parsear y usamos 0 si el resultado es NaN o inválido.
    const num = parseFloat(number); 
    
    // Si el parsing falló (ej. el backend devolvió un string no numérico), usamos 0.
    if (isNaN(num)) return '0,00'; 

    // Usamos el formato local de Argentina con dos decimales
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


const InicioComponent = () => {
    
    // --- ESTADOS DINÁMICOS ---
    // Usamos 'null' como estado inicial para indicar que está cargando
    const [activo, setActivo] = useState(null);
    const [pasivo, setPasivo] = useState(null);
    const [resultados, setResultados] = useState(null);
    const [capitalDeTrabajo, setCapitalDeTrabajo] = useState(null); 
    
    
    // --- LÓGICA DE CÁLCULO DE CAPITAL DE TRABAJO ---
    useEffect(() => {
        // Solo calcular si Activo y Pasivo ya tienen valores numéricos cargados (no null)
        if (activo !== null && pasivo !== null) {
            setCapitalDeTrabajo(activo - pasivo);
        }
    }, [activo, pasivo]); 


    // --- LÓGICA DE CARGA DE DATOS ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const activoId = 1; 
                const pasivoId = 2;

                // 1. Obtener Activo
                const activoResponse = await PlanDeCuentasServicio.getSaldoCuenta(activoId);
                // Asegúrate de que el valor sea un número o 0 si es null/undefined
                const activoValue = activoResponse.data.balance || 0; 
                setActivo(activoValue);

                // 2. Obtener Pasivo
                const pasivoResponse = await PlanDeCuentasServicio.getSaldoCuenta(pasivoId);
                const pasivoValue = pasivoResponse.data.balance || 0;
                setPasivo(pasivoValue);

                // 3. Obtener Estado de Resultados
                const resultadosResponse = await PlanDeCuentasServicio.getResultado();
                // Si el backend no devuelve resultado, usamos 0.
                const resultadosValue = resultadosResponse.data.results || 0; 
                setResultados(resultadosValue);

            } catch (error) {
                console.error("Error al cargar los indicadores clave:", error);
                // En caso de error de red o backend, seteamos todos a 0 para evitar NaN
                setActivo(0);
                setPasivo(0);
                setResultados(0);
                setCapitalDeTrabajo(0);
            }
        };

        fetchData();
    }, []); 


    // --- ESTILOS (MANTENIDOS) ---
    const styles = {
        welcomePanel: {
            background: 'linear-gradient(135deg, #F5E6E8 0%, #E8F4F8 100%)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            color: '#2C3E50',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        },
        kpiCard: {
            background: '#FFFFFF',
            borderRadius: '15px',
            padding: '25px',
            height: '100%',
            border: '1px solid #F0F0F0',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
        },
        iconWrapper: {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            background: '#E8F4F8', 
        },
        primaryColor: '#A8DADC', 
        secondaryText: '#5A6C7D', 
        buttonPrimary: {
            background: '#A8DADC',
            color: '#2C3E50',
            borderRadius: '15px', 
            padding: '12px 20px',
            fontWeight: '600',
            border: 'none',
        }
    };
    
    // --- DATOS DINÁMICOS PARA RENDERIZAR (Kpis) ---
    const kpis = [
        { 
            title: "Activos Totales", 
            value: formatCurrency(activo), 
            icon: FaChartLine, 
            color: styles.primaryColor 
        },
        { 
            title: "Pasivos Totales", 
            value: formatCurrency(pasivo), 
            icon: FaFileInvoiceDollar, 
            color: '#FF9999' 
        },
        { 
            title: "Resultado del Período", 
            value: formatCurrency(resultados), 
            icon: FaDollarSign, 
            // Si no es null, aplica color. Si es null (cargando) no importa el color
            color: resultados !== null && resultados > 0 ? '#2ECC71' : (resultados !== null && resultados < 0 ? '#E74C3C' : '#5A6C7D') 
        },
        { 
            title: "Capital de Trabajo", 
            value: formatCurrency(capitalDeTrabajo), 
            icon: FaTools, 
            color: capitalDeTrabajo !== null && capitalDeTrabajo > 0 ? '#ffc107' : (capitalDeTrabajo !== null && capitalDeTrabajo < 0 ? '#E74C3C' : '#5A6C7D')
        },
    ];


    return (
        <div className='d-flex'>
            <SideBarComponent />
            
            <div style={{ flexGrow: 1, padding: '30px', paddingBottom: '80px' }}> 
                
                {/* 1. Panel de Bienvenida */}
                <div style={styles.welcomePanel}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        ¡Bienvenido a ContaConmigo!
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: styles.secondaryText, maxWidth: '800px' }}>
                        El registro fácil para una contabilidad ordenada. Revisa tus indicadores financieros y genera tus reportes esenciales sencilla y rápidamente.
                    </p>
                    <div className="mt-3">
                         <span className="badge bg-info text-dark" style={{background: styles.primaryColor}}>Novedad: Nuevos indicadores en la pantalla de inicio ya disponibles.</span>
                    </div>
                </div>

                {/* 2. Indicadores Clave (KPIs) */}
                <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#2C3E50', marginBottom: '1.5rem' }}>
                    Resumen del Período
                </h2>
                
                <div className="row g-4 mb-5">
                    {kpis.map((kpi, index) => (
                        <div className="col-lg-3 col-md-6" key={index}>
                            <div 
                                style={styles.kpiCard}
                                className="shadow-sm" 
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.05)'}
                            >
                                <div style={{ ...styles.iconWrapper, background: kpi.color + '20' }}>
                                    {/* Muestra un spinner mientras carga */}
                                    {kpi.value === '...' && kpi.title !== 'Alertas Activas' ? (
                                        <div className="spinner-border spinner-border-sm" role="status" style={{color: kpi.color}}>
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    ) : (
                                        <kpi.icon size={24} style={{ color: kpi.color }} />
                                    )}
                                </div>
                                <h4 style={{ color: styles.secondaryText, fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                    {kpi.title}
                                </h4>
                                <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2C3E50', margin: 0 }}>
                                    $ {kpi.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* 3. Accesos Rápidos */}
                <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#2C3E50', marginBottom: '1.5rem' }}>
                    Acciones Rápidas
                </h2>
                
                <div className="d-flex flex-wrap gap-3">
                    <Link to="/asientos" style={{ textDecoration: 'none' }}>
                         <button style={styles.buttonPrimary} className='btn btn-lg'>
                            <FaPlusCircle className="me-2" /> Registrar Nuevo Asiento
                        </button>
                    </Link>
                    
                    <Link to="/plan-de-cuentas" style={{ textDecoration: 'none' }}>
                         <button style={{...styles.buttonPrimary, background: '#F0F0F0', color: '#2C3E50'}} className='btn btn-lg'>
                            <FaListAlt className="me-2" /> Ver Plan de Cuentas
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default InicioComponent;
