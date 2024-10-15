import "./welcomeManagement.css";

const WelcomenManagement = () => {
  return (
    <div className="welcome-container">
      <h1>Bienvenido al panel de gestión</h1>
      <p>
        En este panel podrás gestionar los departamentos, grupos y usuarios de
        tu empresa.
      </p>

      <h2>¿Qué puedes hacer?</h2>
      <ul>
        <li>Crear, editar y eliminar departamentos</li>
        <li>Crear, editar y eliminar grupos</li>
        <li>Crear, editar y eliminar usuarios</li>
        <li>Enviar notificaciones a los usuarios</li>
        <li>Subir documentación para los usuarios</li>
      </ul>

      <h2>¿Cómo empezar?</h2>
      <p>
        Utiliza el menú de la izquierda para navegar por las diferentes
        secciones.
      </p>
      <p>¡Diviértete gestionando tu empresa!</p>

      <h2>¿Necesitas ayuda?</h2>
      <p>
        Si tienes alguna duda o problema, por favor, contacta con el soporte
        técnico.
      </p>

      <h2>¡Gracias por confiar en nosotros!</h2>
    </div>
  );
};

export default WelcomenManagement;
