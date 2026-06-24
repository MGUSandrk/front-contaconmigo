import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {getRoleFromToken} from "../utiles/authUtils";

//Recibe un componente como parámetro
const PrivateRoute = ({ children, requiredRole}) => {
  // Verificar si el token existe en el almacenamiento local
  const token = localStorage.getItem('token');

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  const userRole = getRoleFromToken();
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (userRole === "ADMIN") {
      return children || <Outlet />;
    }

  if (requiredRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/inicio" />; 
  }
  // Si el token existe, renderizar la ruta hija
  return children || <Outlet />;
};

export default PrivateRoute;
