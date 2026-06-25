import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSave, FaTimesCircle, FaUserPlus } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import ClienteServicio from '../../servicios/ClienteServicio';
import { DOCUMENT_TYPES, VAT_CONDITIONS, isFiscalDataRequired } from '../../utiles/fiscalOptions';

const PRIMARY_COLOR = '#A8DADC';
const TEXT_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#F8F9FA';
const CARD_COLOR = '#FFFFFF';

const AddClienteComponent = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [cuit, setCuit] = useState('');
    const [vatCondition, setVatCondition] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [commercialAddress, setCommercialAddress] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();
    const fiscalDataRequired = isFiscalDataRequired(vatCondition);

    const optionalText = (value) => {
        const normalizedValue = value.trim();
        return normalizedValue ? normalizedValue : null;
    };

    const guardarCliente = async (e) => {
        e.preventDefault();
        setError('');

        if (!fullName.trim()) {
            setError('El nombre completo es obligatorio.');
            return;
        }

        if (!email.trim()) {
            setError('El email es obligatorio.');
            return;
        }

        if (!vatCondition) {
            setError('Debe seleccionar la condicion frente al IVA.');
            return;
        }

        if (fiscalDataRequired) {
            if (!documentType) {
                setError('Debe seleccionar el tipo de documento.');
                return;
            }

            if (!documentNumber.trim()) {
                setError('El numero de documento es obligatorio.');
                return;
            }

            if (!commercialAddress.trim()) {
                setError('El domicilio comercial es obligatorio.');
                return;
            }
        }

        const client = {
            fullName: fullName.trim(),
            email: email.trim(),
            cuit: cuit.trim(),
            vatCondition,
            documentType: documentType || null,
            documentNumber: optionalText(documentNumber),
            commercialAddress: optionalText(commercialAddress),
        };

        setIsSaving(true);

        try {
            await ClienteServicio.crearCliente(client);
            navigate('/clientes');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Ocurrio un error al guardar el cliente.');
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
                            <FaUserPlus size={28} className='me-3' />
                            <h2 className='d-inline-block m-0' style={{ fontWeight: '700' }}>
                                Registro de Cliente
                            </h2>
                        </div>

                        <div className='card-body p-4 p-md-5'>
                            <form onSubmit={guardarCliente}>
                                <div className='form-group mb-4'>
                                    <label htmlFor='fullName' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Nombre Completo:
                                    </label>
                                    <input
                                        id='fullName'
                                        type='text'
                                        className='form-control form-control-lg'
                                        placeholder='Ej: Ana Perez'
                                        value={fullName}
                                        onChange={(e) => {
                                            setFullName(e.target.value);
                                            setError('');
                                        }}
                                        disabled={isSaving}
                                        required
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    />
                                </div>

                                <div className='form-group mb-4'>
                                    <label htmlFor='email' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Email:
                                    </label>
                                    <input
                                        id='email'
                                        type='email'
                                        className='form-control form-control-lg'
                                        placeholder='cliente@email.com'
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        disabled={isSaving}
                                        required
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    />
                                </div>

                                <div className='form-group mb-4'>
                                    <label htmlFor='cuit' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        CUIT:
                                    </label>
                                    <input
                                        id='cuit'
                                        type='text'
                                        className='form-control form-control-lg'
                                        placeholder='20-12345678-9'
                                        value={cuit}
                                        onChange={(e) => {
                                            setCuit(e.target.value);
                                            setError('');
                                        }}
                                        disabled={isSaving}
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    />
                                </div>

                                <div className='form-group mb-4'>
                                    <label htmlFor='vatCondition' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Condicion frente al IVA:
                                    </label>
                                    <select
                                        id='vatCondition'
                                        className='form-select form-select-lg'
                                        value={vatCondition}
                                        onChange={(e) => {
                                            setVatCondition(e.target.value);
                                            setError('');
                                        }}
                                        disabled={isSaving}
                                        required
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    >
                                        <option value=''>-- Seleccione una condicion --</option>
                                        {VAT_CONDITIONS.map((condition) => (
                                            <option key={condition.value} value={condition.value}>
                                                {condition.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='form-group mb-4'>
                                    <label htmlFor='documentType' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Tipo de Documento:
                                    </label>
                                    <select
                                        id='documentType'
                                        className='form-select form-select-lg'
                                        value={documentType}
                                        onChange={(e) => {
                                            setDocumentType(e.target.value);
                                            setError('');
                                        }}
                                        disabled={isSaving}
                                        required={fiscalDataRequired}
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    >
                                        <option value=''>-- Seleccione un tipo --</option>
                                        {DOCUMENT_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='form-group mb-4'>
                                    <label htmlFor='documentNumber' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Numero de Documento:
                                    </label>
                                    <input
                                        id='documentNumber'
                                        type='text'
                                        className='form-control form-control-lg'
                                        placeholder='30123456789'
                                        value={documentNumber}
                                        onChange={(e) => {
                                            setDocumentNumber(e.target.value);
                                            setError('');
                                        }}
                                        disabled={isSaving}
                                        required={fiscalDataRequired}
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    />
                                </div>

                                <div className='form-group mb-4'>
                                    <label htmlFor='commercialAddress' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Domicilio Comercial:
                                    </label>
                                    <input
                                        id='commercialAddress'
                                        type='text'
                                        className='form-control form-control-lg'
                                        placeholder='Calle 123'
                                        value={commercialAddress}
                                        onChange={(e) => {
                                            setCommercialAddress(e.target.value);
                                            setError('');
                                        }}
                                        disabled={isSaving}
                                        required={fiscalDataRequired}
                                        style={{ borderColor: PRIMARY_COLOR }}
                                    />
                                </div>

                                {error && <div className='alert alert-danger mt-4'>{error}</div>}

                                <div className='d-grid gap-2 d-md-flex justify-content-md-end mt-4 pt-3 border-top'>
                                    <button
                                        className='btn btn-lg me-md-2'
                                        type='submit'
                                        disabled={isSaving}
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
                                            <><FaSave className='me-2' /> Guardar Cliente</>
                                        )}
                                    </button>

                                    <Link
                                        to='/clientes'
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

export default AddClienteComponent;
