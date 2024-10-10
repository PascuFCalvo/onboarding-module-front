// src/components/ManagerDashboard.jsx
import { Link, Outlet } from "react-router-dom"; // Outlet se utiliza para renderizar las rutas secundarias

const ManagerDashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          width: "200px",
          borderRight: "1px solid #ccc",
          padding: "20px",
        }}
      >
        <h2>Panel de Manager</h2>
        <ul>
          <li>
            <Link to="/manager/users"> Usuarios</Link>
          </li>
          <li>
            <Link to="/manager/departments"> Departamentos</Link>
          </li>
          <li>
            <Link to="/manager/groups"> Grupos</Link>
          </li>
          <li>
            <Link to="/manager/notificaciones"> Notificaciones</Link>
          </li>
        </ul>
      </nav>
      <div style={{ padding: "20px", flex: 1 }}>
        <Outlet />{" "}
      </div>
    </div>
  );
};

export default ManagerDashboard;
