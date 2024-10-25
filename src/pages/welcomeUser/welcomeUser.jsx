import "./welcomeUser.css";

const WelcomeUser = () => {
  return (
    <div className="welcome-container">
      <h1>Bienvenido al Panel de Usuario</h1>
      <p>
        En este panel puedes acceder a tus documentos, realizar los procesos de
        onboarding, y firmar documentos importantes.
      </p>

      <h2>¿Qué puedes hacer aquí?</h2>
      <ul>
        <li>Ver tu documentación personal</li>
        <li>Acceder a tus onboardings pendientes</li>
        <li>Firmar documentos asignados</li>
      </ul>

      <h2>¿Cómo empezar?</h2>
      <p>
        Utiliza el menú de la izquierda para navegar por tus documentos y
        onboardings. Aquí encontrarás todo lo necesario para mantenerte al día
        con tus responsabilidades.
      </p>

      <h2>¿Necesitas ayuda?</h2>
      <p>
        Si tienes alguna duda o encuentras algún problema, contacta con el
        soporte técnico o consulta con tu supervisor.
      </p>

      <h2>¡Gracias por confiar en nosotros!</h2>
      <p>
        Estamos aquí para apoyarte en tu desarrollo y facilitar tus tareas
        diarias. ¡Disfruta de tu experiencia con nosotros!
      </p>
    </div>
  );
};

export default WelcomeUser;
