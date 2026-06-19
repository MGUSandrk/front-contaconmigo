import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaPlusCircle, FaSpinner } from 'react-icons/fa';
import SideBarComponent from './SideBarComponent';
import PaymentTypeServicio from '../servicios/PaymentTypeServicio';
import { getRoleFromToken } from '../utiles/authUtils';

const PRIMARY_COLOR = '#A8DADC';
const TEXT_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#F8F9FA';
const CARD_COLOR = '#FFFFFF';

const getAccountLabel = (paymentType) => {
    if (paymentType.accountName) {
        const code = paymentType.accountCode ? `${paymentType.accountCode} - ` : '';
        return `${code}${paymentType.accountName || `Cuenta #${paymentType.accountId}`}`;
    }

    if (paymentType.accountId) {
        return `Cuenta #${paymentType.accountId}`;
    }

    return 'Sin cuenta asociada';
};

const ListarTiposPagoComponent = () => {
    const [tiposPago, setTiposPago] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const userRole = getRoleFromToken();
    const isAdmin = userRole === 'ADMIN';

    useEffect(() => {
        setCargando(true);
        setError('');

        PaymentTypeServicio.listarTiposPago()
            .then((response) => {
                setTiposPago(response.data || []);
            })
            .catch((err) => {
                console.error(err);
                setTiposPago([]);
                setError(err.response?.data?.message || 'Error al cargar la lista de tipos de pago.');
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    return (
        <div className='d-flex' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh' }}>
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
                                <FaCreditCard size={28} className='me-3' />
                                Tipos de Pago
                            </h2>
                            {isAdmin && (
                                <Link to='/add-tipo-pago' className='btn btn-success d-flex align-items-center' style={{ fontWeight: '600' }}>
                                    <FaPlusCircle className='me-2' /> Agregar Tipo de Pago
                                </Link>
                            )}
                        </div>

                        <div className='card-body p-4 p-md-5'>
                            {error && (
                                <div className='alert alert-danger mb-4' role='alert'>
                                    {error}
                                </div>
                            )}

                            {cargando ? (
                                <div className='d-flex justify-content-center my-5'>
                                    <FaSpinner size={32} className='text-primary fa-spin me-3' style={{ color: PRIMARY_COLOR }} />
                                    <p className='ms-3 pt-1' style={{ color: TEXT_COLOR }}>Cargando tipos de pago...</p>
                                </div>
                            ) : tiposPago.length > 0 ? (
                                <div className='table-responsive'>
                                    <table className='table table-bordered table-striped table-hover' style={{ fontSize: '0.95rem' }}>
                                        <thead style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR }}>
                                            <tr>
                                                <th style={{ width: '45%' }}>Tipo</th>
                                                <th style={{ width: '55%' }}>Cuenta Asociada</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tiposPago.map(paymentType => (
                                                <tr key={paymentType.id || paymentType.type}>
                                                    <td>{paymentType.type}</td>
                                                    <td>{getAccountLabel(paymentType)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className='alert alert-info mt-3' role='alert'>
                                    No hay tipos de pago registrados.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListarTiposPagoComponent;
