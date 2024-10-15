// src/appRoutes.jsx
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/LoginPage";
import LandingPage from "./pages/landingPage/LandingPage";
import ManagerGeneralPage from "./pages/managerGeneralPage/managerGeneralPage";
import LogoutPage from "./pages/Logout/LogoutPage";
import Ssologin from "./components/ssologin";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manager/*" element={<ManagerGeneralPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/*" element={<h1>ERROR 404</h1>} />
      <Route path="/ssologin" element={<Ssologin />} />
    </Routes>
  );
};

export default AppRoutes;
