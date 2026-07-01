import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaSpinner, FaUserTie } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import ClienteServicio from '../../servicios/ClienteServicio';
import { getRoleFromToken } from '../../utiles/authUtils';
import { getDocumentTypeLabel, getVatConditionLabel } from '../../utiles/fiscalOptions';

const PRIMARY_COLOR = '#A8DADC';
const TEXT_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#F8F9FA';
const CARD_COLOR = '#FFFFFF';

const ListarClientesComponent = () => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const userRole = getRoleFromToken();
    const canCreateClient = userRole === 'ADMIN' || userRole === 'SELLER';

    const formatEmpty = (value) => value || '-';

    const formatDocument = (client) => {
        if (!client.documentType || !client.documentNumber) {
            return '-';
        }

        return `${getDocumentTypeLabel(client.documentType)} ${client.documentNumber}`;
    };

    useEffect(() => {
        setCargando(true);
        setError('');

        ClienteServicio.listarClientes()
            .then((response) => {
                setClientes(response.data || []);
            })
            .catch((err) => {
                console.error(err);
                setClientes([]);
                setError(err.response?.data?.message || 'Error al cargar la lista de clientes.');
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

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
                                <FaUserTie size={28} className='me-3' />
                                Clientes
                            </h2>
                            {canCreateClient && (
                                <Link to='/add-cliente' className='btn btn-success d-flex align-items-center' style={{ fontWeight: '600' }}>
                                    <FaPlusCircle className='me-2' /> Agregar Cliente
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
                                    <p className='ms-3 pt-1' style={{ color: TEXT_COLOR }}>Cargando clientes...</p>
                                </div>
                            ) : clientes.length > 0 ? (
                                <div className='table-responsive'>
                                    <table className='table table-bordered table-striped table-hover' style={{ fontSize: '0.95rem' }}>
                                        <thead style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR }}>
                                            <tr>
                                                <th>Nombre Completo</th>
                                                <th>Email</th>
                                                <th>Condicion IVA</th>
                                                <th>Documento</th>
                                                <th>CUIT</th>
                                                <th>Domicilio Comercial</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientes.map(client => (
                                                <tr key={client.id || client.cuit || client.email}>
                                                    <td>{formatEmpty(client.fullName)}</td>
                                                    <td>{formatEmpty(client.email)}</td>
                                                    <td>{getVatConditionLabel(client.vatCondition)}</td>
                                                    <td>{formatDocument(client)}</td>
                                                    <td>{formatEmpty(client.cuit)}</td>
                                                    <td>{formatEmpty(client.commercialAddress)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className='alert alert-info mt-3' role='alert'>
                                    No hay clientes registrados.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListarClientesComponent;
