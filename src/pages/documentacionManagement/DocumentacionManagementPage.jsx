import { useEffect, useState } from "react";
import "./DocumentacionManagementPage.css";
import {
  getUsuarios,
  getDepartamentos,
  getGruposBySociedad,
  getDocumentosPorUsuarioYsociedad,
  getDocumentacionPorSociedad,
  getDocumentosPorGrupoYsociedad,
  getDocumentosPorDepartamentoYsociedad,
} from "../../api";
import axios from "axios";
import SignatureModal from "../../components/SignDocument";
import { createSignature } from "../../api";

let BASEURL = import.meta.env.VITE_BASEURL;
if (!BASEURL) {
  throw new Error("La variable VITE_BASEURL no está definida.");
}
console.log("Base URL:", BASEURL);
axios.defaults.baseURL = BASEURL;

const DocumentacionManagementPage = () => {
  const [documentacion, setDocumentacion] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [sociedadDocuments, setSociedadDocuments] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const [error, setError] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [description, setDescription] = useState("");
  const [nombre, setNombre] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupDocuments, setGroupDocuments] = useState([]);
  const [departmentDocuments, setDepartmentDocuments] = useState([]);
  const [documentName, setDocumentName] = useState("");
  const [isHided, setIsHided] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUserHidden, setIsUserHidden] = useState(false);
  const [isHoveredUser, setIsHoveredUser] = useState(false);
  const [isHoveredGroup, setIsHoveredGroup] = useState(false);
  const [isHoveredDept, setIsHoveredDept] = useState(false);
  const [isDeptHidden, setIsDeptHidden] = useState(false);
  const [isGroupHidden, setIsGroupHidden] = useState(false);
  const [isSignable, setIsSignable] = useState(false);
  const [date, setDate] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [courses, setCourses] = useState({});
  const [course, setCourse] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
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
        const response = await getUsuarios(sociedadId);
        setUsers(response.data);
      } catch (error) {
        setError("No se pudieron obtener los usuarios: " + error.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Curso seleccionado:", course);
  }, [course]);

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

  const fetchSociedadDocuments = async () => {
    try {
      const sociedadId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).sociedadId;
      const response = await getDocumentacionPorSociedad(sociedadId);
      setSociedadDocuments(response.data);
    } catch (error) {
      setError(
        "No se pudieron obtener los documentos de la sociedad: " + error.message
      );
      setSociedadDocuments([]);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setTodayDate(formattedDate);
    setDate(formattedDate); // También actualiza 'date' para establecer la fecha del selector
  };

  const fetchUserDocuments = async () => {
    try {
      const sociedadId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).sociedadId;
      const response = await getDocumentosPorUsuarioYsociedad(sociedadId);
      setUserDocuments(response.data);
    } catch (error) {
      setError(
        "No se pudieron obtener los documentos asignados: " + error.message
      );
      setUserDocuments([]);
    }
  };

  const fetchGrupsDocuments = async () => {
    try {
      const sociedadId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).sociedadId;
      const response = await getDocumentosPorGrupoYsociedad(sociedadId);
      setGroupDocuments(response.data);
    } catch (error) {
      setError(
        "No se pudieron obtener los documentos asignados: " + error.message
      );
      setGroupDocuments;
    }
  };

  const fetchDepartmentsDocuments = async () => {
    try {
      const sociedadId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).sociedadId;
      const response = await getDocumentosPorDepartamentoYsociedad(sociedadId);
      setDepartmentDocuments(response.data);
    } catch (error) {
      setError(
        "No se pudieron obtener los documentos asignados: " + error.message
      );
      setDepartmentDocuments([]);
    }
  };
  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(`${BASEURL}/turiscool/courses`);

      console.log("Datos de respuesta:", response.data);

      let coursesList = {};

      // Convierte el objeto `courses` en un array usando `Object.values()`
      if (response.data.courses && typeof response.data.courses === "object") {
        Object.values(response.data.courses).forEach((course) => {
          coursesList[course.title] = course.titleId; // Usamos `short_url` como ejemplo
        });
      } else {
        console.error(
          "La propiedad `courses` no es un objeto o no existe en la respuesta."
        );
      }

      setCourses(coursesList);
      console.log(coursesList); // Imprime el objeto resultante
    } catch (error) {
      console.error("Error al obtener los cursos:", error);
    }
  };

  useEffect(() => {
    fetchSociedadDocuments();
    fetchUserDocuments();
    fetchGrupsDocuments();
    fetchDepartmentsDocuments();
    getTodayDate();
    fetchAllCourses();
  }, []);

  const handleFileChange = (e) => {
    setDocumentacion(e.target.files[0]);
  };
  const isDocumentInUserDocuments = (documentName) => {
    return userDocuments.some((doc) => doc.documento?.nombre === documentName);
  };

  const handleUserChange = (e) => {
    const { value, checked } = e.target;
    setSelectedUsers((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleGroupChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGroups((prev) => {
      const updatedGroups = checked
        ? [...prev, value]
        : prev.filter((id) => id !== value);
      console.log("Grupos seleccionados:", updatedGroups);
      return updatedGroups;
    });
  };

  const handleDepartmentChange = (e) => {
    const { value, checked } = e.target;
    setSelectedDepartments((prev) => {
      const updatedDepartments = checked
        ? [...prev, value]
        : prev.filter((id) => id !== value);
      console.log("Departamentos seleccionados:", updatedDepartments);
      return updatedDepartments;
    });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Solo agregar el archivo si `documentacion` no es null o undefined
    if (documentacion) {
      formData.append("file", documentacion);
    }
    if (course) {
      formData.append("course", course);
    }
    formData.append("nombre", nombre);
    formData.append("descripcion", description);
    formData.append("users", JSON.stringify(selectedUsers));
    formData.append("departments", JSON.stringify(selectedDepartments));
    formData.append("period", date); // Aquí asegúrate de usar 'period' y no 'periodo'
    formData.append("groups", JSON.stringify(selectedGroups));
    formData.append(
      "sociedad",
      JSON.parse(atob(localStorage.getItem("token").split(".")[1])).sociedadId
    );

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASEURL}/documentacion/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Documentación asignada exitosamente.");
      await fetchSociedadDocuments();
      await fetchUserDocuments();
      setSelectedUsers([]);
      setNombre("");
      setDescription("");
      setSelectedDepartments([]);
      setSelectedGroups([]);
      setDocumentacion(null); // Asegúrate de resetear el archivo después de subirlo
    } catch (error) {
      setError("Error al subir la documentación: " + error.message);
    }
  };

  const openModal = (url, assignedUserId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token no encontrado");
      return;
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentUserId = decodedToken.id;
    const documentName = url.split("/").pop();

    // Verificar si el documento está en userDocuments y si el usuario es el asignado
    if (
      isDocumentInUserDocuments(documentName) &&
      currentUserId === assignedUserId
    ) {
      setIsSignable(true); // Permitir firmar solo si el documento está en userDocuments y el usuario coincide
    } else {
      setIsSignable(false); // No permitir firmar si no está en userDocuments
    }

    setPreviewUrl(url);
    setIsModalOpen(true);
    setDocumentName(documentName);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewUrl(null);
    setDocumentName("");
  };

  const handleSignDocument = async (signatureInfo) => {
    try {
      const response = await createSignature(signatureInfo);
      const { documento_id } = response.data;

      // Actualizar el estado de `firma` en `userDocuments`
      setUserDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.documento.id === documento_id
            ? { ...doc, firma: true } // Usar 'firma' en lugar de 'is_firmado'
            : doc
        )
      );

      closeModal();
    } catch (error) {
      console.error("Error al registrar la firma:", error);
    }
  };

  const handleHideTable = () => {
    setIsHided(!isHided);
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    let formattedDate = date.split("T")[0];
    setDate(formattedDate);
  };

  return (
    <>
      <div className="container">
        <h2>Subir Documentación</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <p>Selecciona un curso o agrega documentacion</p>
          <select onChange={handleCourseChange} value={course}>
            {" "}
            <option value="">Selecciona un curso</option>
            {Object.entries(courses).map(([course, id]) => (
              <option key={id} value={id}>
                {course}
              </option>
            ))}
          </select>
          <input type="file" onChange={handleFileChange} required />
          <input
            type="text"
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            onChange={handleDescriptionChange}
            placeholder="Descripción"
            required
          />

          <div>
            <h4
              onClick={() => setShowUsers(!showUsers)}
              style={{ cursor: "pointer" }}
            >
              {showUsers ? "▼" : "►"} Selecciona Usuarios
            </h4>
            {showUsers &&
              users.map((user) => (
                <div key={user.id}>
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={selectedUsers.includes(user.id.toString())}
                    onChange={handleUserChange}
                  />
                  {user.nombre} {user.apellido}
                </div>
              ))}
          </div>

          <div>
            <h4
              onClick={() => setShowDepartments(!showDepartments)}
              style={{ cursor: "pointer" }}
            >
              {showDepartments ? "▼" : "►"} Selecciona Departamentos
            </h4>
            {showDepartments &&
              departments.map((department) => (
                <div key={department.id}>
                  <input
                    type="checkbox"
                    value={department.id}
                    checked={selectedDepartments.includes(
                      department.id.toString()
                    )}
                    onChange={handleDepartmentChange}
                  />
                  {department.nombre}
                </div>
              ))}
          </div>

          <div>
            <h4
              onClick={() => setShowGroups(!showGroups)}
              style={{ cursor: "pointer" }}
            >
              {showGroups ? "▼" : "►"} Selecciona Grupos
            </h4>
            {showGroups &&
              groups.map((group) => (
                <div key={group.id}>
                  <input
                    type="checkbox"
                    value={group.id}
                    checked={selectedGroups.includes(group.id.toString())}
                    onChange={handleGroupChange}
                  />
                  {group.nombre}
                </div>
              ))}
          </div>

          <h4>Periodo</h4>

          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e)}
          />

          <button className="add-button" type="button" onClick={handleSubmit}>
            Asignar Documentación
          </button>
        </form>
        {documentacion && (
          <p className="selected-file">
            Archivo seleccionado: {documentacion.name}
          </p>
        )}
        {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
      </div>
      <div className="tables-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Centra verticalmente los elementos
            gap: "10px",
            textAlign: "flex-end", // Añade espacio entre el título y el botón
          }}
        >
          <h2
            style={{
              margin: 0,
              alignSelf: "flex-end", // Alinea el texto a la izquierda
            }}
          >
            Documentacion general
          </h2>
          <button
            style={{
              backgroundColor: isHovered
                ? "var(--color-info-hover)"
                : "var(--color-info)",
              color: "var(--color-light)",
              borderRadius: "var(--border-radius)",
              cursor: "pointer",
              fontSize: "1.2rem",
              width: "3rem", // Ajusta el ancho del botón
            }}
            onClick={handleHideTable}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHided ? "▼" : "▲"}
          </button>
        </div>
        <div
          style={{
            maxHeight: isHided ? 0 : "500px",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}
        >
          {sociedadDocuments.length === 0 ? (
            <p>No hay documentos disponibles para esta sociedad.</p>
          ) : (
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Descripción</th>
                  <th>Fecha de Subida</th>
                  <th>Terminar antes de:</th>
                  <th>Documento</th>
                  <th>Link curso</th>
                </tr>
              </thead>
              <tbody>
                {sociedadDocuments.map((doc) => (
                  <tr key={doc?.id}>
                    <td>{doc?.documentacion?.nombre || "No disponible"}</td>
                    <td>
                      {doc?.documentacion?.descripcion || "No disponible"}
                    </td>
                    <td>
                      {doc?.documentacion?.fecha_subida
                        ? new Date(
                            doc.documentacion.fecha_subida
                          ).toLocaleDateString()
                        : "No disponible"}
                    </td>
                    <td>
                      {doc?.documentacion?.periodo
                        ? new Date(
                            doc.documentacion.periodo
                          ).toLocaleDateString()
                        : "No disponible"}
                    </td>

                    {/* remder condicional, si no hay documento en vez del boton renderiziar "-" */}
                    <td>
                      {!doc?.documentacion?.url ? (
                        <p>-</p>
                      ) : (
                        <button
                          className="table-button"
                          onClick={() => {
                            // Primero asegúrate de que el documento tiene una URL válida
                            const documentUrl = `${BASEURL}/${doc?.documentacion?.url}`;
                            if (documentUrl) {
                              setIsSignable(false); // Cambiar el estado
                              openModal(documentUrl); // Luego abrir el modal
                            }
                            console.log(doc);
                          }}
                        >
                          Ver Documento
                        </button>
                      )}
                    </td>
                    <td>
                      {!doc?.documentacion?.linkCourse ||
                      doc?.documentacion?.linkCourse.includes("null") ? (
                        <p> - </p>
                      ) : (
                        <a
                          href={doc?.documentacion?.linkCourse}
                          target="_blank"
                          style={{
                            color: "var(--color-dark)",
                            textDecoration: "none",
                            alignSelf: "center",
                            justifySelf: "center",
                          }}
                        >
                          LINK CURSO
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="tables-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Centra verticalmente los elementos
            gap: "10px",
          }}
        >
          <h2
            style={{
              margin: 0,
              alignSelf: "flex-end", // Alinea el texto en el borde inferior
            }}
          >
            Documentos por grupo
          </h2>
          <button
            style={{
              backgroundColor: isHoveredGroup
                ? "var(--color-info-hover)"
                : "var(--color-info)",
              color: "var(--color-light)",
              borderRadius: "var(--border-radius)",
              cursor: "pointer",
              fontSize: "1.2rem",
              width: "3rem", // Ajusta el ancho del botón
            }}
            onClick={() => setIsGroupHidden(!isGroupHidden)}
            onMouseEnter={() => setIsHoveredGroup(true)}
            onMouseLeave={() => setIsHoveredGroup(false)}
          >
            {isGroupHidden ? "▼" : "▲"}
          </button>
        </div>
        <div
          style={{
            maxHeight: isGroupHidden ? 0 : "500px",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}
        >
          {groupDocuments.length === 0 ? (
            <p>No hay documentos asignados a grupos.</p>
          ) : (
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Departamento</th>
                  <th>Sociedad</th>
                  <th>Documento</th>
                  <th>Descripción</th>
                  <th>Fecha de Subida</th>
                  <th>Documento</th>
                  <th>Link curso</th>
                </tr>
              </thead>
              <tbody>
                {groupDocuments.map((doc) => (
                  <tr key={doc?.id}>
                    <td>{doc?.grupo?.nombre || "No disponible"}</td>
                    <td>
                      {doc?.grupo?.departamento?.nombre || "No disponible"}
                    </td>
                    <td>
                      {doc?.documento?.sociedad?.nombre || "No disponible"}
                    </td>
                    <td>{doc?.documento?.nombre || "No disponible"}</td>
                    <td>{doc?.documento?.descripcion || "No disponible"}</td>
                    <td>
                      {doc?.documento?.fecha_subida
                        ? new Date(
                            doc.documento.fecha_subida
                          ).toLocaleDateString()
                        : "No disponible"}
                    </td>
                    <td>
                      {!doc?.documento?.url ? (
                        <p>-</p>
                      ) : (
                        <button
                          className="table-button"
                          onClick={() => {
                            // Primero asegúrate de que el documento tiene una URL válida
                            const documentUrl = `${BASEURL}/${doc?.documento?.url}`;
                            if (documentUrl) {
                              setIsSignable(false); // Cambiar el estado
                              openModal(documentUrl); // Luego abrir el modal
                            }
                          }}
                        >
                          Ver Documento
                        </button>
                      )}
                    </td>
                    <td>
                      {!doc?.documento?.linkCourse ||
                      doc?.documento?.linkCourse.includes("null") ? (
                        <p> - </p>
                      ) : (
                        <a
                          href={doc?.documento?.linkCourse}
                          target="_blank"
                          style={{
                            color: "var(--color-dark)",
                            textDecoration: "none",
                            alignSelf: "center",
                            justifySelf: "center",
                          }}
                        >
                          LINK CURSO
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="tables-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Centra verticalmente los elementos
            gap: "10px",
          }}
        >
          <h2
            style={{
              margin: 0,
              alignSelf: "flex-end", // Alinea el texto en el borde inferior
            }}
          >
            Documentos por departamento
          </h2>
          <button
            style={{
              backgroundColor: isHoveredDept
                ? "var(--color-info-hover)"
                : "var(--color-info)",
              color: "var(--color-light)",
              borderRadius: "var(--border-radius)",
              cursor: "pointer",
              fontSize: "1.2rem",
              width: "3rem", // Ajusta el ancho del botón
            }}
            onClick={() => setIsDeptHidden(!isDeptHidden)}
            onMouseEnter={() => setIsHoveredDept(true)}
            onMouseLeave={() => setIsHoveredDept(false)}
          >
            {isDeptHidden ? "▼" : "▲"}
          </button>
        </div>
        <div
          style={{
            maxHeight: isDeptHidden ? 0 : "500px",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}
        >
          {departmentDocuments.length === 0 ? (
            <p>No hay documentos asignados a departamentos.</p>
          ) : (
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Departamento</th>
                  <th>Grupos</th>
                  <th>Sociedad</th>
                  <th>Documento</th>
                  <th>Descripción</th>
                  <th>Fecha de Subida</th>
                  <th>Documento</th>
                  <th>Link curso</th>
                </tr>
              </thead>
              <tbody>
                {departmentDocuments.map((doc) => (
                  <tr key={doc?.id}>
                    <td>{doc?.departamento?.nombre || "No disponible"}</td>
                    <td>
                      {doc?.departamento?.grupos
                        ? doc.departamento.grupos
                            .map((grupo) => grupo.nombre || "No disponible")
                            .join(", ")
                        : "No disponible"}
                    </td>
                    <td>
                      {doc?.documento?.sociedad?.nombre || "No disponible"}
                    </td>
                    <td>{doc?.documento?.nombre || "No disponible"}</td>
                    <td>{doc?.documento?.descripcion || "No disponible"}</td>
                    <td>
                      {doc?.documento?.fecha_subida
                        ? new Date(
                            doc.documento.fecha_subida
                          ).toLocaleDateString()
                        : "No disponible"}
                    </td>
                    <td>
                      {!doc?.documento?.url ? (
                        <p>-</p>
                      ) : (
                        <button
                          className="table-button"
                          onClick={() => {
                            // Primero asegúrate de que el documento tiene una URL válida
                            const documentUrl = `${BASEURL}/${doc?.documento.url}`;

                            if (documentUrl) {
                              // Pasar la URL del documento y el ID del usuario asignado al modal
                              openModal(documentUrl);
                            }
                          }}
                        >
                          Ver Documento
                        </button>
                      )}
                    </td>
                    <td>
                      {!doc?.documento?.linkCourse ||
                      doc?.documento?.linkCourse.includes("null") ? (
                        <p> - </p>
                      ) : (
                        <a
                          href={doc?.documento?.linkCourse}
                          target="_blank"
                          style={{
                            color: "var(--color-dark)",
                            textDecoration: "none",
                            alignSelf: "center",
                            justifySelf: "center",
                          }}
                        >
                          LINK CURSO
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="tables-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Centra verticalmente los elementos
            gap: "10px",
          }}
        >
          <h2
            style={{
              margin: 0,
              alignSelf: "flex-end", // Alinea el texto en el borde inferior
            }}
          >
            Documentos por usuario
          </h2>
          <button
            style={{
              backgroundColor: isHoveredUser
                ? "var(--color-info-hover)"
                : "var(--color-info)",
              color: "var(--color-light)",
              borderRadius: "var(--border-radius)",
              cursor: "pointer",
              fontSize: "1.2rem",
              width: "3rem", // Ajusta el ancho del botón
            }}
            onClick={() => setIsUserHidden(!isUserHidden)}
            onMouseEnter={() => setIsHoveredUser(true)}
            onMouseLeave={() => setIsHoveredUser(false)}
          >
            {isUserHidden ? "▼" : "▲"}
          </button>
        </div>
        <div
          style={{
            maxHeight: isUserHidden ? 0 : "500px",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}
        >
          {userDocuments.length === 0 ? (
            <p>No hay documentos asignados a ningún usuario.</p>
          ) : (
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Documento</th>
                  <th>Descripción</th>
                  <th>Fecha de Subida</th>
                  <th>Firmado</th>
                  <th>Documento</th>
                  <th>Link curso</th>
                </tr>
              </thead>
              <tbody>
                {userDocuments.map((doc) => {
                  const isSigned = doc.firma;
                  const documentUrl = isSigned
                    ? `${BASEURL}/${doc.url}` // Si el documento está firmado, usa la URL firmada del usuario
                    : `${BASEURL}/${doc.documento.url}`; // Si no está firmado, usa la URL de la sociedad

                  return (
                    <tr key={doc?.id}>
                      <td>{doc?.usuario?.nombre || "No disponible"}</td>
                      <td>{doc?.usuario?.apellido || "No disponible"}</td>
                      <td>{doc?.documento?.nombre || "No disponible"}</td>
                      <td>{doc?.documento?.descripcion || "No disponible"}</td>
                      <td>
                        {doc?.documento?.fecha_subida
                          ? new Date(
                              doc.documento.fecha_subida
                            ).toLocaleDateString()
                          : "No disponible"}
                      </td>
                      <td style={{ color: isSigned ? "green" : "red" }}>
                        {isSigned ? "Sí" : "No"}
                      </td>
                      <td>
                        {!doc?.documento?.url ? (
                          <p>-</p>
                        ) : (
                          <button
                            className="table-button"
                            onClick={() => {
                              const assignedUserId = doc?.usuario?.id;
                              setIsSignable(true);
                              openModal(documentUrl, assignedUserId);
                            }}
                          >
                            Ver Documento
                          </button>
                        )}
                      </td>
                      <td>
                        {!doc?.documento?.linkCourse ||
                        doc?.documento?.linkCourse.includes("null") ? (
                          <p> - </p>
                        ) : (
                          <a
                            href={doc?.documento?.linkCourse}
                            target="_blank"
                            style={{
                              color: "var(--color-dark)",
                              textDecoration: "none",
                              alignSelf: "center",
                              justifySelf: "center",
                            }}
                          >
                            LINK CURSO
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modalOverPage">
          <div className="modalContent">
            <SignatureModal
              previewUrl={previewUrl}
              closeModal={closeModal}
              handleSignDocument={handleSignDocument}
              documentName={documentName}
              isSignable={isSignable}
              isSigned={
                userDocuments.find(
                  (doc) => doc.documento.nombre === documentName
                )?.firma || false
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentacionManagementPage;
