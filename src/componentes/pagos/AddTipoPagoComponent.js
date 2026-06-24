import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaSave, FaTimesCircle } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';
import PlanDeCuentasServicio from '../../servicios/PlanDeCuentasServicio';

const PRIMARY_COLOR = '#A8DADC';
const TEXT_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#F8F9FA';
const CARD_COLOR = '#FFFFFF';

const AddTipoPagoComponent = () => {
    const [type, setType] = useState('');
    const [accountId, setAccountId] = useState('');
    const [cuentas, setCuentas] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoadingAccounts(true);
        PlanDeCuentasServicio.getBalanceAccounts()
            .then((response) => {
                setCuentas(response.data || []);
            })
            .catch((err) => {
                console.error(err);
                setCuentas([]);
                setError(err.response?.data?.message || 'No se pudieron cargar las cuentas imputables.');
            })
            .finally(() => {
                setLoadingAccounts(false);
            });
    }, []);

    const guardarTipoPago = async (e) => {
        e.preventDefault();
        setError('');

        if (!type.trim()) {
            setError('El tipo de pago es obligatorio.');
            return;
        }

        if (!accountId) {
            setError('Debe seleccionar una cuenta asociada.');
            return;
        }

        const paymentType = {
            type: type.trim(),
            accountId: parseInt(accountId, 10),
        };

        setIsSaving(true);

        try {
            await PaymentTypeServicio.crearTipoPago(paymentType);
            navigate('/tipos-pago');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Ocurrio un error al guardar el tipo de pago.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className='d-flex' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: 'var(--app-content-min-height)' }}>
            <SideBarComponent />

            <div className='flex-grow-1 p-0 p-md-5'>
                <div className='col-lg-8 offset-lg-2'>
                    <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
                        <div className='card-header text-center d-flex align-items-center justify-content-center' style={{
                            backgroundColor: PRIMARY_COLOR,
                            color: TEXT_COLOR,
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                            padding: '1.5rem 0'
                        }}>
                            <FaCreditCard size={28} className='me-3' />
                            <h2 className='d-inline-block m-0' style={{ fontWeight: '700' }}>
                                Registro de Tipo de Pago
                            </h2>
                        </div>

                        <div className='card-body p-4 p-md-5'>
                            <form onSubmit={guardarTipoPago}>
                                <div className='form-group mb-4'>
                                    <label htmlFor='paymentType' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Tipo de Pago:
                                    </label>
                                    <input
                                        id='paymentType'
                                        type='text'
                                        className='form-control form-control-lg'
                                        placeholder='Ej: Efectivo, Transferencia, Tarjeta'
                                        value={type}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            setError('');
                                        }}
                                        disabled={isSaving}
                                        required
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    />
                                </div>

                                <div className='form-group mb-4'>
                                    <label htmlFor='accountId' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Cuenta Asociada:
                                    </label>
                                    <select
                                        id='accountId'
                                        className='form-select form-select-lg'
                                        value={accountId}
                                        onChange={(e) => {
                                            setAccountId(e.target.value);
                                            setError('');
                                        }}
                                        disabled={isSaving || loadingAccounts}
                                        required
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    >
                                        <option value='' disabled>
                                            {loadingAccounts ? 'Cargando cuentas...' : '-- Seleccione una cuenta --'}
                                        </option>
                                        {cuentas.map(account => (
                                            <option key={account.id} value={account.id}>
                                                {account.code} - {account.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {error && <div className='alert alert-danger mt-4'>{error}</div>}

                                <div className='d-grid gap-2 d-md-flex justify-content-md-end mt-4 pt-3 border-top'>
                                    <button
                                        className='btn btn-lg me-md-2'
                                        type='submit'
                                        disabled={isSaving || loadingAccounts}
                                        style={{
                                            backgroundColor: PRIMARY_COLOR,
                                            color: TEXT_COLOR,
                                            fontWeight: '600'
                                        }}
                                    >
                                        {isSaving ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            <><FaSave className='me-2' /> Guardar Tipo de Pago</>
                                        )}
                                    </button>

                                    <Link
                                        to='/tipos-pago'
                                        className='btn btn-secondary btn-lg'
                                        tabIndex={isSaving ? -1 : 0}
                                        style={isSaving ? { pointerEvents: 'none', opacity: 0.6 } : {}}
                                    >
                                        <FaTimesCircle className='me-2' /> Cancelar
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

export default AddTipoPagoComponent;
