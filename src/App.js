import './App.css';
import HeaderComponente from './componentes/dashboard/HeaderComponente';
import ListarUsuariosComponente from './componentes/dashboard/ListarUsuariosComponente';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddUsuarioComponent from './componentes/dashboard/AddUsuarioComponent';
import LoginFormComponent from './componentes/LoginFormComponent';
import InicioComponent from './componentes/dashboard/InicioComponent';
import PrivateRoute from './utiles/PrivateRouteInicio';
import PlanDeCuentasComponent from './componentes/contabilidad/PlanDeCuentasComponent';
import LibroDiarioComponent from './componentes/contabilidad/LibroDiarioComponent';
import AddAsientoComponent from './componentes/contabilidad/AddAsientoComponent';
import LibroMayorComponent from './componentes/contabilidad/LibroMayorComponent';
import AddCuentaComponent from './componentes/contabilidad/AddCuentaComponent';
import LandingPage from './componentes/LandingPage';
import ListarProductosComponent from './componentes/productos/ListarProductosComponent';
import AddProductoComponent from './componentes/productos/AddProductoComponent';
import ListarClientesComponent from './componentes/clientes/ListarClientesComponent';
import AddClienteComponent from './componentes/clientes/AddClienteComponent';
import ListarTiposPagoComponent from './componentes/pagos/ListarTiposPagoComponent';
import AddTipoPagoComponent from './componentes/pagos/AddTipoPagoComponent';
import AddVentaComponent from './componentes/ventas/AddVentaComponent';
import EmpresaComponent from './componentes/empresa/EmpresaComponent';


function App() {
  return (
    <div>
      <BrowserRouter>
        <HeaderComponente />
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route path='/login' element={<LoginFormComponent />}></Route>
          <Route path='/libro-mayor' element={<LibroMayorComponent />}></Route> {/* Hacer PrivateRoute */}
            {/*<Route path='/inicio' element={<InicioComponent />}></Route>*/}
          {/* <Route path='/usuarios' element={<ListarUsuariosComponente />}></Route> */}
          {/* <Route path='/add-username' element={<AddUsuarioComponent />}></Route> */}
          <Route
            path="/inicio"
            element={<PrivateRoute requiredRole="USER"><InicioComponent /></PrivateRoute>}
          />
          <Route
            path="/plan-de-cuentas"
            element={<PrivateRoute requiredRole="USER"><PlanDeCuentasComponent /></PrivateRoute>}
          />
          <Route
            path="/add-account"
            element={<PrivateRoute requiredRole="ADMIN"><AddCuentaComponent /></PrivateRoute>}
          />
          <Route
            path="/asientos"
            element={<PrivateRoute requiredRole="USER"><AddAsientoComponent /></PrivateRoute>}
          />
          <Route
            path="/libro-diario"
            element={<PrivateRoute requiredRole="USER"><LibroDiarioComponent /></PrivateRoute>}
          />
          <Route
            path="/usuarios"
            element={<PrivateRoute requiredRole="ADMIN"><ListarUsuariosComponente /></PrivateRoute>}
          />
          <Route
            path="/add-username"
            element={<PrivateRoute requiredRole="ADMIN"><AddUsuarioComponent /></PrivateRoute>}
          />
          <Route
            path="/productos"
            element={<PrivateRoute requiredRole="USER"><ListarProductosComponent /></PrivateRoute>}
          />
          <Route
            path="/add-producto"
            element={<PrivateRoute requiredRole="ADMIN"><AddProductoComponent /></PrivateRoute>}
          />
          <Route
            path="/clientes"
            element={<PrivateRoute requiredRole="USER"><ListarClientesComponent /></PrivateRoute>}
          />
          <Route
            path="/add-cliente"
            element={<PrivateRoute requiredRole="ADMIN"><AddClienteComponent /></PrivateRoute>}
          />
          <Route
            path="/tipos-pago"
            element={<PrivateRoute requiredRole="USER"><ListarTiposPagoComponent /></PrivateRoute>}
          />
          <Route
            path="/add-tipo-pago"
            element={<PrivateRoute requiredRole="ADMIN"><AddTipoPagoComponent /></PrivateRoute>}
          />
          <Route
            path="/add-venta"
            element={<PrivateRoute requiredRole="USER"><AddVentaComponent /></PrivateRoute>}
          />
          <Route
            path="/empresa"
            element={<PrivateRoute requiredRole="ADMIN"><EmpresaComponent /></PrivateRoute>}
          />
        </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
