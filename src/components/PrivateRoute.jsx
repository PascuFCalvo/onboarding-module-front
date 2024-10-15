// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Comprueba directamente en localStorage para garantizar que se mantiene autenticado tras refrescar
  const auth = JSON.parse(localStorage.getItem("persist:auth"));
  const isLoggedIn = auth && auth.logged === "true" && auth.token;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
