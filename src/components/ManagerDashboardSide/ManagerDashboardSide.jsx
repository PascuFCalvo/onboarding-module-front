// src/components/ManagerDashboard.jsx
import { Link } from "react-router-dom";
import "./ManagerDashboardSide.css";

const ManagerDashboard = () => {
  return (
    <div className="manager-dashboard-container">
      <nav className="manager-sidebar">
        <div>
          <h1>Manager</h1>
          <button>
            <Link to="/manager">Inicio</Link>
          </button>
          <img></img>
        </div>
        <div>
          <button>
            <Link to="/manager/users">Usuarios</Link>
          </button>
          <button>
            <Link to="/manager/departments">Departamentos</Link>
          </button>
          <button>
            <Link to="/manager/groups">Grupos</Link>
          </button>
          <button>
            <Link to="/manager/notificaciones">Notificaciones</Link>
          </button>
          <button>
            <Link to="/manager/documentacion">Documentacion</Link>
          </button>
        </div>
        <div className="turiscool-link">
          <button>
            <Link to="/ssologin">Turiscool</Link>
          </button>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            
          }} className="settings-profile-container">
            <button style={{
              width: "45%",
            }}>
              <Link to="/manager/configuracion">⚙️</Link>
            </button>
            <button style={{
              width: "45%",
            }}>
              <Link to="/manager/perfil">👤</Link>
            </button>
          </div>
          <button className="disconnect-button" style={{
            backgroundColor: "var(--color-danger)",
            
          }}>

            <Link to="/logout">Desconectar</Link>
          </button>
        </div>
      </nav>
      
    </div>
  );
};

export default ManagerDashboard;
