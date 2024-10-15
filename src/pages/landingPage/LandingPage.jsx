// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        <h1>Bienvenido a tu onboarding</h1>
        <div>
          <Link to="/login">
            <button>Iniciar Sesión</button>
          </Link>
          <Link to="/register">
            <button>Registrarse</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
