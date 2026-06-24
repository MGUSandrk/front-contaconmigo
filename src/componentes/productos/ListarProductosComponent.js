import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaPlusCircle, FaSearch, FaSpinner } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import ProductoServicio from '../../servicios/ProductoServicio';
import { getRoleFromToken } from '../../utiles/authUtils';

const PRIMARY_COLOR = '#A8DADC';
const TEXT_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#F8F9FA';
const CARD_COLOR = '#FFFFFF';

const formatCurrency = (value) => {
    if (value === null || typeof value === 'undefined') return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const getLots = (product) => {
    if (!product || !Array.isArray(product.lots)) {
        return [];
    }
    return product.lots;
};

const getTotalStock = (product) => {
    return getLots(product).reduce((total, lot) => total + (parseInt(lot.stock, 10) || 0), 0);
};

const ListarProductosComponent = () => {
    const [productos, setProductos] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const userRole = getRoleFromToken();
    const isAdmin = userRole === 'ADMIN';

    useEffect(() => {
        setCargando(true);
        setError('');

        ProductoServicio.listarProductos()
            .then((response) => {
                setProductos(response.data || []);
            })
            .catch((err) => {
                console.error(err);
                setProductos([]);
                setError(err.response?.data?.message || 'Error al cargar la lista de productos.');
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    const productosFiltrados = useMemo(() => {
        const filtro = filtroNombre.trim().toLowerCase();
        if (!filtro) {
            return productos;
        }
        return productos.filter(product => (product.name || '').toLowerCase().includes(filtro));
    }, [productos, filtroNombre]);

    return (
        <div className='d-flex' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: 'var(--app-content-min-height)' }}>
            <SideBarComponent />

            <div className='flex-grow-1 p-0 p-md-5'>
                <div className='col-lg-12'>
                    <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
                        <div className='card-header d-flex flex-column flex-md-row align-items-center justify-content-between' style={{
                            backgroundColor: PRIMARY_COLOR,
                            color: TEXT_COLOR,
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                            padding: '1.5rem'
                        }}>
                            <h2 className='d-flex align-items-center m-0 mb-3 mb-md-0' style={{ fontWeight: '700' }}>
                                <FaBoxOpen size={28} className='me-3' />
                                Productos
                            </h2>
                            {isAdmin && (
                                <Link to='/add-producto' className='btn btn-success d-flex align-items-center' style={{ fontWeight: '600' }}>
                                    <FaPlusCircle className='me-2' /> Agregar Producto
                                </Link>
                            )}
                        </div>

                        <div className='card-body p-4 p-md-5'>
                            <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Buscar Producto</h4>
                            <div className='d-flex flex-wrap align-items-end mb-4 p-3 border rounded' style={{ backgroundColor: '#F0F0F0' }}>
                                <div className='form-group flex-grow-1 me-md-4 mb-2'>
                                    <label className='form-label' style={{ fontWeight: '600' }}>Nombre:</label>
                                    <div className='input-group'>
                                        <span className='input-group-text' style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR }}>
                                            <FaSearch />
                                        </span>
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Buscar producto por nombre'
                                            value={filtroNombre}
                                            onChange={(e) => setFiltroNombre(e.target.value)}
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className='alert alert-danger mb-4' role='alert'>
                                    {error}
                                </div>
                            )}

                            {cargando ? (
                                <div className='d-flex justify-content-center my-5'>
                                    <FaSpinner size={32} className='text-primary fa-spin me-3' style={{ color: PRIMARY_COLOR }} />
                                    <p className='ms-3 pt-1' style={{ color: TEXT_COLOR }}>Cargando productos...</p>
                                </div>
                            ) : productosFiltrados.length > 0 ? (
                                <div className='table-responsive'>
                                    <table className='table table-bordered table-striped table-hover' style={{ fontSize: '0.95rem' }}>
                                        <thead style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR }}>
                                            <tr>
                                                <th style={{ width: '35%' }}>Nombre</th>
                                                <th style={{ width: '20%', textAlign: 'right' }}>Precio de Venta</th>
                                                <th style={{ width: '20%', textAlign: 'center' }}>Cantidad de Lotes</th>
                                                <th style={{ width: '25%', textAlign: 'right' }}>Stock Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productosFiltrados.map(product => (
                                                <tr key={product.id || product.name}>
                                                    <td>{product.name}</td>
                                                    <td className='text-end'>{formatCurrency(product.salePrice)}</td>
                                                    <td className='text-center'>{getLots(product).length}</td>
                                                    <td className='text-end'>{getTotalStock(product)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className='alert alert-info mt-3' role='alert'>
                                    No se encontraron productos para mostrar.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListarProductosComponent;
