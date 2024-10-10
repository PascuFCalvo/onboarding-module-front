import { useEffect, useState } from "react";
import { getDepartamentos, createDepartamento } from "../api"; // Asegúrate de importar correctamente

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [newDepartment, setNewDepartment] = useState({
    nombre: "",
    sociedad_id: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
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

        const response = await getDepartamentos(sociedadId);
        setDepartments(response.data);
      } catch (error) {
        setError("No se pudieron obtener los departamentos: " + error.message);
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment({ ...newDepartment, [name]: value });
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token no encontrado");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const sociedadId = decodedToken.sociedadId;

      await createDepartamento({ ...newDepartment, sociedad_id: sociedadId }); // Llama a la API para crear el departamento
      alert("Departamento creado exitosamente");

      setNewDepartment({ nombre: "", sociedad_id: "" });
      setShowForm(false);

      // Actualiza la lista de departamentos
      const response = await getDepartamentos(sociedadId);
      setDepartments(response.data);
    } catch (error) {
      console.log(error);
      setError("No se pudo crear el departamento");
    }
  };

  return (
    <div>
      <h2>Gestión de Departamentos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.id}>
              <td>{department.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Agregar Departamento"}
      </button>

      {showForm && (
        <form onSubmit={handleAddDepartment}>
          <h3>Agregar Nuevo Departamento</h3>
          <input
            type="text"
            name="nombre"
            value={newDepartment.nombre}
            onChange={handleInputChange}
            placeholder="Nombre del Departamento"
            required
          />
          <button type="submit">Guardar Departamento</button>
        </form>
      )}
    </div>
  );
};

export default DepartmentManagement;
