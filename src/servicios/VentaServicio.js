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
        return axios.post(VENTA_BASE_REST_API_URL, sale, this.getAuthHeaders());
    }

    listarVentas() {
        return axios.get(VENTA_BASE_REST_API_URL, this.getAuthHeaders());
    }

    contarVentasDelMes() {
        return axios.get(VENTA_BASE_REST_API_URL + '/month/count', this.getAuthHeaders());
    }

    obtenerFactura(idVenta) {
        return axios.get(`${API_BASE_URL}/sale/invoice/${idVenta}`, {
            ...this.getAuthHeaders(),
            responseType: 'blob',
        });
    }

}

const ventaServicio = new VentaServicio();

export default ventaServicio;
