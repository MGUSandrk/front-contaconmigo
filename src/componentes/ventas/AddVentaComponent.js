import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaPlus, FaSave, FaShoppingCart, FaTimesCircle, FaTrash } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import ClienteServicio from '../../servicios/ClienteServicio';
import ProductoServicio from '../../servicios/ProductoServicio';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';
import VentaServicio from '../../servicios/VentaServicio';

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
        maximumFractionDigits: 2,
    });
};

const AddVentaComponent = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [clientSearch, setClientSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [productQuantity, setProductQuantity] = useState('1');
    const [saleProducts, setSaleProducts] = useState([]);
    const [selectedTypePaymentId, setSelectedTypePaymentId] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        setError('');

        Promise.all([
            ClienteServicio.listarClientes(),
            ProductoServicio.listarProductos(),
            PaymentTypeServicio.listarTiposPago(),
        ])
            .then(([clientsResponse, productsResponse, paymentTypesResponse]) => {
                setClients(clientsResponse.data || []);
                setProducts(productsResponse.data || []);
                setPaymentTypes(paymentTypesResponse.data || []);
            })
            .catch((err) => {
                console.error(err);
                setClients([]);
                setProducts([]);
                setPaymentTypes([]);
                setError(err.response?.data?.message || 'No se pudieron cargar los datos para registrar la venta.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const filteredClients = useMemo(() => {
        const search = clientSearch.trim().toLowerCase();
        if (!search) {
            return clients;
        }
        return clients.filter(client => (client.fullName || '').toLowerCase().includes(search));
    }, [clients, clientSearch]);

    const filteredProducts = useMemo(() => {
        const search = productSearch.trim().toLowerCase();
        const availableProducts = products.filter(product => {
            return !saleProducts.some(item => String(item.idProduct) === String(product.id));
        });

        if (!search) {
            return availableProducts;
        }

        return availableProducts.filter(product => (product.name || '').toLowerCase().includes(search));
    }, [products, productSearch, saleProducts]);

    const saleTotal = roundToCents(saleProducts.reduce((total, product) => {
        return total + ((parseFloat(product.salePrice) || 0) * (parseInt(product.quantity, 10) || 0));
    }, 0));

    const paymentsTotal = roundToCents(payments.reduce((total, payment) => {
        return total + (parseFloat(payment.amount) || 0);
    }, 0));

    const pendingTotal = roundToCents(saleTotal - paymentsTotal);
    const hasInvalidQuantity = saleProducts.some(product => {
        const quantity = parseInt(product.quantity, 10);
        return isNaN(quantity) || quantity <= 0;
    });
    const canSaveSale = selectedClientId && saleProducts.length > 0 && !hasInvalidQuantity && payments.length > 0 && saleTotal > 0 && pendingTotal === 0;

    const handleAddProduct = () => {
        if (!selectedProductId) {
            setError('Debe seleccionar un producto.');
            return;
        }

        const quantity = parseInt(productQuantity, 10);
        if (productQuantity === '' || isNaN(quantity) || quantity <= 0) {
            setError('La cantidad debe ser mayor a 0.');
            return;
        }

        if (saleProducts.some(product => String(product.idProduct) === String(selectedProductId))) {
            setError('Ese producto ya fue agregado.');
            return;
        }

        const selectedProduct = products.find(product => String(product.id) === String(selectedProductId));
        if (!selectedProduct) {
            setError('No se encontro el producto seleccionado.');
            return;
        }

        setSaleProducts([
            ...saleProducts,
            {
                idProduct: Number(selectedProduct.id),
                name: selectedProduct.name,
                salePrice: parseFloat(selectedProduct.salePrice) || 0,
                quantity,
            },
        ]);
        setSelectedProductId('');
        setProductQuantity('1');
        setError('');
    };

    const handleProductQuantityChange = (idProduct, value) => {
        const cleanValue = value.replace(/\D/g, '');
        setSaleProducts(saleProducts.map(product => {
            if (String(product.idProduct) !== String(idProduct)) {
                return product;
            }
            return {
                ...product,
                quantity: cleanValue,
            };
        }));
        setError('');
    };

    const handleRemoveProduct = (idProduct) => {
        setSaleProducts(saleProducts.filter(product => String(product.idProduct) !== String(idProduct)));
        setError('');
    };

    const handlePaymentAmountChange = (event) => {
        setPaymentAmount(normalizeNumberInput(event.target.value));
        setError('');
    };

    const handleAddPayment = () => {
        if (!selectedTypePaymentId) {
            setError('Debe seleccionar un metodo de pago.');
            return;
        }

        const parsedAmount = parseFloat(paymentAmount);
        if (paymentAmount === '' || isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('El monto del pago debe ser mayor a 0.');
            return;
        }

        if (payments.some(payment => String(payment.typePaymentId) === String(selectedTypePaymentId))) {
            setError('Ese metodo de pago ya fue agregado.');
            return;
        }

        const nextPaymentsTotal = roundToCents(paymentsTotal + parsedAmount);
        if (saleTotal > 0 && nextPaymentsTotal > saleTotal) {
            setError('La suma de pagos no puede superar el total de la venta.');
            return;
        }

        const selectedPaymentType = paymentTypes.find(paymentType => String(paymentType.id) === String(selectedTypePaymentId));

        setPayments([
            ...payments,
            {
                typePaymentId: Number(selectedTypePaymentId),
                type: selectedPaymentType?.type || `Metodo #${selectedTypePaymentId}`,
                amount: paymentAmount,
            },
        ]);
        setSelectedTypePaymentId('');
        setPaymentAmount('');
        setError('');
    };

    const handleRemovePayment = (typePaymentId) => {
        setPayments(payments.filter(payment => String(payment.typePaymentId) !== String(typePaymentId)));
        setError('');
    };

    const validateSale = () => {
        if (!selectedClientId) {
            return 'Debe seleccionar un cliente.';
        }

        if (saleProducts.length === 0) {
            return 'Debe agregar al menos un producto.';
        }

        if (hasInvalidQuantity) {
            return 'Todas las cantidades deben ser mayores a 0.';
        }

        if (payments.length === 0) {
            return 'Debe agregar al menos un pago.';
        }

        if (pendingTotal !== 0) {
            return 'La suma de los pagos debe coincidir con el total de la venta.';
        }

        return '';
    };

    const guardarVenta = async (event) => {
        event.preventDefault();
        setError('');

        const validationError = validateSale();
        if (validationError) {
            setError(validationError);
            return;
        }

        const sale = {
            idClient: Number(selectedClientId),
            products: saleProducts.map(product => ({
                idProduct: Number(product.idProduct),
                quantity: Number(product.quantity),
            })),
            payments: payments.map(payment => ({
                id: Number(payment.typePaymentId),
                amount: Number(payment.amount),
            })),
        };

        setIsSaving(true);

        try {
            await VentaServicio.crearVenta(sale);
            navigate('/inicio');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Ocurrio un error al guardar la venta.');
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
                            <FaShoppingCart size={28} className='me-3' />
                            <h2 className='d-inline-block m-0' style={{ fontWeight: '700' }}>
                                Registro de Venta
                            </h2>
                        </div>

                        <div className='card-body p-4 p-md-5'>
                            <form onSubmit={guardarVenta}>
                                <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Cliente</h4>

                                <div className='row mb-4'>
                                    <div className='form-group col-md-5 mb-3 mb-md-0'>
                                        <label htmlFor='clientSearch' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                            Buscar Cliente:
                                        </label>
                                        <input
                                            id='clientSearch'
                                            type='text'
                                            className='form-control'
                                            placeholder='Buscar por nombre'
                                            value={clientSearch}
                                            onChange={(event) => setClientSearch(event.target.value)}
                                            disabled={isSaving || isLoading}
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                    </div>
                                    <div className='form-group col-md-7'>
                                        <label htmlFor='clientId' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                            Cliente:
                                        </label>
                                        <select
                                            id='clientId'
                                            className='form-select'
                                            value={selectedClientId}
                                            onChange={(event) => {
                                                setSelectedClientId(event.target.value);
                                                setError('');
                                            }}
                                            disabled={isSaving || isLoading}
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        >
                                            <option value=''>{isLoading ? 'Cargando clientes...' : '-- Seleccione un cliente --'}</option>
                                            {filteredClients.map(client => (
                                                <option key={client.id} value={client.id}>
                                                    {client.fullName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Productos</h4>

                                <div className='row g-3 align-items-end mb-3'>
                                    <div className='form-group col-md-4'>
                                        <label htmlFor='productSearch' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                            Buscar Producto:
                                        </label>
                                        <input
                                            id='productSearch'
                                            type='text'
                                            className='form-control'
                                            placeholder='Buscar por nombre'
                                            value={productSearch}
                                            onChange={(event) => setProductSearch(event.target.value)}
                                            disabled={isSaving || isLoading}
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                    </div>
                                    <div className='form-group col-md-4'>
                                        <label htmlFor='productId' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                            Producto:
                                        </label>
                                        <select
                                            id='productId'
                                            className='form-select'
                                            value={selectedProductId}
                                            onChange={(event) => {
                                                setSelectedProductId(event.target.value);
                                                setError('');
                                            }}
                                            disabled={isSaving || isLoading}
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        >
                                            <option value=''>{isLoading ? 'Cargando productos...' : '-- Seleccione un producto --'}</option>
                                            {filteredProducts.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} - {formatCurrency(product.salePrice)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='form-group col-md-2'>
                                        <label htmlFor='productQuantity' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                            Cantidad:
                                        </label>
                                        <input
                                            id='productQuantity'
                                            type='number'
                                            className='form-control'
                                            min='1'
                                            value={productQuantity}
                                            onChange={(event) => {
                                                setProductQuantity(event.target.value.replace(/\D/g, ''));
                                                setError('');
                                            }}
                                            disabled={isSaving || isLoading}
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                    </div>
                                    <div className='col-md-2'>
                                        <button
                                            type='button'
                                            className='btn btn-outline-secondary w-100'
                                            onClick={handleAddProduct}
                                            disabled={isSaving || isLoading}
                                        >
                                            <FaPlus className='me-2' /> Agregar Producto
                                        </button>
                                    </div>
                                </div>

                                {saleProducts.length > 0 && (
                                    <div className='table-responsive mb-4' style={{ border: '1px solid #E0E0E0', borderRadius: '8px' }}>
                                        <table className='table table-hover mb-0'>
                                            <thead style={{ backgroundColor: '#F0F0F0' }}>
                                                <tr>
                                                    <th style={{ width: '35%', color: TEXT_COLOR }}>Producto</th>
                                                    <th className='text-end' style={{ width: '20%', color: TEXT_COLOR }}>Precio</th>
                                                    <th className='text-center' style={{ width: '20%', color: TEXT_COLOR }}>Cantidad</th>
                                                    <th className='text-end' style={{ width: '20%', color: TEXT_COLOR }}>Subtotal</th>
                                                    <th style={{ width: '5%' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {saleProducts.map(product => (
                                                    <tr key={product.idProduct}>
                                                        <td>{product.name}</td>
                                                        <td className='text-end'>{formatCurrency(product.salePrice)}</td>
                                                        <td>
                                                            <label className='visually-hidden' htmlFor={`quantity-${product.idProduct}`}>
                                                                Cantidad de {product.name}:
                                                            </label>
                                                            <input
                                                                id={`quantity-${product.idProduct}`}
                                                                type='number'
                                                                className='form-control text-center'
                                                                min='1'
                                                                value={product.quantity}
                                                                onChange={(event) => handleProductQuantityChange(product.idProduct, event.target.value)}
                                                                disabled={isSaving}
                                                            />
                                                        </td>
                                                        <td className='text-end'>
                                                            {formatCurrency((parseFloat(product.salePrice) || 0) * (parseInt(product.quantity, 10) || 0))}
                                                        </td>
                                                        <td className='text-center'>
                                                            <button
                                                                type='button'
                                                                className='btn btn-sm btn-outline-danger'
                                                                onClick={() => handleRemoveProduct(product.idProduct)}
                                                                disabled={isSaving}
                                                                title='Eliminar producto'
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

                                <div className='border-top pt-4 mb-4'>
                                    <h4 className='mb-3 d-flex align-items-center' style={{ color: TEXT_COLOR }}>
                                        <FaCreditCard className='me-2' /> Pagos de la Venta
                                    </h4>

                                    <div className='row g-3 align-items-end mb-3'>
                                        <div className='form-group col-md-5'>
                                            <label htmlFor='typePaymentId' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                                Metodo de Pago:
                                            </label>
                                            <select
                                                id='typePaymentId'
                                                className='form-select'
                                                value={selectedTypePaymentId}
                                                onChange={(event) => {
                                                    setSelectedTypePaymentId(event.target.value);
                                                    setError('');
                                                }}
                                                disabled={isSaving || isLoading}
                                                style={{ borderColor: PRIMARY_COLOR }}
                                            >
                                                <option value=''>{isLoading ? 'Cargando metodos...' : '-- Seleccione un metodo --'}</option>
                                                {paymentTypes
                                                    .filter(paymentType => !payments.some(payment => String(payment.typePaymentId) === String(paymentType.id)))
                                                    .map(paymentType => (
                                                        <option key={paymentType.id} value={paymentType.id}>
                                                            {paymentType.type}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className='form-group col-md-4'>
                                            <label htmlFor='paymentAmountSale' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                                Monto del Pago:
                                            </label>
                                            <input
                                                id='paymentAmountSale'
                                                type='number'
                                                className='form-control'
                                                placeholder='0.00'
                                                value={paymentAmount}
                                                onChange={handlePaymentAmountChange}
                                                step='0.01'
                                                min='0.01'
                                                disabled={isSaving || isLoading}
                                                style={{ borderColor: PRIMARY_COLOR }}
                                            />
                                        </div>

                                        <div className='col-md-3'>
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary w-100'
                                                onClick={handleAddPayment}
                                                disabled={isSaving || isLoading}
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
                                                        <tr key={payment.typePaymentId}>
                                                            <td>{payment.type}</td>
                                                            <td className='text-end'>{formatCurrency(parseFloat(payment.amount) || 0)}</td>
                                                            <td className='text-center'>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-sm btn-outline-danger'
                                                                    onClick={() => handleRemovePayment(payment.typePaymentId)}
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
                                                <div className='small text-muted'>Total venta</div>
                                                <strong style={{ color: TEXT_COLOR }}>{formatCurrency(saleTotal)}</strong>
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
                                        disabled={isSaving || isLoading || !canSaveSale}
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
                                            <><FaSave className='me-2' /> Guardar Venta</>
                                        )}
                                    </button>

                                    <Link
                                        to='/inicio'
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

export default AddVentaComponent;
