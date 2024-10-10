import { useEffect, useState } from "react";
import { getNotificacionesBySociedad } from "../api"; // Asegúrate de que la función esté correctamente importada

const NotificationManagement = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token no encontrado");
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const sociedadId = decodedToken.sociedadId;

        if (!sociedadId) {
          setError("sociedadId no encontrado en el token");
          return;
        }

        const response = await getNotificacionesBySociedad(sociedadId);
        setNotificaciones(response.data);
      } catch (error) {
        setError("No se pudieron obtener las notificaciones: " + error.message);
      }
    };

    fetchNotificaciones();
  }, []);

  return (
    <div>
      <h2>Gestión de Notificaciones</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Tipo de Notificación</th>
            <th>Estado</th>
            <th>Fecha de Envío</th>
            <th>Fecha de Entrega</th>
            <th>Fecha de Confirmación</th>
          </tr>
        </thead>
        <tbody>
          {notificaciones.map((notificacion) => (
            <tr key={notificacion.id}>
              <td>{notificacion.tipo_notificacion}</td>
              <td>{notificacion.estado}</td>
              <td>{new Date(notificacion.fecha_envio).toLocaleString()}</td>
              <td>
                {notificacion.fecha_entrega
                  ? new Date(notificacion.fecha_entrega).toLocaleString()
                  : "No entregada"}
              </td>
              <td>
                {notificacion.fecha_confirmacion
                  ? new Date(notificacion.fecha_confirmacion).toLocaleString()
                  : "No confirmada"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationManagement;
