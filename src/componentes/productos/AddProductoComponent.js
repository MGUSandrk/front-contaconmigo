import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaCreditCard, FaPlus, FaSave, FaTimesCircle, FaTrash } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import ProductoServicio from '../../servicios/ProductoServicio';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';

const PRIMARY_COLOR = '#A8DADC';
const TEXT_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#F8F9FA';
const CARD_COLOR = '#FFFFFF';

const normalizeNumberInput = (value) => value.replace(',', '.');

const roundToCents = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const formatCurrency = (value) => {
    return roundToCents(value).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    });
};

const AddProductoComponent = () => {
    const [name, setName] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [lots, setLots] = useState([{ unitPrice: '', stock: '' }]);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [loadingPaymentTypes, setLoadingPaymentTypes] = useState(true);
    const [selectedPaymentTypeId, setSelectedPaymentTypeId] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoadingPaymentTypes(true);
        PaymentTypeServicio.listarTiposPago()
            .then((response) => {
                setPaymentTypes(response.data || []);
            })
            .catch((err) => {
                console.error(err);
                setPaymentTypes([]);
                setError(err.response?.data?.message || 'No se pudieron cargar los tipos de pago.');
            })
            .finally(() => {
                setLoadingPaymentTypes(false);
            });
    }, []);

    const purchaseTotal = roundToCents(lots.reduce((total, lot) => {
        const unitPrice = parseFloat(lot.unitPrice) || 0;
        const stock = parseInt(lot.stock, 10) || 0;
        return total + (unitPrice * stock);
    }, 0));

    const paymentsTotal = roundToCents(payments.reduce((total, payment) => {
        return total + (parseFloat(payment.amount) || 0);
    }, 0));

    const selectedPaymentType = paymentTypes.find(paymentType => String(paymentType.id) === String(selectedPaymentTypeId));
    const pendingTotal = roundToCents(purchaseTotal - paymentsTotal);
    const canSaveProduct = payments.length > 0 && purchaseTotal > 0 && pendingTotal === 0;

    const handleLotChange = (index, event) => {
        const { name: fieldName, value } = event.target;
        const cleanValue = normalizeNumberInput(value);
        const updatedLots = [...lots];
        updatedLots[index] = {
            ...updatedLots[index],
            [fieldName]: cleanValue
        };
        setLots(updatedLots);
        setError('');
    };

    const handleAddLot = () => {
        const lastLot = lots[lots.length - 1];
        if (!lastLot.unitPrice || !lastLot.stock) {
            setError('Complete el lote anterior antes de agregar uno nuevo.');
            return;
        }
        setLots([...lots, { unitPrice: '', stock: '' }]);
        setError('');
    };

    const handleRemoveLot = (index) => {
        if (lots.length === 1) {
            setError('El producto debe tener al menos un lote.');
            return;
        }
        const updatedLots = [...lots];
        updatedLots.splice(index, 1);
        setLots(updatedLots);
        setError('');
    };

    const handlePaymentAmountChange = (event) => {
        setPaymentAmount(normalizeNumberInput(event.target.value));
        setError('');
    };

    const handleAddPayment = () => {
        if (!selectedPaymentTypeId) {
            setError('Debe seleccionar un metodo de pago.');
            return;
        }

        const parsedAmount = parseFloat(paymentAmount);
        if (paymentAmount === '' || isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('El monto del pago debe ser mayor a 0.');
            return;
        }

        if (payments.some(payment => String(payment.id) === String(selectedPaymentTypeId))) {
            setError('Ese metodo de pago ya fue agregado.');
            return;
        }

        const nextPaymentsTotal = roundToCents(paymentsTotal + parsedAmount);
        if (purchaseTotal > 0 && nextPaymentsTotal > purchaseTotal) {
            setError('La suma de pagos no puede superar el total de la compra.');
            return;
        }

        setPayments([
            ...payments,
            {
                id: String(selectedPaymentTypeId),
                type: selectedPaymentType?.type || `Metodo #${selectedPaymentTypeId}`,
                amount: paymentAmount,
            },
        ]);
        setSelectedPaymentTypeId('');
        setPaymentAmount('');
        setError('');
    };

    const handleRemovePayment = (paymentId) => {
        setPayments(payments.filter(payment => String(payment.id) !== String(paymentId)));
        setError('');
    };

    const validateProduct = () => {
        if (!name.trim()) {
            return 'El nombre del producto es obligatorio.';
        }

        const parsedSalePrice = parseFloat(salePrice);
        if (salePrice === '' || isNaN(parsedSalePrice) || parsedSalePrice < 0) {
            return 'El precio de venta debe ser un numero mayor o igual a 0.';
        }

        if (lots.length === 0) {
            return 'El producto debe tener al menos un lote.';
        }

        const invalidLot = lots.some(lot => {
            const unitPrice = parseFloat(lot.unitPrice);
            const stock = parseInt(lot.stock, 10);
            return lot.unitPrice === '' || lot.stock === '' || isNaN(unitPrice) || unitPrice < 0 || isNaN(stock) || stock <= 0;
        });

        if (invalidLot) {
            return 'Cada lote debe tener precio unitario mayor o igual a 0 y stock mayor a 0.';
        }

        if (payments.length === 0) {
            return 'Debe agregar al menos un pago de la compra.';
        }

        const invalidPayment = payments.some(payment => {
            const amount = parseFloat(payment.amount);
            return payment.amount === '' || isNaN(amount) || amount <= 0;
        });

        if (invalidPayment) {
            return 'Cada pago debe tener un monto mayor a 0.';
        }

        if (roundToCents(paymentsTotal) !== roundToCents(purchaseTotal)) {
            return 'La suma de los pagos debe coincidir con el total de la compra.';
        }

        return '';
    };

    const guardarProducto = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateProduct();
        if (validationError) {
            setError(validationError);
            return;
        }

        const product = {
            name: name.trim(),
            salePrice: parseFloat(salePrice),
            lots: lots.map(lot => ({
                unitPrice: parseFloat(lot.unitPrice),
                stock: parseInt(lot.stock, 10),
            })),
            payments: payments.map(payment => ({
                id: String(payment.id),
                amount: String(payment.amount),
            })),
        };

        setIsSaving(true);

        try {
            await ProductoServicio.crearProducto(product);
            navigate('/productos');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Ocurrio un error al guardar el producto.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className='d-flex' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: 'var(--app-content-min-height)' }}>
            <SideBarComponent />

            <div className='flex-grow-1 p-0 p-md-5'>
                <div className='col-lg-10 offset-lg-1'>
                    <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
                        <div className='card-header text-center d-flex align-items-center justify-content-center' style={{
                            backgroundColor: PRIMARY_COLOR,
                            color: TEXT_COLOR,
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                            padding: '1.5rem 0'
                        }}>
                            <FaBoxOpen size={28} className='me-3' />
                            <h2 className='d-inline-block m-0' style={{ fontWeight: '700' }}>
                                Registro de Producto
                            </h2>
                        </div>

                        <div className='card-body p-4 p-md-5'>
                            <form onSubmit={guardarProducto}>
                                <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Datos del Producto</h4>

                                <div className='row mb-4'>
                                    <div className='form-group col-md-7 mb-3 mb-md-0'>
                                        <label htmlFor='productName' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                            Nombre del Producto:
                                        </label>
                                        <input
                                            id='productName'
                                            type='text'
                                            className='form-control form-control-lg'
                                            placeholder='Ej: Yerba mate'
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                setError('');
                                            }}
                                            disabled={isSaving}
                                            required
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                    </div>

                                    <div className='form-group col-md-5'>
                                        <label htmlFor='salePrice' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                            Precio de Venta:
                                        </label>
                                        <input
                                            id='salePrice'
                                            type='number'
                                            className='form-control form-control-lg'
                                            placeholder='0.00'
                                            value={salePrice}
                                            onChange={(e) => {
                                                setSalePrice(e.target.value);
                                                setError('');
                                            }}
                                            step='0.01'
                                            min='0'
                                            disabled={isSaving}
                                            required
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                    </div>
                                </div>

                                <h4 className='mb-4' style={{ color: TEXT_COLOR }}>Lotes</h4>

                                <div className='table-responsive' style={{ border: '1px solid #E0E0E0', borderRadius: '8px' }}>
                                    <table className='table table-hover mb-0'>
                                        <thead style={{ backgroundColor: '#F0F0F0' }}>
                                            <tr>
                                                <th style={{ width: '45%', color: TEXT_COLOR }}>Precio Unitario</th>
                                                <th style={{ width: '45%', color: TEXT_COLOR }}>Stock</th>
                                                <th style={{ width: '10%' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lots.map((lot, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <label className='visually-hidden' htmlFor={`unitPrice-${index}`}>
                                                            Precio Unitario:
                                                        </label>
                                                        <input
                                                            id={`unitPrice-${index}`}
                                                            type='number'
                                                            name='unitPrice'
                                                            className='form-control'
                                                            placeholder='0.00'
                                                            value={lot.unitPrice}
                                                            onChange={(e) => handleLotChange(index, e)}
                                                            step='0.01'
                                                            min='0'
                                                            disabled={isSaving}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <label className='visually-hidden' htmlFor={`stock-${index}`}>
                                                            Stock:
                                                        </label>
                                                        <input
                                                            id={`stock-${index}`}
                                                            type='number'
                                                            name='stock'
                                                            className='form-control'
                                                            placeholder='0'
                                                            value={lot.stock}
                                                            onChange={(e) => handleLotChange(index, e)}
                                                            min='1'
                                                            disabled={isSaving}
                                                            required
                                                        />
                                                    </td>
                                                    <td className='text-center'>
                                                        {lots.length > 1 && (
                                                            <button
                                                                type='button'
                                                                className='btn btn-sm btn-outline-danger'
                                                                onClick={() => handleRemoveLot(index)}
                                                                disabled={isSaving}
                                                                title='Eliminar lote'
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

                                <div className='d-flex justify-content-between align-items-center mt-3 mb-4'>
                                    <button
                                        type='button'
                                        className='btn btn-outline-secondary'
                                        onClick={handleAddLot}
                                        disabled={isSaving}
                                    >
                                        <FaPlus className='me-2' /> Agregar Lote
                                    </button>
                                </div>

                                <div className='border-top pt-4 mb-4'>
                                    <h4 className='mb-3 d-flex align-items-center' style={{ color: TEXT_COLOR }}>
                                        <FaCreditCard className='me-2' /> Pagos de la Compra
                                    </h4>

                                    <div className='row g-3 mb-3'>
                                        <div className='form-group col-md-5'>
                                            <label htmlFor='paymentTypeId' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                                Metodo de Pago:
                                            </label>
                                            <select
                                                id='paymentTypeId'
                                                className='form-select'
                                                value={selectedPaymentTypeId}
                                                onChange={(e) => {
                                                    setSelectedPaymentTypeId(e.target.value);
                                                    setError('');
                                                }}
                                                disabled={isSaving || loadingPaymentTypes}
                                                style={{ borderColor: PRIMARY_COLOR }}
                                            >
                                                <option value=''>
                                                    {loadingPaymentTypes ? 'Cargando metodos...' : '-- Seleccione un metodo --'}
                                                </option>
                                                {paymentTypes
                                                    .filter(paymentType => !payments.some(payment => String(payment.id) === String(paymentType.id)))
                                                    .map(paymentType => (
                                                        <option key={paymentType.id} value={paymentType.id}>
                                                            {paymentType.type}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className='form-group col-md-4'>
                                            <label htmlFor='paymentAmount' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                                Monto del Pago:
                                            </label>
                                            <input
                                                id='paymentAmount'
                                                type='number'
                                                className='form-control'
                                                placeholder='0.00'
                                                value={paymentAmount}
                                                onChange={handlePaymentAmountChange}
                                                step='0.01'
                                                min='0.01'
                                                disabled={isSaving || loadingPaymentTypes}
                                                style={{ borderColor: PRIMARY_COLOR }}
                                            />
                                            {selectedPaymentType && (
                                                <div className='form-text' style={{ color: TEXT_COLOR }}>
                                                    Monto disponible: {formatCurrency(parseFloat(selectedPaymentType.balance) || 0)}
                                                </div>
                                            )}
                                        </div>

                                        <div className='col-md-3'>
                                            <div className='form-label d-none d-md-block' style={{ fontWeight: '600', visibility: 'hidden' }}>
                                                Agregar Pago:
                                            </div>
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary w-100'
                                                onClick={handleAddPayment}
                                                disabled={isSaving || loadingPaymentTypes}
                                            >
                                                <FaPlus className='me-2' /> Agregar Pago
                                            </button>
                                        </div>
                                    </div>

                                    {payments.length > 0 && (
                                        <div className='table-responsive mb-3' style={{ border: '1px solid #E0E0E0', borderRadius: '8px' }}>
                                            <table className='table table-hover mb-0'>
                                                <thead style={{ backgroundColor: '#F0F0F0' }}>
                                                    <tr>
                                                        <th style={{ width: '55%', color: TEXT_COLOR }}>Metodo</th>
                                                        <th className='text-end' style={{ width: '35%', color: TEXT_COLOR }}>Monto</th>
                                                        <th style={{ width: '10%' }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payments.map(payment => (
                                                        <tr key={payment.id}>
                                                            <td>{payment.type}</td>
                                                            <td className='text-end'>{formatCurrency(parseFloat(payment.amount) || 0)}</td>
                                                            <td className='text-center'>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-sm btn-outline-danger'
                                                                    onClick={() => handleRemovePayment(payment.id)}
                                                                    disabled={isSaving}
                                                                    title='Eliminar pago'
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <div className='row g-3'>
                                        <div className='col-md-4'>
                                            <div className='p-3 border rounded-2 bg-light'>
                                                <div className='small text-muted'>Total compra</div>
                                                <strong style={{ color: TEXT_COLOR }}>{formatCurrency(purchaseTotal)}</strong>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='p-3 border rounded-2 bg-light'>
                                                <div className='small text-muted'>Total pagos</div>
                                                <strong style={{ color: TEXT_COLOR }}>{formatCurrency(paymentsTotal)}</strong>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='p-3 border rounded-2 bg-light'>
                                                <div className='small text-muted'>Pendiente</div>
                                                <strong style={{ color: pendingTotal === 0 ? '#198754' : TEXT_COLOR }}>
                                                    {formatCurrency(pendingTotal)}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && <div className='alert alert-danger mt-4'>{error}</div>}

                                <div className='d-grid gap-2 d-md-flex justify-content-md-end mt-4 pt-3 border-top'>
                                    <button
                                        className='btn btn-lg me-md-2'
                                        type='submit'
                                        disabled={isSaving || loadingPaymentTypes || !canSaveProduct}
                                        style={{
                                            backgroundColor: canSaveProduct ? PRIMARY_COLOR : '#E0E0E0',
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
                                            <><FaSave className='me-2' /> Guardar Producto</>
                                        )}
                                    </button>

                                    <Link
                                        to='/productos'
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

export default AddProductoComponent;
