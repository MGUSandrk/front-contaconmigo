import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = () => {
  try {
    //Toma el token del localStorage
    const token = localStorage.getItem('token');

    //Existe el token?
    if (token) {
      return  jwtDecode(token).role;
    }
    return null; // Si no existe

  } catch (error) {
    console.error("Error decoding token: ", error);
    return null;
  }
};