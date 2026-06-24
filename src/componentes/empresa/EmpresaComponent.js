import React, { useEffect, useState } from 'react';
import { LuBuilding } from 'react-icons/lu';
import { FaBuilding, FaSave } from 'react-icons/fa';
import SideBarComponent from '../dashboard/SideBarComponent';
import EntityServicio from '../../servicios/EntityServicio';

const PRIMARY_COLOR = '#A8DADC';
const TEXT_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#F8F9FA';
const CARD_COLOR = '#FFFFFF';

const COSTING_METHODS = [
    'FIFO',
    'LIFO',
    'WAC',
];

const EmpresaComponent = () => {
    const [name, setName] = useState('');
    const [costingMethod, setCostingMethod] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setCargando(true);
        setError('');

        EntityServicio.obtenerEntidad()
            .then((response) => {
                const entity = response.data || {};
                setName(entity.name || '');
                setCostingMethod(entity.costingMethod || '');
            })
            .catch((err) => {
                console.error(err);
                setError(err.response?.data?.message || 'Ocurrio un error al cargar los datos de la empresa.');
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    const guardarEmpresa = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!name.trim()) {
            setError('El nombre de la empresa es obligatorio.');
            return;
        }

        if (!costingMethod) {
            setError('Debe seleccionar un metodo de costeo.');
            return;
        }

        setIsSaving(true);

        try {
            await EntityServicio.modificarEntidad({
                name: name.trim(),
                costingMethod,
            });
            setSuccess('Datos de empresa actualizados correctamente.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Ocurrio un error al guardar los datos de la empresa.');
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
                        <div className='card-header d-flex flex-column flex-md-row align-items-center justify-content-between'
                             style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR, borderTopLeftRadius: '15px', borderTopRightRadius: '15px', padding: '1.5rem' }}>
                            <div className='d-flex align-items-center'>
                                <div
                                    className='d-flex align-items-center justify-content-center me-3'
                                    style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: CARD_COLOR }}
                                    aria-hidden='true'
                                >
                                    <LuBuilding size={26} color={TEXT_COLOR} />
                                </div>
                                <h2 className='m-0' style={{ fontWeight: '700' }}>
                                    Empresa
                                </h2>
                            </div>
                        </div>

                        <div className='card-body p-4 p-md-5'>
                            {cargando && (
                                <div className='alert alert-info mb-4'>Cargando datos de empresa...</div>
                            )}

                            {error && (
                                <div className='alert alert-danger mb-4'>{error}</div>
                            )}

                            {success && (
                                <div className='alert alert-success mb-4'>{success}</div>
                            )}

                            <form onSubmit={guardarEmpresa}>
                                <div className='form-group mb-4'>
                                    <label htmlFor='entityName' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Nombre de la Empresa:
                                    </label>
                                    <input
                                        id='entityName'
                                        type='text'
                                        className='form-control'
                                        value={name}
                                        onChange={(event) => {
                                            setName(event.target.value);
                                            setError('');
                                            setSuccess('');
                                        }}
                                        disabled={cargando || isSaving}
                                    />
                                </div>

                                <div className='form-group mb-4'>
                                    <label htmlFor='costingMethod' className='form-label' style={{ fontWeight: '600', color: TEXT_COLOR }}>
                                        Metodo de Costeo:
                                    </label>
                                    <select
                                        id='costingMethod'
                                        className='form-select'
                                        value={costingMethod}
                                        onChange={(event) => {
                                            setCostingMethod(event.target.value);
                                            setError('');
                                            setSuccess('');
                                        }}
                                        disabled={cargando || isSaving}
                                    >
                                        <option value=''>-- Seleccione un metodo --</option>
                                        {COSTING_METHODS.map((method) => (
                                            <option key={method} value={method}>
                                                {method}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='d-flex justify-content-end'>
                                    <button
                                        type='submit'
                                        className='btn d-flex align-items-center'
                                        style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR, fontWeight: '600' }}
                                        disabled={cargando || isSaving}
                                    >
                                        <FaSave className='me-2' />
                                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpresaComponent;
