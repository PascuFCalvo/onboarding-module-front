// src/components/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  let BASEURL = import.meta.env.VITE_BASEURL;
  if (!BASEURL) {
    throw new Error("La variable VITE_BASEURL no está definida.");
  }
  console.log("Base URL:", BASEURL);
  axios.defaults.baseURL = BASEURL;

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor, ingresa tanto el usuario como la contraseña.");
      return;
    }

    try {
      const response = await axios.post("/auth/login", { username, password });
      const { token, role } = response.data;
      localStorage.setItem("token", token);

      if (role === "manager") {
        navigate("/manager");
      } else if (role === "empleado") {
        navigate("/user");
      } else if (role === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error en la solicitud de login:", error);
      setError("Error al iniciar sesión, verifica tus credenciales.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Iniciar Sesión</button>
      </div>
    </div>
  );
};

export default Login;
