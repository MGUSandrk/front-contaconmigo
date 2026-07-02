import axios from 'axios';
import VentaServicio from './VentaServicio';

jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

beforeEach(() => {
    localStorage.clear();
    axios.get.mockReset();
});

test('listarVentas consulta sales con el token actual', () => {
    localStorage.setItem('token', 'Bearer test-token');
    axios.get.mockResolvedValue({ data: [] });

    VentaServicio.listarVentas();

    expect(axios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/sales`,
        {
            headers: {
                Authorization: 'Bearer test-token',
            },
        }
    );
});

test('obtenerFactura consulta el pdf de la venta como blob', () => {
    localStorage.setItem('token', 'Bearer test-token');
    axios.get.mockResolvedValue({ data: new Blob(['pdf'], { type: 'application/pdf' }) });

    VentaServicio.obtenerFactura(12);

    expect(axios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/sale/invoice/12`,
        {
            headers: {
                Authorization: 'Bearer test-token',
            },
            responseType: 'blob',
        }
    );
});

test('contarVentasDelMes consulta el contador mensual con el token actual', () => {
    localStorage.setItem('token', 'Bearer test-token');
    axios.get.mockResolvedValue({ data: { count: 12 } });

    VentaServicio.contarVentasDelMes();

    expect(axios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/sales/month/count`,
        {
            headers: {
                Authorization: 'Bearer test-token',
            },
        }
    );
});
