// src/components/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  axios.defaults.baseURL = "http://localhost:3000";

  const handleLogin = async () => {
    try {
      const response = await axios.post("/auth/login", { username, password });
      const { token, role } = response.data;

      localStorage.setItem("token", token);

      // Redirigir según el rol
      if (role === "manager") {
        navigate("/manager"); // Llevar al panel de manager
      } else if (role === "empleado") {
        navigate("/user"); // Llevar al panel de empleado
      } else if (role === "admin") {
        navigate("/admin"); // Llevar al panel de admin (si tienes uno)
      }
    } catch (error) {
      console.log(error);
      setError("Error al iniciar sesión, verifica tus credenciales");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
  );
};

export default Login;
