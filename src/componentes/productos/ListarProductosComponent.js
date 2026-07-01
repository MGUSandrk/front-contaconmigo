import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaCreditCard, FaEye, FaPlus, FaPlusCircle, FaSave, FaSearch, FaSpinner, FaTimes, FaTrash } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import ProductoServicio from '../../servicios/ProductoServicio';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';
import { getRoleFromToken } from '../../utiles/authUtils';

const PRIMARY_COLOR = '#A8DADC';
const TEXT_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#F8F9FA';
const CARD_COLOR = '#FFFFFF';

const normalizeNumberInput = (value) => value.replace(',', '.');

const roundToCents = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

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
    if (!product || product.totalStock === null || typeof product.totalStock === 'undefined') {
        return 0;
    }
    return parseInt(product.totalStock, 10) || 0;
};

const ListarProductosComponent = () => {
    const [productos, setProductos] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [productoParaLot, setProductoParaLot] = useState(null);
    const [lot, setLot] = useState({ unitPrice: '', stock: '' });
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [loadingPaymentTypes, setLoadingPaymentTypes] = useState(false);
    const [selectedPaymentTypeId, setSelectedPaymentTypeId] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [payments, setPayments] = useState([]);
    const [lotError, setLotError] = useState('');
    const [isSavingLot, setIsSavingLot] = useState(false);

    const userRole = getRoleFromToken();
    const isAdmin = userRole === 'ADMIN';

    const cargarProductos = () => {
        setCargando(true);
        setError('');

        return ProductoServicio.listarProductos()
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
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const productosFiltrados = useMemo(() => {
        const filtro = filtroNombre.trim().toLowerCase();
        if (!filtro) {
            return productos;
        }
        return productos.filter(product => (product.name || '').toLowerCase().includes(filtro));
    }, [productos, filtroNombre]);

    const lotesSeleccionados = getLots(productoSeleccionado);
    const purchaseTotal = roundToCents((parseFloat(lot.unitPrice) || 0) * (parseInt(lot.stock, 10) || 0));
    const paymentsTotal = roundToCents(payments.reduce((total, payment) => {
        return total + (parseFloat(payment.amount) || 0);
    }, 0));
    const pendingTotal = roundToCents(purchaseTotal - paymentsTotal);
    const selectedPaymentType = paymentTypes.find(paymentType => String(paymentType.id) === String(selectedPaymentTypeId));
    const canSaveLot = Boolean(productoParaLot) && payments.length > 0 && purchaseTotal > 0 && pendingTotal === 0;

    const resetLotForm = () => {
        setLot({ unitPrice: '', stock: '' });
        setSelectedPaymentTypeId('');
        setPaymentAmount('');
        setPayments([]);
        setLotError('');
        setIsSavingLot(false);
    };

    const abrirAgregarLot = (product) => {
        setProductoParaLot(product);
        resetLotForm();
        setLoadingPaymentTypes(true);
        PaymentTypeServicio.listarTiposPago()
            .then((response) => {
                setPaymentTypes(response.data || []);
            })
            .catch((err) => {
                console.error(err);
                setPaymentTypes([]);
                setLotError(err.response?.data?.message || 'No se pudieron cargar los tipos de pago.');
            })
            .finally(() => {
                setLoadingPaymentTypes(false);
            });
    };

    const cerrarAgregarLot = () => {
        setProductoParaLot(null);
        resetLotForm();
    };

    const handleLotChange = (event) => {
        const { name, value } = event.target;
        setLot({
            ...lot,
            [name]: normalizeNumberInput(value),
        });
        setLotError('');
    };

    const handlePaymentAmountChange = (event) => {
        setPaymentAmount(normalizeNumberInput(event.target.value));
        setLotError('');
    };

    const handleAddPayment = () => {
        if (!selectedPaymentTypeId) {
            setLotError('Debe seleccionar un metodo de pago.');
            return;
        }

        const parsedAmount = parseFloat(paymentAmount);
        if (paymentAmount === '' || isNaN(parsedAmount) || parsedAmount <= 0) {
            setLotError('El monto del pago debe ser mayor a 0.');
            return;
        }

        if (payments.some(payment => String(payment.id) === String(selectedPaymentTypeId))) {
            setLotError('Ese metodo de pago ya fue agregado.');
            return;
        }

        const nextPaymentsTotal = roundToCents(paymentsTotal + parsedAmount);
        if (purchaseTotal > 0 && nextPaymentsTotal > purchaseTotal) {
            setLotError('La suma de pagos no puede superar el total de la compra.');
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
        setLotError('');
    };

    const handleRemovePayment = (paymentId) => {
        setPayments(payments.filter(payment => String(payment.id) !== String(paymentId)));
        setLotError('');
    };

    const validateLot = () => {
        const unitPrice = parseFloat(lot.unitPrice);
        const stock = parseInt(lot.stock, 10);
        if (lot.unitPrice === '' || lot.stock === '' || isNaN(unitPrice) || unitPrice < 0 || isNaN(stock) || stock <= 0) {
            return 'El lot debe tener precio unitario mayor o igual a 0 y stock mayor a 0.';
        }

        if (payments.length === 0) {
            return 'Debe agregar al menos un pago de la compra.';
        }

        if (roundToCents(paymentsTotal) !== roundToCents(purchaseTotal)) {
            return 'La suma de los pagos debe coincidir con el total de la compra.';
        }

        return '';
    };

    const guardarLot = async (event) => {
        event.preventDefault();
        setLotError('');

        const validationError = validateLot();
        if (validationError) {
            setLotError(validationError);
            return;
        }

        const payload = {
            lot: {
                unitPrice: parseFloat(lot.unitPrice),
                stock: parseInt(lot.stock, 10),
            },
            payments: payments.map(payment => ({
                id: String(payment.id),
                amount: String(payment.amount),
            })),
        };

        setIsSavingLot(true);
        try {
            await ProductoServicio.crearLotProducto(productoParaLot.id, payload);
            await cargarProductos();
            cerrarAgregarLot();
        } catch (err) {
            console.error(err);
            setLotError(err.response?.data?.message || 'Ocurrio un error al guardar el lot.');
        } finally {
            setIsSavingLot(false);
        }
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
                                                <th style={{ width: '30%' }}>Nombre</th>
                                                <th style={{ width: '20%', textAlign: 'right' }}>Precio de Venta</th>
                                                <th style={{ width: '20%', textAlign: 'center' }}>Cantidad de Lotes</th>
                                                <th style={{ width: '15%', textAlign: 'right' }}>Stock Total</th>
                                                {isAdmin && <th style={{ width: '15%', textAlign: 'center' }}>Acciones</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productosFiltrados.map(product => (
                                                <tr key={product.id || product.name}>
                                                    <td>{product.name}</td>
                                                    <td className='text-end'>{formatCurrency(product.salePrice)}</td>
                                                    <td className='text-center'>
                                                        <div className='d-inline-flex align-items-center justify-content-center gap-2'>
                                                            <span>{getLots(product).length}</span>
                                                            <button
                                                                type='button'
                                                                className='btn btn-outline-info btn-sm d-inline-flex align-items-center'
                                                                aria-label={`Ver lotes de ${product.name}`}
                                                                title={`Ver lotes de ${product.name}`}
                                                                onClick={() => setProductoSeleccionado(product)}
                                                            >
                                                                <FaEye />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className='text-end'>{getTotalStock(product)}</td>
                                                    {isAdmin && (
                                                        <td className='text-center'>
                                                            <button
                                                                type='button'
                                                                className='btn btn-outline-success btn-sm d-inline-flex align-items-center'
                                                                aria-label={`Agregar lot a ${product.name}`}
                                                                title={`Agregar lot a ${product.name}`}
                                                                onClick={() => abrirAgregarLot(product)}
                                                            >
                                                                <FaPlus />
                                                            </button>
                                                        </td>
                                                    )}
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

            {productoSeleccionado && (
                <div
                    className='modal show d-block'
                    role='dialog'
                    aria-modal='true'
                    aria-labelledby='lotes-producto-title'
                    tabIndex='-1'
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
                >
                    <div className='modal-dialog modal-lg modal-dialog-centered'>
                        <div className='modal-content' style={{ borderRadius: '12px' }}>
                            <div className='modal-header' style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR }}>
                                <h5 className='modal-title' id='lotes-producto-title' style={{ fontWeight: '700' }}>
                                    Lotes de {productoSeleccionado.name}
                                </h5>
                                <button
                                    type='button'
                                    className='btn btn-outline-dark btn-sm d-inline-flex align-items-center'
                                    aria-label='Cerrar'
                                    onClick={() => setProductoSeleccionado(null)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className='modal-body'>
                                {lotesSeleccionados.length > 0 ? (
                                    <div className='table-responsive'>
                                        <table className='table table-bordered table-striped mb-0'>
                                            <thead style={{ backgroundColor: '#F0F0F0', color: TEXT_COLOR }}>
                                                <tr>
                                                    <th>Precio</th>
                                                    <th className='text-end'>Cantidad</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lotesSeleccionados.map((lot, index) => (
                                                    <tr key={lot.id || `${productoSeleccionado.id}-lot-${index}`}>
                                                        <td>{formatCurrency(lot.unitPrice)}</td>
                                                        <td className='text-end'>{parseInt(lot.stock, 10) || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className='alert alert-info mb-0' role='alert'>
                                        Este producto no tiene lotes para mostrar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {productoParaLot && (
                <div
                    className='modal show d-block'
                    role='dialog'
                    aria-modal='true'
                    aria-labelledby='agregar-lot-title'
                    tabIndex='-1'
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
                >
                    <div className='modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable'>
                        <div className='modal-content' style={{ borderRadius: '12px' }}>
                            <form onSubmit={guardarLot}>
                                <div className='modal-header' style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR }}>
                                    <h5 className='modal-title' id='agregar-lot-title' style={{ fontWeight: '700' }}>
                                        Agregar lot a {productoParaLot.name}
                                    </h5>
                                    <button
                                        type='button'
                                        className='btn btn-outline-dark btn-sm d-inline-flex align-items-center'
                                        aria-label='Cerrar agregar lot'
                                        onClick={cerrarAgregarLot}
                                        disabled={isSavingLot}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                <div className='modal-body'>
                                    <div className='row mb-4'>
                                        <div className='form-group col-md-7 mb-3 mb-md-0'>
                                            <label htmlFor='lotProductName' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                                Nombre del Producto:
                                            </label>
                                            <input
                                                id='lotProductName'
                                                type='text'
                                                className='form-control form-control-lg'
                                                value={productoParaLot.name}
                                                disabled
                                                readOnly
                                                style={{ borderColor: PRIMARY_COLOR }}
                                            />
                                        </div>

                                        <div className='form-group col-md-5'>
                                            <label htmlFor='lotSalePrice' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                                Precio de Venta:
                                            </label>
                                            <input
                                                id='lotSalePrice'
                                                type='number'
                                                className='form-control form-control-lg'
                                                value={productoParaLot.salePrice}
                                                disabled
                                                readOnly
                                                style={{ borderColor: PRIMARY_COLOR }}
                                            />
                                        </div>
                                    </div>

                                    <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Nuevo Lot</h4>
                                    <div className='table-responsive mb-4' style={{ border: '1px solid #E0E0E0', borderRadius: '8px' }}>
                                        <table className='table table-hover mb-0'>
                                            <thead style={{ backgroundColor: '#F0F0F0' }}>
                                                <tr>
                                                    <th style={{ width: '50%', color: TEXT_COLOR }}>Precio Unitario</th>
                                                    <th style={{ width: '50%', color: TEXT_COLOR }}>Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <label className='visually-hidden' htmlFor='newLotUnitPrice'>
                                                            Precio Unitario:
                                                        </label>
                                                        <input
                                                            id='newLotUnitPrice'
                                                            type='number'
                                                            name='unitPrice'
                                                            className='form-control'
                                                            placeholder='0.00'
                                                            value={lot.unitPrice}
                                                            onChange={handleLotChange}
                                                            step='0.01'
                                                            min='0'
                                                            disabled={isSavingLot}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <label className='visually-hidden' htmlFor='newLotStock'>
                                                            Stock:
                                                        </label>
                                                        <input
                                                            id='newLotStock'
                                                            type='number'
                                                            name='stock'
                                                            className='form-control'
                                                            placeholder='0'
                                                            value={lot.stock}
                                                            onChange={handleLotChange}
                                                            min='1'
                                                            disabled={isSavingLot}
                                                            required
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='border-top pt-4 mb-4'>
                                        <h4 className='mb-3 d-flex align-items-center' style={{ color: TEXT_COLOR }}>
                                            <FaCreditCard className='me-2' /> Pagos de la Compra
                                        </h4>

                                        <div className='row g-3 mb-3'>
                                            <div className='form-group col-md-5'>
                                                <label htmlFor='lotPaymentTypeId' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                                    Metodo de Pago:
                                                </label>
                                                <select
                                                    id='lotPaymentTypeId'
                                                    className='form-select'
                                                    value={selectedPaymentTypeId}
                                                    onChange={(e) => {
                                                        setSelectedPaymentTypeId(e.target.value);
                                                        setLotError('');
                                                    }}
                                                    disabled={isSavingLot || loadingPaymentTypes}
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
                                                <label htmlFor='lotPaymentAmount' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                                    Monto del Pago:
                                                </label>
                                                <input
                                                    id='lotPaymentAmount'
                                                    type='number'
                                                    className='form-control'
                                                    placeholder='0.00'
                                                    value={paymentAmount}
                                                    onChange={handlePaymentAmountChange}
                                                    step='0.01'
                                                    min='0.01'
                                                    disabled={isSavingLot || loadingPaymentTypes}
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
                                                    disabled={isSavingLot || loadingPaymentTypes}
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
                                                                        disabled={isSavingLot}
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

                                    {lotError && <div className='alert alert-danger mb-0'>{lotError}</div>}
                                </div>

                                <div className='modal-footer'>
                                    <button
                                        type='submit'
                                        className='btn'
                                        disabled={isSavingLot || loadingPaymentTypes || !canSaveLot}
                                        style={{
                                            backgroundColor: canSaveLot ? PRIMARY_COLOR : '#E0E0E0',
                                            color: TEXT_COLOR,
                                            fontWeight: '600'
                                        }}
                                    >
                                        {isSavingLot ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            <><FaSave className='me-2' /> Guardar Lot</>
                                        )}
                                    </button>
                                    <button
                                        type='button'
                                        className='btn btn-secondary'
                                        onClick={cerrarAgregarLot}
                                        disabled={isSavingLot}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListarProductosComponent;
