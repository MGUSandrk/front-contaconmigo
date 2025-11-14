import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
const LIBRO_MAYOR_BASE_REST_API_URL = API_BASE_URL+"/ledger";

class LibroMayorServicio {

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (token) {
            return {
                headers: {
                    'Authorization': token
                }
            };
        }
        return {}; // Devuelve un objeto vacío si no hay token
    }

    //Libro Mayor
    getMovimientosPorCuentaYPeriodo(cuentaId, desde, hasta) {
        return axios.get(LIBRO_MAYOR_BASE_REST_API_URL+ "/" + cuentaId + "?before=" + desde + "&after=" + hasta, this.getAuthHeaders());
    }

}

export default new LibroMayorServicio();
