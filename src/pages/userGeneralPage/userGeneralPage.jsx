// src/pages/userGeneralPage.jsx
import { Routes, Route } from "react-router-dom";
import UserDashboardSide from "../../components/userDashboardSide/userDashboardSide.jsx";
import NotFound from "../../components/NotFound.jsx";
import NotificacionesManagement from "../notificacionesManagement/NotificacionesManagementPage.jsx";
import Ssologin from "../../components/ssologin.jsx";
import Logout from "../Logout/LogoutPage.jsx";
import UserConfiguracion from "../userConfiguracion/managerConfiguracion.jsx";
import "./userGeneralPage.css";
import WelcomeUser from "../welcomeUser/welcomeUser.jsx";
import DocumentacionUserPage from "../documentacionUser/documentacionUser.jsx";

const userGeneralPage = () => {
  return (
    <div className="user-page-container">
      <div className="user-main">
        <div className="user-sidebar">
          <UserDashboardSide />
        </div>
        <div className="user-content">
          <Routes>
            <Route
              path="notificaciones"
              element={<NotificacionesManagement />}
            />
            <Route path="documentacion" element={<DocumentacionUserPage />} />
            <Route path="ssologin" element={<Ssologin />} />
            <Route path="configuracion" element={<UserConfiguracion />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<WelcomeUser/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default userGeneralPage;
