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
import ListarVentasComponent from './componentes/ventas/ListarVentasComponent';
import EmpresaComponent from './componentes/empresa/EmpresaComponent';


function App() {
  return (
    <div>
      <BrowserRouter>
        <HeaderComponente />
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path='/login' element={<LoginFormComponent />}></Route>

          <Route element={<PrivateRoute requiredRole={['SELLER', 'COUNTABLE']} />}>
            <Route path="/inicio" element={<InicioComponent />} />
          </Route>

          <Route element={<PrivateRoute requiredRole={'COUNTABLE'} />}>
            <Route path="/plan-de-cuentas" element={<PlanDeCuentasComponent />} />
            <Route path="/asientos" element={<AddAsientoComponent />} />
            <Route path="/libro-diario" element={<LibroDiarioComponent />} />
            <Route path='/libro-mayor' element={<LibroMayorComponent />}></Route>
          </Route>

          <Route element={<PrivateRoute requiredRole={'SELLER'} />}>
            <Route path="/productos" element={<ListarProductosComponent />} />
            <Route path="/clientes" element={<ListarClientesComponent />} />
            <Route path="/tipos-pago" element={<ListarTiposPagoComponent />} />
            <Route path="/add-venta" element={<AddVentaComponent />} />
            <Route path="/add-cliente" element={<AddClienteComponent />} />
          </Route>
          
          <Route element={<PrivateRoute requiredRole="ADMIN" />}>
            <Route path="/add-account" element={<AddCuentaComponent />} />
            <Route path="/usuarios" element={<ListarUsuariosComponente />} />
            <Route path="/add-username" element={<AddUsuarioComponent />} />
            <Route path="/add-producto" element={<AddProductoComponent />} />
            <Route path="/add-tipo-pago" element={<AddTipoPagoComponent />} />
            <Route path="/ventas" element={<ListarVentasComponent />} />
            <Route path="/empresa" element={<EmpresaComponent />} />
          </Route>
        </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
