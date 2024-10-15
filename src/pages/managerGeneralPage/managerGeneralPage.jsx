// src/pages/ManagerGeneralPage.jsx
import { Routes, Route } from "react-router-dom";
import ManagerDashboardSide from "../../components/ManagerDashboardSide/ManagerDashboardSide.jsx";
import NotFound from "../../components/NotFound.jsx";
import DepartamentManagement from "../departamentosManagement/DepartmentManagementPage.jsx";
import GroupManagement from "../groupManagement/GroupManagementPage.jsx";
import UserManagement from "../userManagement/UserManagementPage.jsx";
import NotificacionesManagement from "../notificacionesManagement/NotificacionesManagementPage.jsx";
import DocumentacionManagement from "../documentacionManagement/DocumentacionManagementPage.jsx";
import Ssologin from "../../components/ssologin.jsx";
import ManagerConfiguracion from "../managerConfiguracion/managerConfiguracion.jsx";
import Logout from "../Logout/LogoutPage.jsx";
import WelcomenManagement from "../welcomeManagement/welcomeManagtement.jsx";
import "./ManagerGeneralPage.css";

const ManagerGeneralPage = () => {
  return (
    <div className="manager-page-container">
      <div className="manager-main">
        <div className="manager-sidebar">
          <ManagerDashboardSide />
        </div>
        <div className="manager-content">
          <Routes>
            <Route path="users" element={<UserManagement />} />
            <Route path="departments" element={<DepartamentManagement />} />
            <Route path="groups" element={<GroupManagement />} />
            <Route
              path="notificaciones"
              element={<NotificacionesManagement />}
            />
            <Route path="documentacion" element={<DocumentacionManagement />} />
            <Route path="ssologin" element={<Ssologin />} />
            <Route path="configuracion" element={<ManagerConfiguracion />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<WelcomenManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ManagerGeneralPage;
