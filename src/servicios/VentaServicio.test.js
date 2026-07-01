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
