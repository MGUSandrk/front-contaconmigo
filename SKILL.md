---
name: desarrollar-modulos-contaconmigo
description: Use when developing new frontend modules in the ContaConmigo React project, especially services with axios, protected routes, accounting views, forms, tables, sidebars, and UI consistent with the existing app.
---

# Desarrollar Modulos En ContaConmigo

Usar esta guia antes de crear o modificar modulos del frontend. El objetivo es mantener la misma arquitectura, flujo de datos, autenticacion y estilo visual que ya usa el proyecto.

## Contexto Del Proyecto

- App React con `react-router-dom`, `axios`, `react-icons`, Bootstrap por clases y estilos inline.
- Servicios HTTP en `src/servicios`.
- Pantallas y piezas visuales en `src/componentes`.
- Rutas en `src/App.js`.
- Autenticacion basada en token guardado en `localStorage`.
- Roles desde JWT con `getRoleFromToken` en `src/utiles/authUtils.js`.
- Rutas protegidas con `PrivateRouteInicio.js`.

## Patron De Servicio Axios

Crear un archivo por recurso en `src/servicios`, con nombre `RecursoServicio.js`.

Seguir este formato:

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const RECURSO_BASE_REST_API_URL = API_BASE_URL + '/resource';

class RecursoServicio {
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

    listarRecursos() {
        return axios.get(RECURSO_BASE_REST_API_URL, this.getAuthHeaders());
    }

    crearRecurso(recurso) {
        return axios.post(RECURSO_BASE_REST_API_URL + '/create', recurso, this.getAuthHeaders());
    }
}

export default new RecursoServicio();
```

Preferir:

- Leer la base del backend desde `process.env.REACT_APP_API_BASE_URL`.
- Exportar una instancia: `export default new NombreServicio();`.
- Devolver directamente la promesa de axios y manejar `.then/.catch` o `async/await` en el componente.
- Usar `getAuthHeaders()` dentro de cada metodo protegido para tomar el token actualizado.
- Usar funciones flecha en metodos que se pasen como callback, por ejemplo `desactivarCuenta = (id) => { ... }`, para no perder el contexto de `this`.
- Para query params nuevos, preferir `config.params` cuando sea claro:

```javascript
const config = this.getAuthHeaders();
config.params = { id };
return axios.post(URL, body, config);
```

Evitar:

- Configurar headers una sola vez fuera de la clase si el token puede cambiar despues del login.
- Importar `React` en servicios.
- Dejar `console.log` permanentes salvo que sean temporales de debugging.

## Patron De Componentes

Los componentes existentes son funciones React con hooks.

Para pantallas de datos:

- Importar el servicio correspondiente.
- Definir estados para datos, carga y error:
  - `const [items, setItems] = useState([]);`
  - `const [cargando, setCargando] = useState(false);`
  - `const [error, setError] = useState('');`
- Cargar datos iniciales en `useEffect`.
- Limpiar errores antes de una nueva busqueda o guardado.
- Usar mensajes de backend con `err.response?.data?.message`.
- Mostrar spinner mientras carga.
- Mostrar `alert alert-danger` para errores y `alert alert-info` cuando no hay datos.

Ejemplo base:

```javascript
useEffect(() => {
    setCargando(true);
    setError('');

    RecursoServicio.listarRecursos()
        .then((response) => {
            setItems(response.data || []);
        })
        .catch((err) => {
            console.error(err);
            setItems([]);
            setError(err.response?.data?.message || 'Ocurrio un error al cargar los datos.');
        })
        .finally(() => {
            setCargando(false);
        });
}, []);
```

Para formularios:

- Usar inputs controlados con `useState`.
- Validar campos obligatorios antes de llamar al servicio.
- Usar `isSaving` para deshabilitar inputs/botones y mostrar spinner.
- En exito, navegar con `useNavigate`.
- En cancelacion, usar `Link` a la pantalla anterior.

## Layout Y Estilo Visual

Mantener la identidad visual actual:

```javascript
const PRIMARY_COLOR = '#A8DADC';
const TEXT_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#F8F9FA';
const CARD_COLOR = '#FFFFFF';
```

Patron de pantalla interna:

```jsx
<div className='d-flex' style={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh' }}>
    <SideBarComponent />
    <div className='flex-grow-1 p-0 p-md-5'>
        <div className='col-lg-12'>
            <div className='card shadow-lg' style={{ borderRadius: '15px', backgroundColor: CARD_COLOR }}>
                <div className='card-header d-flex flex-column flex-md-row align-items-center justify-content-between'
                     style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR, borderTopLeftRadius: '15px', borderTopRightRadius: '15px', padding: '1.5rem' }}>
                    {/* titulo + icono + acciones */}
                </div>
                <div className='card-body p-4 p-md-5'>
                    {/* contenido */}
                </div>
            </div>
        </div>
    </div>
