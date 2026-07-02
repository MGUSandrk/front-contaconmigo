import React, { useEffect, useState } from 'react';
import { FaFileInvoice, FaReceipt, FaSpinner } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import VentaServicio from '../../servicios/VentaServicio';

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
        maximumFractionDigits: 2,
    });
};

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('es-AR');
};

const formatEmpty = (value) => {
    if (value === null || typeof value === 'undefined' || value === '') {
        return '-';
    }
    return value;
};

const ListarVentasComponent = () => {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [facturaError, setFacturaError] = useState('');
    const [facturaCargandoId, setFacturaCargandoId] = useState(null);

    useEffect(() => {
        setCargando(true);
        setError('');

        VentaServicio.listarVentas()
            .then((response) => {
                setVentas(response.data || []);
            })
            .catch((err) => {
                console.error(err);
                setVentas([]);
                setError(err.response?.data?.message || 'Error al cargar el historial de ventas.');
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    const abrirFactura = (idVenta) => {
        setFacturaError('');
        setFacturaCargandoId(idVenta);

        VentaServicio.obtenerFactura(idVenta)
            .then((response) => {
                const pdfUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                window.open(pdfUrl, '_blank', 'noopener,noreferrer');

                setTimeout(() => {
                    window.URL.revokeObjectURL(pdfUrl);
                }, 60000);
            })
            .catch((err) => {
                console.error(err);
                setFacturaError(err.response?.data?.message || 'Error al abrir la factura.');
            })
            .finally(() => {
                setFacturaCargandoId(null);
            });
    };

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
                            padding: '1.5rem',
                        }}>
                            <h2 className='d-flex align-items-center m-0' style={{ fontWeight: '700' }}>
                                <FaReceipt size={28} className='me-3' />
                                Historial de Ventas
                            </h2>
                        </div>

                        <div className='card-body p-4 p-md-5'>
                            {error ? (
                                <div className='alert alert-danger mb-4' role='alert'>
                                    {error}
                                </div>
                            ) : cargando ? (
                                <div className='d-flex justify-content-center my-5'>
                                    <FaSpinner size={32} className='text-primary fa-spin me-3' style={{ color: PRIMARY_COLOR }} />
                                    <p className='ms-3 pt-1' style={{ color: TEXT_COLOR }}>Cargando ventas...</p>
                                </div>
                            ) : ventas.length > 0 ? (
                                <>
                                    {facturaError && (
                                        <div className='alert alert-danger mb-4' role='alert'>
                                            {facturaError}
                                        </div>
                                    )}
                                    <div className='table-responsive'>
                                        <table className='table table-bordered table-striped table-hover' style={{ fontSize: '0.95rem' }}>
                                            <thead style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR }}>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Fecha</th>
                                                    <th>Cliente</th>
                                                    <th>Vendedor</th>
                                                    <th>Producto/s</th>
                                                    <th className='text-end'>Total</th>
                                                    <th className='text-center'>Factura</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ventas.map(venta => (
                                                    <tr key={venta.id}>
                                                        <td>{formatEmpty(venta.id)}</td>
                                                        <td>{formatDate(venta.dateCreated)}</td>
                                                        <td>{formatEmpty(venta.clientFullName)}</td>
                                                        <td>{formatEmpty(venta.sellerUsername)}</td>
                                                        <td>{formatEmpty(venta.products?.map(p => p.productName + ' (' + p.quantity + ')' ).join(', '))}</td>
                                                        <td className='text-end'>{formatCurrency(venta.totalPrice)}</td>
                                                        <td className='text-center'>
                                                            <button
                                                                type='button'
                                                                className='btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2'
                                                                onClick={() => abrirFactura(venta.id)}
                                                                disabled={facturaCargandoId === venta.id}
                                                            >
                                                                {facturaCargandoId === venta.id ? (
                                                                    <FaSpinner className='fa-spin' />
                                                                ) : (
                                                                    <FaFileInvoice />
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className='alert alert-info mt-3' role='alert'>
                                    No hay ventas registradas.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListarVentasComponent;
