import { useEffect, useState } from "react";
import { getRoles, getUsuarios, createUsuario } from "../api"; // Asegúrate de importar correctamente

const UserManagement = () => {
  const [users, setUsers] = useState([]); // Estado para almacenar la lista de usuarios
  const [error, setError] = useState(""); // Estado para manejar errores
  const [sociedadId, setSociedadId] = useState(null); // Estado para almacenar el ID de la sociedad
  const [marcaId, setMarcaId] = useState(null); // Estado para almacenar el ID de la marca
  const [roles, setRoles] = useState([]); // Estado para almacenar los roles disponibles
  const [newUser, setNewUser] = useState({
    // Estado para el nuevo usuario
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    rol_id: "",
  });
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario

  // Efecto para obtener roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles(); // Llama a getRoles como una función
        setRoles(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRoles(); // Llama a la función para obtener roles
  }, []);

  // Efecto para obtener usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token no encontrado");
          return;
        }

        // Decodifica el token para obtener el ID de la sociedad y la marca
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const sociedadId = decodedToken.sociedadId;
        const marcaId = decodedToken.marcaId; // Asegúrate de que el token incluya este campo
        setSociedadId(sociedadId);
        setMarcaId(marcaId);

        if (!sociedadId) {
          setError("sociedadId no encontrado en el token");
          return;
        }
        if (!marcaId) {
          setError("marcaId no encontrado en el token");
          return;
        }

        const response = await getUsuarios(sociedadId); // Llama a getUsuarios con el ID de sociedad
        setUsers(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []); // Dependencia vacía para ejecutar al montar el componente

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    try {
      // Asignar sociedad_id y marca_id desde el estado
      const usuarioData = {
        ...newUser,
        sociedad_id: sociedadId,
        marca_id: marcaId,
      };
      await createUsuario(usuarioData); // Llama a la API para crear el usuario
      alert("Usuario creado exitosamente");
      setNewUser({
        // Resetea el formulario
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        rol_id: "",
      });
      setShowForm(false); // Ocultar el formulario después de crear el usuario
      // Actualiza la lista de usuarios
      const updatedUsers = await getUsuarios(sociedadId);
      setUsers(updatedUsers.data);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setError("No se pudo crear el usuario");
    }
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nombre}</td>
              <td>{user.apellido}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(", ")}</td> {/* Muestra los roles */}
              <td>{user.telefono}</td>
              <td>{user.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Agregar Usuario"}
      </button>

      {showForm && (
        <form onSubmit={handleAddUser}>
          <h3>Agregar Nuevo Usuario</h3>
          <input
            type="text"
            name="nombre"
            value={newUser.nombre}
            onChange={handleInputChange}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            name="apellido"
            value={newUser.apellido}
            onChange={handleInputChange}
            placeholder="Apellido"
            required
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="telefono"
            value={newUser.telefono}
            onChange={handleInputChange}
            placeholder="Teléfono"
            required
          />
          <input
            type="text"
            name="direccion"
            value={newUser.direccion}
            onChange={handleInputChange}
            placeholder="Dirección"
            required
          />
          <select
            name="rol_id"
            value={newUser.rol_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.nombre}
              </option>
            ))}
          </select>
          <button type="submit">Guardar Usuario</button>
        </form>
      )}
    </div>
  );
};

export default UserManagement;
