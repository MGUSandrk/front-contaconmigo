import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaPlus, FaSave, FaShoppingCart, FaTimesCircle, FaTrash, FaCartPlus, FaUserPlus } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import ClienteServicio from '../../servicios/ClienteServicio';
import ProductoServicio from '../../servicios/ProductoServicio';
import PaymentTypeServicio from '../../servicios/PaymentTypeServicio';
import VentaServicio from '../../servicios/VentaServicio';
// Importación necesaria para el modal de clientes
import { DOCUMENT_TYPES, VAT_CONDITIONS, isFiscalDataRequired } from '../../utiles/fiscalOptions';

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
    
    // Autocomplete Clientes
    const [clientSearch, setClientSearch] = useState('');
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState('');
    
    // Autocomplete Productos
    const [productSearch, setProductSearch] = useState('');
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    
    const [productQuantity, setProductQuantity] = useState('1');
    const [saleProducts, setSaleProducts] = useState([]);
    
    const [selectedTypePaymentId, setSelectedTypePaymentId] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [payments, setPayments] = useState([]);
    
    // Descuento en Porcentaje (0 a 100)
    const [discountPercentage, setDiscountPercentage] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // --- ESTADOS PARA MODAL DE NUEVO CLIENTE ---
    const [showClientModal, setShowClientModal] = useState(false);
    const [newClient, setNewClient] = useState({
        fullName: '', email: '', cuit: '', vatCondition: '', documentType: '', documentNumber: '', commercialAddress: ''
    });
    const [isSavingClient, setIsSavingClient] = useState(false);
    const [clientError, setClientError] = useState('');
    const fiscalDataRequired = isFiscalDataRequired(newClient.vatCondition);

    useEffect(() => {
        setIsLoading(true);
        setError('');

        Promise.all([
            ClienteServicio.listarClientes(),
            ProductoServicio.listarProductosConStock(),
            PaymentTypeServicio.listarTiposPago(),
        ])
            .then(([clientsResponse, productsResponse, paymentTypesResponse]) => {
                setClients(clientsResponse.data || []);
                setProducts(productsResponse.data || []);
                setPaymentTypes(paymentTypesResponse.data || []);
            })
            .catch((err) => {
                console.error(err);
                setError(err.response?.data?.message || 'No se pudieron cargar los datos.');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const filteredClients = useMemo(() => {
        // Agregamos (clientSearch || '') para que si alguna vez es undefined, no falle el trim()
        const search = (clientSearch || '').toString().trim().toLowerCase();
        if (!search) return clients;
        return clients.filter(client => (client.fullName || '').toLowerCase().includes(search));
    }, [clients, clientSearch]);

    const filteredProducts = useMemo(() => {
        const search = productSearch.trim().toLowerCase();
        const availableProducts = products.filter(product => {
            return !saleProducts.some(item => String(item.idProduct) === String(product.id));
        });
        if (!search) return availableProducts;
        return availableProducts.filter(product => (product.name || '').toLowerCase().includes(search));
    }, [products, productSearch, saleProducts]);

    // LÓGICA DE TOTALES CON PORCENTAJE DE DESCUENTO
    const saleSubtotal = roundToCents(saleProducts.reduce((total, product) => {
        return total + ((parseFloat(product.salePrice) || 0) * (parseInt(product.quantity, 10) || 0));
    }, 0));
    
    const parsedDiscountPercentage = parseInt(discountPercentage, 10) || 0;
    const discountAmount = roundToCents(saleSubtotal * (parsedDiscountPercentage / 100));
    const saleTotal = roundToCents(saleSubtotal - discountAmount);

    const paymentsTotal = roundToCents(payments.reduce((total, payment) => {
        return total + (parseFloat(payment.amount) || 0);
    }, 0));
    
    const pendingTotal = roundToCents(saleTotal - paymentsTotal);
    
    const hasInvalidQuantity = saleProducts.some(product => {
        const quantity = parseInt(product.quantity, 10);
        return isNaN(quantity) || quantity <= 0;
    });

    const canSaveSale = selectedClientId && saleProducts.length > 0 && !hasInvalidQuantity && payments.length > 0 && saleTotal >= 0 && pendingTotal === 0;

    // Handlers Venta
    const handleAddProduct = () => {
        if (!selectedProductId) return setError('Debe seleccionar un producto.');
        const quantity = parseInt(productQuantity, 10);
        if (productQuantity === '' || isNaN(quantity) || quantity <= 0) return setError('La cantidad debe ser mayor a 0.');

        const selectedProduct = products.find(product => String(product.id) === String(selectedProductId));
        if (!selectedProduct) return setError('No se encontro el producto seleccionado.');

        setSaleProducts([...saleProducts, {
            idProduct: Number(selectedProduct.id),
            name: selectedProduct.name,
            salePrice: parseFloat(selectedProduct.salePrice) || 0,
            quantity,
        }]);
        setSelectedProductId('');
        setProductSearch(''); 
        setProductQuantity('1');
        setError('');
    };

    const handleProductQuantityChange = (idProduct, value) => {
        const cleanValue = value.replace(/\D/g, '');
        setSaleProducts(saleProducts.map(product => {
            if (String(product.idProduct) !== String(idProduct)) return product;
            return { ...product, quantity: cleanValue };
        }));
    };

    const handleRemoveProduct = (idProduct) => setSaleProducts(saleProducts.filter(p => String(p.idProduct) !== String(idProduct)));
    
    const handleAddPayment = () => {
        if (!selectedTypePaymentId) return setError('Debe seleccionar un metodo de pago.');
        const parsedAmount = parseFloat(paymentAmount);
        if (paymentAmount === '' || isNaN(parsedAmount) || parsedAmount <= 0) return setError('El monto del pago debe ser mayor a 0.');
        
        if (payments.some(payment => String(payment.typePaymentId) === String(selectedTypePaymentId))) {
            return setError('Ese metodo de pago ya fue agregado.');
        }

        const nextPaymentsTotal = roundToCents(paymentsTotal + parsedAmount);
        if (saleTotal > 0 && nextPaymentsTotal > saleTotal) return setError('La suma de pagos no puede superar el total de la venta.');

        const selectedPaymentType = paymentTypes.find(pt => String(pt.id) === String(selectedTypePaymentId));
        setPayments([...payments, {
            typePaymentId: Number(selectedTypePaymentId),
            type: selectedPaymentType?.type || `Metodo #${selectedTypePaymentId}`,
            amount: paymentAmount,
        }]);
        setSelectedTypePaymentId('');
        setPaymentAmount('');
        setError('');
    };

    const handleRemovePayment = (typePaymentId) => setPayments(payments.filter(p => String(p.typePaymentId) !== String(typePaymentId)));

    const guardarVenta = async (event) => {
        event.preventDefault();
        setError('');

        if (parsedDiscountPercentage > 100 || parsedDiscountPercentage < 0) return setError('El descuento debe ser un porcentaje entre 0 y 100.');
        if (pendingTotal !== 0) return setError('La suma de los pagos debe coincidir con el total de la venta.');

        // ESTRUCTURA DEL BODY ACTUALIZADA
        const sale = {
            clientId: Number(selectedClientId),
            items: saleProducts.map(product => ({
                productId: Number(product.idProduct),
                quantity: Number(product.quantity),
            })),
            paymentMethod: payments[0].type, // Momentáneo hasta que el backend pueda recibir el array de metodos de pago
            // payments: payments.map(payment => ({
            //     id: Number(payment.typePaymentId),
            //     amount: Number(payment.amount),
            // })),
            installments: 1, 
            discount: parsedDiscountPercentage
        };
        
        setIsSaving(true);
        try {
            await VentaServicio.crearVenta(sale);
            navigate('/inicio');
        } catch (err) {
            setError(err.response?.data?.message || 'Ocurrio un error al guardar la venta.');
        } finally {
            setIsSaving(false);
        }
    };

    // Handler Guardar Cliente desde Modal
    const handleGuardarNuevoCliente = async (e) => {
        e.preventDefault();
        setClientError('');

        // Validaciones básicas del cliente
        if (!newClient.fullName.trim() || !newClient.email.trim() || !newClient.vatCondition) {
            return setClientError('Complete los campos obligatorios del cliente.');
        }

        const optionalText = (value) => value.trim() ? value.trim() : null;
        const clientData = {
            fullName: newClient.fullName.trim(),
            email: newClient.email.trim(),
            cuit: newClient.cuit.trim(),
            vatCondition: newClient.vatCondition,
            documentType: newClient.documentType || null,
            documentNumber: optionalText(newClient.documentNumber),
            commercialAddress: optionalText(newClient.commercialAddress),
        };

        setIsSavingClient(true);
        try {
            const resp = await ClienteServicio.crearCliente(clientData);
            
            // Volvemos a pedir la lista de clientes para asegurarnos de tener los datos reales y el ID generado
            const clientsResponse = await ClienteServicio.listarClientes();
            const clientesActualizados = clientsResponse.data || [];
            setClients(clientesActualizados);

            // Intentamos obtener el ID del cliente recién creado (ya sea de la respuesta o buscándolo en la nueva lista)
            const idCreado = resp.data?.id || clientesActualizados.find(c => c.email === clientData.email)?.id;

            if (idCreado) {
                setSelectedClientId(idCreado);
            }
            // Usamos newClient.fullName (que sabemos que tiene texto) en lugar de depender de la respuesta del backend
            setClientSearch(clientData.fullName); 
            
            setShowClientModal(false);
            setNewClient({ fullName: '', email: '', cuit: '', vatCondition: '', documentType: '', documentNumber: '', commercialAddress: '' });
        } catch (err) {
            setClientError(err.response?.data?.message || 'Error al guardar cliente.');
        } finally {
            setIsSavingClient(false);
        }
    };

    return (
        <div className='d-flex' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: 'var(--app-content-min-height)' }}>
            <SideBarComponent />

            <div className='flex-grow-1 p-0 p-md-5'>
                <div className='col-lg-10 offset-lg-1'>
                    <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
                        <div className='card-header text-center d-flex align-items-center justify-content-center' style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR, borderTopLeftRadius: '15px', borderTopRightRadius: '15px', padding: '1.5rem 0' }}>
                            <FaShoppingCart size={28} className='me-3' />
                            <h2 className='d-inline-block m-0' style={{ fontWeight: '700' }}>Registro de Venta</h2>
                        </div>

                        <div className='card-body p-4 p-md-5'>
                            <form onSubmit={guardarVenta}>
                                {/* CLIENTE Y PRODUCTOS OMITIDOS POR BREVEDAD (Se mantienen igual que en la respuesta anterior) */}
                                
                                {/* SECCIÓN CLIENTES CON AUTOCOMPLETE Y MODAL */}
                                <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Cliente</h4>
                                <div className='row mb-4 align-items-end'>
                                    <div className='form-group col-md-8 position-relative'>
                                        <label className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>Seleccionar Cliente:</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Escriba para buscar cliente...'
                                            value={clientSearch}
                                            onChange={(e) => {
                                                setClientSearch(e.target.value);
                                                setSelectedClientId('');
                                                setShowClientDropdown(true);
                                            }}
                                            onFocus={() => setShowClientDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                        {showClientDropdown && filteredClients.length > 0 && (
                                            <ul className='list-group position-absolute w-100' style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                                {filteredClients.map(client => (
                                                    <li key={client.id} className='list-group-item list-group-item-action' style={{ cursor: 'pointer' }}
                                                        onMouseDown={() => {
                                                            setSelectedClientId(client.id);
                                                            setClientSearch(client.fullName);
                                                            setShowClientDropdown(false);
                                                        }}>
                                                        {client.fullName}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className='col-md-4'>
                                        <button type='button' className='btn btn-outline-primary w-100' onClick={() => setShowClientModal(true)}>
                                            <FaUserPlus className='me-2' /> Nuevo Cliente
                                        </button>
                                    </div>
                                </div>

                                {/* SECCIÓN PRODUCTOS CON AUTOCOMPLETE */}
                                <h4 className='mb-3' style={{ color: TEXT_COLOR }}>Productos</h4>
                                <div className='row g-3 align-items-end mb-3'>
                                    <div className='form-group col-md-6 position-relative'>
                                        <label className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>Seleccionar Producto:</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Escriba para buscar producto...'
                                            value={productSearch}
                                            onChange={(e) => {
                                                setProductSearch(e.target.value);
                                                setSelectedProductId('');
                                                setShowProductDropdown(true);
                                            }}
                                            onFocus={() => setShowProductDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowProductDropdown(false), 200)}
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                        {showProductDropdown && filteredProducts.length > 0 && (
                                            <ul className='list-group position-absolute w-100' style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                                {filteredProducts.map(product => (
                                                    <li key={product.id} className='list-group-item list-group-item-action' style={{ cursor: 'pointer' }}
                                                        onMouseDown={() => {
                                                            setSelectedProductId(product.id);
                                                            setProductSearch(`${product.name} - ${formatCurrency(product.salePrice)}`);
                                                            setShowProductDropdown(false);
                                                        }}>
                                                        {product.name} - {formatCurrency(product.salePrice)}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className='form-group col-md-2'>
                                        <label className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>Cant:</label>
                                        <input type='number' className='form-control' min='1' value={productQuantity}
                                            onChange={(e) => setProductQuantity(e.target.value.replace(/\D/g, ''))}
                                            style={{ borderColor: PRIMARY_COLOR }}
                                        />
                                    </div>
                                    <div className='col-md-4'>
                                        <button type='button' className='btn btn-outline-secondary w-100' onClick={handleAddProduct}>
                                            <FaCartPlus className='me-2' /> Añadir a la Venta
                                        </button>
                                    </div>
                                </div>

                                {/* LISTADO DE PRODUCTOS */}
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
                                                            <input type='number' className='form-control text-center' min='1' value={product.quantity}
                                                                onChange={(e) => handleProductQuantityChange(product.idProduct, e.target.value)} disabled={isSaving}/>
                                                        </td>
                                                        <td className='text-end'>
                                                            {formatCurrency((parseFloat(product.salePrice) || 0) * (parseInt(product.quantity, 10) || 0))}
                                                        </td>
                                                        <td className='text-center'>
                                                            <button type='button' className='btn btn-sm btn-outline-danger' onClick={() => handleRemoveProduct(product.idProduct)}><FaTrash /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* SECCIÓN DESCUENTO Y PAGOS */}
                                <div className='border-top pt-4 mb-4'>
                                    <h4 className='mb-3 d-flex align-items-center' style={{ color: TEXT_COLOR }}>
                                        <FaCreditCard className='me-2' /> Pagos de la Venta
                                    </h4>

                                    {/* NUEVO INPUT DE DESCUENTO POR PORCENTAJE */}
                                    <div className='row g-3 align-items-end mb-3'>
                                        <div className='form-group col-md-4'>
                                            <label className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>Descuento (%):</label>
                                            <input type='number' className='form-control' placeholder='Ej: 20' value={discountPercentage}
                                                onChange={(e) => setDiscountPercentage(e.target.value.replace(/\D/g, ''))} // Solo números enteros
                                                step='1' min='0' max='100'
                                                style={{ borderColor: PRIMARY_COLOR }} />
                                        </div>
                                    </div>

                                    <div className='row g-3 align-items-end mb-3'>
                                        <div className='form-group col-md-4'>
                                            <label className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>Metodo de Pago:</label>
                                            <select className='form-select' value={selectedTypePaymentId} onChange={(e) => setSelectedTypePaymentId(e.target.value)} style={{ borderColor: PRIMARY_COLOR }}>
                                                <option value=''>-- Seleccione --</option>
                                                {paymentTypes.filter(pt => !payments.some(p => String(p.typePaymentId) === String(pt.id))).map(pt => (
                                                    <option key={pt.id} value={pt.id}>{pt.type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='form-group col-md-4'>
                                            <label className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>Monto a Pagar:</label>
                                            <input type='number' className='form-control' placeholder='0.00' value={paymentAmount}
                                                onChange={(e) => setPaymentAmount(normalizeNumberInput(e.target.value))} step='0.01' min='0.01' style={{ borderColor: PRIMARY_COLOR }} />
                                        </div>
                                        <div className='col-md-4'>
                                            <button type='button' className='btn btn-outline-secondary w-100' onClick={handleAddPayment}>
                                                <FaPlus className='me-2' /> Incluir método de pago
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
                                                                <button type='button' className='btn btn-sm btn-outline-danger' onClick={() => handleRemovePayment(payment.typePaymentId)}><FaTrash /></button>
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
                                                <div className='small text-muted'>Subtotal ({parsedDiscountPercentage}% desc.)</div>
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
                                    <button className='btn btn-lg me-md-2' type='submit' disabled={isSaving || !canSaveSale} style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR, fontWeight: '600' }}>
                                        {isSaving ? 'Guardando...' : <><FaSave className='me-2' /> Guardar Venta</>}
                                    </button>
                                    <Link to='/inicio' className='btn btn-secondary btn-lg'>
                                        <FaTimesCircle className='me-2' /> Cancelar
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL COMPLETO PARA CREAR CLIENTE */}
            {showClientModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" style={{ margin: '30px auto' }}>
                        <div className="modal-content" style={{ borderRadius: '15px' }}>
                            <div className="modal-header" style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR, borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                <h5 className="modal-title fw-bold"><FaUserPlus className='me-2' /> Registrar Cliente Rápido</h5>
                                <button type="button" className="btn-close" onClick={() => setShowClientModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form onSubmit={handleGuardarNuevoCliente}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" style={{ color: TEXT_COLOR }}>Nombre Completo:</label>
                                            <input type="text" className="form-control" placeholder='Ej: Ana Perez' required value={newClient.fullName} onChange={(e) => setNewClient({...newClient, fullName: e.target.value})} style={{ borderColor: PRIMARY_COLOR }} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" style={{ color: TEXT_COLOR }}>Email:</label>
                                            <input type="email" className="form-control" placeholder='cliente@email.com' required value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} style={{ borderColor: PRIMARY_COLOR }} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" style={{ color: TEXT_COLOR }}>CUIT:</label>
                                            <input type="text" className="form-control" placeholder='20-12345678-9' value={newClient.cuit} onChange={(e) => setNewClient({...newClient, cuit: e.target.value})} style={{ borderColor: PRIMARY_COLOR }} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" style={{ color: TEXT_COLOR }}>Condición frente al IVA:</label>
                                            <select className="form-select" required value={newClient.vatCondition} onChange={(e) => setNewClient({...newClient, vatCondition: e.target.value})} style={{ borderColor: PRIMARY_COLOR }}>
                                                <option value=''>-- Seleccione una condición --</option>
                                                {VAT_CONDITIONS && VAT_CONDITIONS.map((condition) => (
                                                    <option key={condition.value} value={condition.value}>{condition.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" style={{ color: TEXT_COLOR }}>Tipo de Documento:</label>
                                            <select className="form-select" required={fiscalDataRequired} value={newClient.documentType} onChange={(e) => setNewClient({...newClient, documentType: e.target.value})} style={{ borderColor: PRIMARY_COLOR }}>
                                                <option value=''>-- Seleccione un tipo --</option>
                                                {DOCUMENT_TYPES && DOCUMENT_TYPES.map((type) => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" style={{ color: TEXT_COLOR }}>Número de Documento:</label>
                                            <input type="text" className="form-control" placeholder='30123456789' required={fiscalDataRequired} value={newClient.documentNumber} onChange={(e) => setNewClient({...newClient, documentNumber: e.target.value})} style={{ borderColor: PRIMARY_COLOR }} />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label fw-bold" style={{ color: TEXT_COLOR }}>Domicilio Comercial:</label>
                                            <input type="text" className="form-control" placeholder='Calle 123' required={fiscalDataRequired} value={newClient.commercialAddress} onChange={(e) => setNewClient({...newClient, commercialAddress: e.target.value})} style={{ borderColor: PRIMARY_COLOR }} />
                                        </div>
                                    </div>

                                    {clientError && <div className='alert alert-danger'>{clientError}</div>}
                                    
                                    <div className="d-flex justify-content-end mt-3 border-top pt-3">
                                        <button type="button" className="btn btn-secondary me-2" onClick={() => setShowClientModal(false)}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn" style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR, fontWeight: 'bold' }} disabled={isSavingClient}>
                                            {isSavingClient ? 'Guardando...' : 'Guardar y Seleccionar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddVentaComponent;