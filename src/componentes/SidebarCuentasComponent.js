import React, { useEffect, useState } from 'react';
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css';
import PlanDeCuentasServicio from '../servicios/PlanDeCuentasServicio';
import { useNavigate } from 'react-router-dom';
import { getRoleFromToken } from '../utiles/authUtils';
import RefreshService from '../servicios/RefreshService';
import { FaPlusCircle } from 'react-icons/fa';

// --- CONSTANTES DE DISEÑO ---
const PRIMARY_COLOR = '#A8DADC';  
const TEXT_COLOR = '#2C3E50';     
const BACKGROUND_COLOR = '#F8F9FA'; 
const ACTIVE_BG_COLOR = PRIMARY_COLOR; 

// ... (buildTree se mantiene sin cambios) ...

const buildTree = (accounts) => {
    const tree = [];
    const map = new Map();

    accounts.sort((a, b) => a.code.localeCompare(b.code));

    //Carga todo el map con todas las cuentas que recibimos del back
    accounts.forEach(account => {
    const node = {
        id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        children: []
    };
    map.set(account.code, node);
});

    //A cada cuenta la enlaza con su respectivo padre y la almacena dentro de sus childrens
    accounts.forEach(account => {
        const numero = account.code;
        let parentNode = null;

        const parts = numero.split('.');    //Divide en partes codigo de la cuenta separadas por donde habia un "."
        
        let levelToZero = -1;   //Inicializo en -1 para corroborar que se haya encontrado un padre o en su defecto saber que es una raiz
        
        // Encuentra el indice de la ultima parte que es != de '00' y a ese indice lo setea en levelToZero
        for (let i = parts.length - 1; i >= 0; i--) {
            if (parts[i] !== '00' && i > 0) { 
                levelToZero = i;
                break;
            }
        }
        
        // Crea el código del padre si es que no es toda una secuencia de 00.00.00 y así
        if (levelToZero !== -1) { 
            const parentParts = [...parts];     //Setea las partes del padre, con las partes que se habían obtenido previamente
            
            parentParts[levelToZero] = '00';    //Cambia por 00 la parte que esta en el indice encontrado de levelToZero
            
            const parentBaseParts = parentParts.slice(0, levelToZero + 1);  //Corta la partes del padre desde el indice encontrado
            
            let parentCode = parentBaseParts.join('.');     //Junta las partes con un "." de por medio
            
            //Si encuentra al padre lo setea en parentNode
            if (map.has(parentCode)) {
                parentNode = map.get(parentCode);
            } 
            
            //Si no encotro el padre y el codigo sigue teniendo mas de una parte, acorta aun mas las partes para ver si ahi si es el padre
            if (!parentNode && parentBaseParts.length > 1) {
                const shorterParentCode = parentBaseParts.slice(0, parentBaseParts.length - 1).join('.');
                //Si lo es lo setea en parentNode
                if (map.has(shorterParentCode)) {
                    parentNode = map.get(shorterParentCode);
                }
            }
            //Verifica que no sea una cuenta raiz
            if (levelToZero > 0) {
                const strictParentParts = [...parts]; 
                strictParentParts[levelToZero] = '00';  //Cambia la parte significativa para que sea 00
                //Cambio a 00 a todas las partes desde levelToZero en adelante por si existe alguna parte posterior y es != de 00
                for(let i = levelToZero + 1; i < strictParentParts.length; i++) {
                    strictParentParts[i] = '00';
                }
                const strictParentCode = strictParentParts.join('.');   //Y hago el join con los "." de por medio

                if (map.has(strictParentCode)) {
                    parentNode = map.get(strictParentCode);
                }
            }
        }
        
        if (parentNode) {
            parentNode.children.push(map.get(account.code));
        } else {
            tree.push(map.get(account.code));
        }
    });

    return tree;
};


