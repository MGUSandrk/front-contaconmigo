import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ENTITY_BASE_REST_API_URL = API_BASE_URL + '/entity';

class EntityServicio {

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

    obtenerEntidad() {
        return axios.get(ENTITY_BASE_REST_API_URL, this.getAuthHeaders());
    }

    modificarEntidad(entity) {
        return axios.put(ENTITY_BASE_REST_API_URL, entity, this.getAuthHeaders());
    }

}

const entityServicio = new EntityServicio();

export default entityServicio;
