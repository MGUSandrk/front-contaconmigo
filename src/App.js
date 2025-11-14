import logo from './logo.svg';
import './App.css';
import HeaderComponente from './componentes/HeaderComponente';
import FooterComponente from './componentes/FooterComponente';

import ListarUsuariosComponente from './componentes/ListarUsuariosComponente';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddUsuarioComponent from './componentes/AddUsuarioComponent';
import LoginFormComponent from './componentes/LoginFormComponent';
import InicioComponent from './componentes/InicioComponent';
import PrivateRoute from './componentes/PrivateRouteInicio';
import PlanDeCuentasComponent from './componentes/PlanDeCuentasComponent';
import LibroDiarioComponent from './componentes/LibroDiarioComponent';
import AddAsientoComponent from './componentes/AddAsientoComponent';
import LibroMayorComponent from './componentes/LibroMayorComponent';
import AddCuentaComponent from './componentes/AddCuentaComponent';
import LandingPage from './componentes/LandingPage';


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
        </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
