import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const VENTA_BASE_REST_API_URL = API_BASE_URL + '/sales';

class VentaServicio {

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

    crearVenta(sale) {
        return axios.post(VENTA_BASE_REST_API_URL + '/create', sale, this.getAuthHeaders());
    }

    listarVentas() {
        return axios.get(VENTA_BASE_REST_API_URL, this.getAuthHeaders());
    }

}

const ventaServicio = new VentaServicio();

export default ventaServicio;
