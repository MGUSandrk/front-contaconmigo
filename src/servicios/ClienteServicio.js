import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const CLIENTE_BASE_REST_API_URL = API_BASE_URL + '/clients';

class ClienteServicio {

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

    listarClientes() {
        return axios.get(CLIENTE_BASE_REST_API_URL, this.getAuthHeaders());
    }

    crearCliente(client) {
        return axios.post(CLIENTE_BASE_REST_API_URL + '/create', client, this.getAuthHeaders());
    }

    getClienteById(clientId) {
        return axios.get(CLIENTE_BASE_REST_API_URL + '/' + clientId, this.getAuthHeaders());
    }

    modificarCliente(clientId, client) {
        return axios.put(CLIENTE_BASE_REST_API_URL + '/' + clientId, client, this.getAuthHeaders());
    }

    deleteCliente(clientId) {
        return axios.delete(CLIENTE_BASE_REST_API_URL + '/' + clientId, this.getAuthHeaders());
    }

}

const clienteServicio = new ClienteServicio();

export default clienteServicio;
