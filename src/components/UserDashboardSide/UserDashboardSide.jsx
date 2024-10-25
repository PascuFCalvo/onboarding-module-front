// src/components/userDashboard.jsx
import { Link } from "react-router-dom";
import "./UserDashboardSide.css";


const userDashboard = () => {
  return (
    <div className="user-dashboard-container">
      <nav className="user-sidebar">
        <div>
          <h1>Usuario</h1>
          <button>
            <Link to="/user">Inicio</Link>
          </button>
          <img></img>
        </div>
        <div>
          <button>
            <Link to="/user/notificaciones">Notificaciones</Link>
          </button>
          <button>
            <Link to="/user/documentacion">Documentacion</Link>
          </button>
        </div>
        <div className="turiscool-link">
          <button>
            <Link to="/ssologin">Turiscool</Link>
          </button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
            className="settings-profile-container"
          >
            <button
              style={{
                width: "45%",
              }}
            >
              <Link to="/user/configuracion">⚙️</Link>
            </button>
            <button
              style={{
                width: "45%",
              }}
            >
              <Link to="/user/perfil">👤</Link>
            </button>
          </div>
          <button
            className="disconnect-button"
            style={{
              backgroundColor: "var(--color-danger)",
            }}
          >
            <Link to="/logout">Desconectar</Link>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default userDashboard;
