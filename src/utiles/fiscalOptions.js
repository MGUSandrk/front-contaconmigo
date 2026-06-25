export const CONSUMIDOR_FINAL = 'CONSUMIDOR_FINAL';

export const VAT_CONDITIONS = [
    { value: 'IVA_RESPONSABLE_INSCRIPTO', label: 'Responsable Inscripto' },
    { value: 'IVA_EXENTO', label: 'IVA Exento' },
    { value: 'NO_RESPONSABLE_IVA', label: 'No Responsable IVA' },
    { value: 'RESPONSABLE_MONOTRIBUTO', label: 'Responsable Monotributo' },
    { value: 'MONOTRIBUTO_TRABAJADOR_INDEPENDIENTE_PROMOVIDO', label: 'Monotributo Trabajador Independiente Promovido' },
    { value: 'MONOTRIBUTISTA_SOCIAL', label: 'Monotributista Social' },
    { value: CONSUMIDOR_FINAL, label: 'Consumidor Final' },
];

export const DOCUMENT_TYPES = [
    { value: 'CUIT', label: 'CUIT' },
    { value: 'CUIL', label: 'CUIL' },
    { value: 'DNI', label: 'DNI' },
    { value: 'CDI', label: 'CDI' },
];

export const isFiscalDataRequired = (vatCondition) => Boolean(vatCondition && vatCondition !== CONSUMIDOR_FINAL);

export const getVatConditionLabel = (value) => {
    return VAT_CONDITIONS.find((condition) => condition.value === value)?.label || value || '-';
};

export const getDocumentTypeLabel = (value) => {
    return DOCUMENT_TYPES.find((documentType) => documentType.value === value)?.label || value || '';
};
