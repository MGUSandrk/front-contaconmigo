import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const ASIENTO_BASE_REST_API_URL = API_BASE_URL+"/entry';

class AsientoServicio {

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

    crearAsiento(entry) {
        return axios.post(ASIENTO_BASE_REST_API_URL + '/create', entry, this.getAuthHeaders());
    }

}

export default new AsientoServicio();
