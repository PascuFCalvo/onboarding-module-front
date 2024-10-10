import { useEffect, useState } from "react";
import { getGruposBySociedad, createGrupo, getDepartamentos } from "../api"; // Asegúrate de importar correctamente

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [newGroup, setNewGroup] = useState({
    nombre: "",
    departamento_id: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [departamentos, setDepartamentos] = useState([]); // Para almacenar departamentos

  useEffect(() => {
    const fetchDepartamentos = async () => {
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

        const response = await getDepartamentos(sociedadId); // Asegúrate de tener esta función en api.js
        setDepartamentos(response.data);
      } catch (error) {
        setError("No se pudieron obtener los departamentos: " + error.message);
      }
    };

    fetchDepartamentos();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
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

        const response = await getGruposBySociedad(sociedadId);
        setGroups(response.data);
      } catch (error) {
        setError("No se pudieron obtener los grupos: " + error.message);
      }
    };

    fetchGroups();
  }, []);

  // Función para manejar el cambio de input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  // Función para manejar la creación de un nuevo grupo
  const handleAddGroup = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const sociedadId = decodedToken.sociedadId;

      if (!sociedadId) {
        setError("sociedadId no encontrado en el token");
        return;
      }

      // Asigna el ID de sociedad al nuevo grupo
      const grupoData = {
        ...newGroup,
        sociedad_id: sociedadId,
      };

      await createGrupo(grupoData); // Llama a la API para crear el grupo
      alert("Grupo creado exitosamente");
      setNewGroup({ nombre: "", departamento_id: "" }); // Resetea el formulario
      setShowForm(false); // Oculta el formulario después de crear el grupo

      // Actualiza la lista de grupos
      const response = await getGruposBySociedad(sociedadId);
      setGroups(response.data);
    } catch (error) {
      setError("No se pudo crear el grupo: " + error.message);
    }
  };

  return (
    <div>
      <h2>Gestión de Grupos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Departamento</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td>{group.nombre}</td>
              <td>{group.departamento?.nombre || "Sin departamento"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Agregar Grupo"}
      </button>

      {showForm && (
        <form onSubmit={handleAddGroup}>
          <h3>Agregar Nuevo Grupo</h3>
          <input
            type="text"
            name="nombre"
            value={newGroup.nombre}
            onChange={handleInputChange}
            placeholder="Nombre"
            required
          />
          <select
            name="departamento_id"
            value={newGroup.departamento_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona un departamento</option>
            {/* Renderiza los departamentos aquí, asumiendo que ya tienes el estado de departamentos */}
            {departamentos.map((departamento) => (
              <option key={departamento.id} value={departamento.id}>
                {departamento.nombre}
              </option>
            ))}
          </select>
          <button type="submit">Guardar Grupo</button>
        </form>
      )}
    </div>
  );
};

export default GroupManagement;
