import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const USUARIO_BASE_REST_API_URL = '${API_BASE_URL}/login';

class LoginServicio {

    authUsuario(usuario) {
        return axios.post(USUARIO_BASE_REST_API_URL, usuario);
    }

}

export default new LoginServicio();
