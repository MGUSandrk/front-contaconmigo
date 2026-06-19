import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PRODUCTO_BASE_REST_API_URL = API_BASE_URL + '/products';

class ProductoServicio {

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

    listarProductos() {
        return axios.get(PRODUCTO_BASE_REST_API_URL, this.getAuthHeaders());
    }

    crearProducto(product) {
        return axios.post(PRODUCTO_BASE_REST_API_URL + '/create', product, this.getAuthHeaders());
    }

    deleteProducto(productId) {
        return axios.delete(PRODUCTO_BASE_REST_API_URL + '/' + productId, this.getAuthHeaders());
    }

}

const productoServicio = new ProductoServicio();

export default productoServicio;
