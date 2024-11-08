import { useEffect, useState } from "react";
import {
  getRoles,
  getUsuarios,
  createUsuario,
  deleteUsuario,
  updateUsuario,
  getDocumentacionPorSociedad,
  getDocumentosPorGrupoYsociedad,
  getDocumentosPorDepartamentoYsociedad,
} from "../../api";
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
    login: "",
    password: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [allDocuments, setAllDocuments] = useState([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

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

    if (!sociedadIdFromToken) {
      setError("ID de Sociedad no encontrado en el token");
      return;
    }

    fetchUsers(sociedadIdFromToken);
    fetchAllDocuments(sociedadIdFromToken);
  }, []);

  const fetchUsers = async (sociedadId) => {
    try {
      const response = await getUsuarios(sociedadId);
      setUsers(response.data);
    } catch (error) {
      setError("Error al cargar usuarios: " + error.message);
    }
  };

  const fetchAllDocuments = async (sociedadId) => {
    try {
      const sociedadResponse = await getDocumentacionPorSociedad(sociedadId);
      const groupResponse = await getDocumentosPorGrupoYsociedad(sociedadId);
      const departmentResponse = await getDocumentosPorDepartamentoYsociedad(
        sociedadId
      );

      // Combina todos los documentos disponibles en un solo array
      const combinedDocuments = [
        ...(sociedadResponse?.data || []),
        ...(groupResponse?.data || []),
        ...(departmentResponse?.data || []),
      ];

      setAllDocuments(combinedDocuments);
      console.log("Documentos combinados:", combinedDocuments);

      //filtrar documentos, si no tiene un . dentro de documentacion.nombre no agregarlo
      const filteredDocuments = combinedDocuments.filter((doc) =>
        doc.documentacion?.nombre?.includes(".")
      );
      console.log("Documentos filtrados:", filteredDocuments);
      setAllDocuments(filteredDocuments);
    } catch (error) {
      console.error(
        "No se pudieron obtener algunos documentos:",
        error.message
      );
      setAllDocuments([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const usuarioData = { ...newUser, sociedad_id: sociedadId };
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
        marca_id: "",
      });
      setShowForm(false);
      fetchUsers(sociedadId);
    } catch (error) {
      setError("Error al crear usuario: " + error.message);
    }
  };

  const deleteUser = (userId) => async () => {
    try {
      await deleteUsuario(userId);
      fetchUsers(sociedadId);
    } catch (error) {
      setError("Error al borrar usuario: " + error.message);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await updateUsuario(editingUserId, newUser);
      alert("Usuario actualizado exitosamente");
      setShowEditForm(false);
      fetchUsers(sociedadId);
    } catch (error) {
      setError("Error al actualizar usuario: " + error.message);
    }
  };

  const editUser = (user) => () => {
    setNewUser({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      rol_id: user.rol_id,
      sociedad_id: user.sociedad_id,
      marca_id: user.marca_id,
      login: user.login,
      password: user.password,
    });
    setEditingUserId(user.id);
    setShowEditForm(true);
  };

  const openAddUserForm = () => {
    setNewUser({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      rol_id: "",
      sociedad_id: "",
      marca_id: "",
    });
    setShowForm(true);
  };

  const addDocument = () => {
    setShowDocumentModal(true);
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
            <th>📄</th>
            <th>🗑</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {user.nombre}
                <button onClick={editUser(user)}>📝</button>
              </td>
              <td>{user.apellido}</td>
              <td>{user.email}</td>
              <td>
                {user.usuarioRoles && user.usuarioRoles.length > 0
                  ? user.usuarioRoles.map((role) => role.rol.nombre).join(", ")
                  : "Sin rol"}
              </td>
              <td>{user.telefono}</td>
              <td>{user.direccion}</td>
              <td>
                <button className="add-document" onClick={addDocument}>
                  📄
                </button>
              </td>
              <td>
                <button className="delete-user" onClick={deleteUser(user.id)}>
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-button" onClick={openAddUserForm}>
        {showForm ? "Cancelar" : "Agregar Usuario"}
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowForm(false)}>
              &times;
            </button>
            <form onSubmit={handleAddUser}>
              <h3>Agregar Usuario</h3>
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
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowEditForm(false)}
            >
              &times;
            </button>
            <form onSubmit={handleEditUser}>
              <h3>Editar Usuario</h3>
              <input
                type="text"
                name="nombre"
                value={newUser.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="apellido"
                value={newUser.apellido}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="telefono"
                value={newUser.telefono}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="direccion"
                value={newUser.direccion}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="login"
                placeholder="Login"
                value={newUser.login}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleInputChange}
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
              <button type="submit">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para mostrar documentos combinados */}
      {showDocumentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowDocumentModal(false)}
            >
              &times;
            </button>
            <h3>Documentación Combinada</h3>
            <ul>
              {allDocuments.map((doc) => (
                <li key={doc.documento_id || doc.id}>
                  <p>
                    Nombre:{" "}
                    {doc.documentacion?.nombre || "Documento sin nombre"}
                  </p>

                  {doc.documentacion?.url ? (
                    <a
                      href={`/${doc.documentacion.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver Documento
                    </a>
                  ) : (
                    <span>Sin enlace disponible</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
