// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import ManagerDashboard from "./components/ManagerDashboard";
import UserManagement from "./components/UserManagement";
import DepartmentManagment from "./components/DepartmentManagement";
import UserPanel from "./components/UserPanel";
import GroupManagement from "./components/GroupManagement";
import NotificacionesManagement from "./components/NotificacionesManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/manager" element={<ManagerDashboard />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="departments" element={<DepartmentManagment />} />
          <Route path="groups" element={<GroupManagement />} />
          <Route path="notificaciones" element={<NotificacionesManagement />} />
        </Route>
        <Route path="/user" element={<UserPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
