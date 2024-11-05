import { useEffect, useState } from "react";
import { getRoles, getUsuarios, createUsuario } from "../../api";
import "./UserManagementPage.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [sociedadId, setSociedadId] = useState(null);
  const [marcaId, setMarcaId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    rol_id: "",
    sociedad_id: "",
    marca_id: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Efecto para obtener roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response.data);
      } catch (error) {
        setError("Error al cargar roles: " + error.message);
      }
    };
    fetchRoles();
  }, []);

  // Efecto para obtener sociedadId y marcaId desde el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token no encontrado");
      return;
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const sociedadIdFromToken = decodedToken.sociedadId;
    const marcaIdFromToken = decodedToken.marcaId;

    setSociedadId(sociedadIdFromToken);
    setMarcaId(marcaIdFromToken);

    console.log("sociedadIdFromToken", sociedadIdFromToken);
    console.log("marcaIdFromToken", marcaIdFromToken);

    if (!sociedadIdFromToken) {
      setError("ID de Sociedad no encontrado en el token");
      return;
    }

    fetchUsers(sociedadIdFromToken);
  }, []);

  // Función para obtener usuarios
  const fetchUsers = async (sociedadId) => {
    try {
      const response = await getUsuarios(sociedadId);
      setUsers(response.data);
    } catch (error) {
      setError("Error al cargar usuarios: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const asignarDocumentacion = () => {
    console.log("Asignar documentación");
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      if (!sociedadId ) {
        setError("sociedadId o marcaId no están disponibles.");
        return;
      }

      const usuarioData = {
        ...newUser,
        sociedad_id: sociedadId,
      };

      await createUsuario(usuarioData);
      alert("Usuario creado exitosamente");
      setNewUser({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        rol_id: "",
        sociedad_id: "",
        marca_id: "",});
      setShowForm(false);
      fetchUsers(sociedadId);
    } catch (error) {
      setError("Error al crear usuario: " + error.message);
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
              <td>
                {user.usuarioRoles && user.usuarioRoles.length > 0
                  ? user.usuarioRoles.map((role) => role.rol.nombre).join(", ")
                  : "Sin rol"}
              </td>
              <td>{user.telefono}</td>
              <td>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {user.direccion}
                  <button
                    style={{
                      backgroundColor: "var(--color-success)",
                      minWidth: "80px",
                      maxWidth: "80px",
                      marginLeft: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={asignarDocumentacion}
                  >
                    ➕📄
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-button" onClick={() => setShowForm(!showForm)}>
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
