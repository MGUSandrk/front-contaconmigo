import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PAYMENT_TYPE_BASE_REST_API_URL = API_BASE_URL + '/payment-types';

class PaymentTypeServicio {

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (token) {
            return {
                headers: {
                    'Authorization': token
                }
            };
        }
        return {};
    }

    listarTiposPago() {
        return axios.get(PAYMENT_TYPE_BASE_REST_API_URL, this.getAuthHeaders());
    }

    crearTipoPago(paymentType) {
        return axios.post(PAYMENT_TYPE_BASE_REST_API_URL + '/create', paymentType, this.getAuthHeaders());
    }

    getTipoPagoById(paymentTypeId) {
        return axios.get(PAYMENT_TYPE_BASE_REST_API_URL + '/' + paymentTypeId, this.getAuthHeaders());
    }

    modificarTipoPago(paymentTypeId, paymentType) {
        return axios.put(PAYMENT_TYPE_BASE_REST_API_URL + '/' + paymentTypeId, paymentType, this.getAuthHeaders());
    }

    deleteTipoPago(paymentTypeId) {
        return axios.delete(PAYMENT_TYPE_BASE_REST_API_URL + '/' + paymentTypeId, this.getAuthHeaders());
    }

}

const paymentTypeServicio = new PaymentTypeServicio();

export default paymentTypeServicio;