</div>
```

Usar Bootstrap para grilla y espaciado:

- `d-flex`, `flex-grow-1`, `p-0 p-md-5`, `row`, `col-lg-*`.
- `card`, `card-header`, `card-body`, `shadow-lg`.
- `table-responsive`, `table table-bordered table-striped table-hover`.
- `form-group`, `form-label`, `form-control`, `form-select`.
- `alert alert-danger`, `alert alert-info`, `alert alert-success`.

Usar `react-icons` para acciones. Ejemplos actuales:

- Guardar: `FaSave`.
- Cancelar/volver: `FaTimesCircle`.
- Agregar: `FaPlusCircle`, `FaPlusSquare`.
- Buscar: `FaSearch`.
- Eliminar: `FaTrashAlt` o `FaTrash`.
- Reportes/libros: `LuBookOpenCheck`, `FaChartLine`, `TbMapDollar`.

## Rutas, Roles Y Navegacion

Agregar rutas nuevas en `src/App.js`.

Ruta protegida para usuario comun:

```jsx
<Route
  path="/nuevo-modulo"
  element={<PrivateRoute requiredRole="USER"><NuevoModuloComponent /></PrivateRoute>}
/>
```

Ruta solo admin:

```jsx
<Route
  path="/admin-modulo"
  element={<PrivateRoute requiredRole="ADMIN"><AdminModuloComponent /></PrivateRoute>}
/>
```

Actualizar `SideBarComponent.js` si la pantalla debe aparecer en el menu principal:

```javascript
const MENU_ITEMS = [
    { to: "/inicio", icon: IoHomeOutline, label: "Inicio" },
    { to: "/nuevo-modulo", icon: IconoElegido, label: "Nuevo Modulo" },
];
```

Para acciones que solo debe ver admin, usar:

```javascript
const userRole = getRoleFromToken();
const isAdmin = userRole === 'ADMIN';
```

## Maestro-Detalle Y Refrescos

Para pantallas tipo Plan de Cuentas:

- El componente padre guarda el id seleccionado.
- El sidebar/lista llama `onSelectItem(id)`.
- El panel de detalle recibe el id por props y carga su informacion.
- Usar `RefreshService.triggerRefresh()` despues de crear, editar, activar o desactivar datos que afecten a otra vista.
- Suscribir componentes que deban recargar con `RefreshService.subscribe(callback)` y limpiar la suscripcion en el return del `useEffect`.

## Reportes Y Tablas

Para reportes tipo Libro Diario o Libro Mayor:

- Definir filtros como estados (`fechaDesde`, `fechaHasta`, `selectedCuentaId`).
- Validar fechas antes de llamar al backend.
- Separar errores de validacion de errores de API cuando ayude a la UX.
- Usar funciones auxiliares locales para formatear fecha y moneda.
- Mostrar titulo dinamico del reporte segun el filtro aplicado.
- Tratar 404 o "no se encontraron" como estado sin datos cuando corresponda, no siempre como error fatal.

Formato recomendado:

```javascript
const formatCurrency = (value) => {
    if (value === null || typeof value === 'undefined') return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};
```

## Checklist Para Un Modulo Nuevo

1. Crear `src/servicios/NuevoServicio.js` con base URL, `getAuthHeaders` y metodos axios.
2. Crear el componente principal en `src/componentes/NuevoModuloComponent.js`.
3. Si hay formulario, crear o integrar pantalla con estados controlados, validacion, `isSaving` y navegacion.
4. Si hay listado/reporte, agregar estados de datos, filtros, carga, error y tabla responsive.
5. Agregar la ruta en `src/App.js` con `PrivateRoute` y el rol correcto.
6. Agregar entrada en `SideBarComponent.js` si corresponde.
7. Usar la paleta y layout existentes.
8. Usar iconos de `react-icons` coherentes con la accion.
9. Manejar mensajes de backend con fallback amigable.
10. Ejecutar al menos `npm test -- --watchAll=false` o `npm run build` antes de dar por terminado.

## Cosas A Mantener Consistentes

- Nombres en espanol para componentes, estados y mensajes visibles.
- Mensajes de error claros para validaciones de usuario.
- `ADMIN` puede acceder a vistas de `USER`; no duplicar esa logica fuera de `PrivateRoute` salvo para ocultar botones.
- No mezclar logica de negocio pesada dentro del JSX: calcular antes del `return`.
- No crear estilos globales nuevos salvo que varias pantallas los reutilicen.
- Mantener los cambios acotados al modulo en desarrollo.
