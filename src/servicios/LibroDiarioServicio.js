import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const LIBRO_DIARIO_BASE_REST_API_URL = API_BASE_URL+"/journal";

class LibroDiarioServicio {

    // Función de flecha para mantener el contexto 'this'
    getAuthHeaders = () => {
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

    // Función de flecha para mantener el contexto 'this'
    getLastAsientos = () => {
        // 'this' ahora apunta correctamente a la instancia
        return axios.get(LIBRO_DIARIO_BASE_REST_API_URL, this.getAuthHeaders());
    }

    // Función de flecha para mantener el contexto 'this'
    getAsientosPorPeriodo = (desde, hasta) => {
        // 'this' ahora apunta correctamente a la instancia
        console.log(LIBRO_DIARIO_BASE_REST_API_URL + "/between?before=" + desde + "&after=" + hasta)
        return axios.get(LIBRO_DIARIO_BASE_REST_API_URL + "/between?before=" + desde + "&after=" + hasta, this.getAuthHeaders());
    }

}

export default new LibroDiarioServicio();