const SidebarCuentasComponent = ({ onSelectAccount }) => {

    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedNodeId, setSelectedNodeId] = useState(null); 

    const userRole = getRoleFromToken();
    const isAdmin = userRole === 'ADMIN';

    const handleSelect = (id) => {
        setSelectedNodeId(id);
        onSelectAccount(id);
    };

    const handleAddCuenta = () => {
        navigate('/add-account');
    };

    const fetchAccounts = async () => {
        setLoading(true); 
        try {
            const response = await PlanDeCuentasServicio.listarCuentas();
            const accounts = response.data;
            
            if (Array.isArray(accounts)) {
                const transformedData = buildTree(accounts);
                setTreeData(transformedData);
                setError('');
                if (!selectedNodeId && accounts.length > 0) {
                    const firstSelectable = accounts.find(a => a.type === 'Imputable');
                    if (firstSelectable) {
                        handleSelect(firstSelectable.id);
                    }
                }
            } else {
                setError('La respuesta del servidor no es un array de cuentas válido.');
                setTreeData([]);
            }
        } catch (err) {
            console.error("Error al obtener las cuentas: ", err);
            setError(err.response?.data?.message || 'Ocurrió un error al cargar el plan de cuentas.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAccounts();

        const unsubscribe = RefreshService.subscribe(() => {
            console.log("Señal de refresco recibida. Recargando cuentas...");
            fetchAccounts(); 
        });

        return () => {
            unsubscribe();
        };
    }, []);


    const renderTree = (data) => {
        return data.map((node) => {
            const isControlAccount = node.type === 'Control';
            const isSelected = node.id === selectedNodeId;
            
            const labelStyle = {
                cursor: 'pointer', 
                padding: '4px 8px', 
                fontWeight: isControlAccount ? '600' : '400',
                fontSize: '0.95rem',
                color: TEXT_COLOR,
                backgroundColor: isSelected ? ACTIVE_BG_COLOR : 'transparent',
                display: 'inline-block',
                transition: 'background-color 0.2s ease',
            };

            const labelContent = (
                <span 
                    onClick={() => handleSelect(node.id)} 
                    style={labelStyle}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = isSelected ? ACTIVE_BG_COLOR : '#E9ECEF'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = isSelected ? ACTIVE_BG_COLOR : 'transparent'}
                >
                    {node.name}
                </span>
            );
            
            if (!isControlAccount) {
                return (
                    <div 
                        key={node.id} 
                        style={{ marginLeft: '16px' }}
                    >
                        {labelContent}
                    </div>
                );
            }

            const hasChildrenToRender = node.children && node.children.length > 0;
            
            return (
                <TreeView
                    key={node.id}
                    nodeLabel={labelContent}
                    defaultCollapsed={true} 
                >
                    {isControlAccount && hasChildrenToRender && renderTree(node.children)}
                </TreeView>
            );
        });
    };

    if (loading) {
        return (
            <div 
                className='rounded shadow p-3 d-flex justify-content-center align-items-center' 
                style={{ 
                    padding: '20px', 
                    height: '100%', 
                    width: '320px', 
                    flexShrink: 0,
                    backgroundColor: BACKGROUND_COLOR
                }}>
                <div className="spinner-border text-info" style={{ color: PRIMARY_COLOR }} role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }
    
    // RENDERIZADO PRINCIPAL CON AJUSTE DE LAYOUT
    return (
        <div 
            className='shadow-sm border-end d-flex flex-column' 
            style={{ 
                // CLAVE 1: Configuración del Contenedor Fijo y Flexible
                width: '320px', 
                flexShrink: 0,
                // height: '100%', // Comentamos o eliminamos esto si el padre es un contenedor flex con altura definida
                backgroundColor: BACKGROUND_COLOR, 
                padding: '20px 0',
                // Aseguramos que el contenedor sea una columna flexible
            }}
        >
            <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: TEXT_COLOR, 
                marginBottom: '1rem',
                padding: '0 20px',
            }}>
                Plan de Cuentas
            </h2>
            
            {/* CLAVE 2: Contenedor del Árbol con SCROLL INTERNO */}
            <div 
                className='account-tree' 
                style={{ 
                    flexGrow: 1,           // Ocupa todo el espacio vertical restante
                    overflowY: 'auto',     // Permite el scroll solo en el árbol
                    padding: '0 20px',
                    paddingBottom: '20px', // Opcional: padding inferior
                }}
            >
                {renderTree(treeData)}
            </div>
            
            {error && <div className='alert alert-danger'>{error}</div>}
            
            {/* CLAVE 3: El botón se mantiene fijo en la parte inferior del sidebar */}
            {isAdmin && (
                <div style={{ padding: '0 20px' }}>
                    <button
                        className='btn btn-lg w-100'
                        onClick={handleAddCuenta}
                        style={{
                            background: PRIMARY_COLOR, 
                            color: TEXT_COLOR, 
                            fontWeight: '600',
                            borderRadius: '8px',
                            border: 'none',
                            marginBottom: '50px', // Separación del árbol
                            padding: '10px 15px',
                        }}
                    >
                        <FaPlusCircle className="me-2" /> Agregar cuenta
                    </button>
                </div>
            )}
        </div>
    );
};

export default SidebarCuentasComponent;