import axios from "axios";

// Configura la URL base para todas las llamadas a la API
axios.defaults.baseURL = "http://localhost:3000"; // Cambia el puerto si es necesario

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Esto añade el token a cada solicitud
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Obtener Roles
export const getRoles = () => axios.get("/roles/roles");

// Usuarios
export const getUsuarios = (sociedadId) =>
  axios.get(`/usuarios/sociedad/${sociedadId}`);
export const createUsuario = (usuario) => axios.post("/usuarios", usuario);
export const updateUsuario = (id, usuario) =>
  axios.put(`/usuarios/${id}`, usuario);
export const deleteUsuario = (id) => axios.delete(`/usuarios/${id}`);

// Departamentos
export const getDepartamentos = (sociedadId) =>
  axios.get(`/departamentos/sociedad/${sociedadId}`);
export const createDepartamento = (departamento) =>
  axios.post("/departamentos", departamento);
export const updateDepartamento = (id, departamento) =>
  axios.put(`/departamentos/${id}`, departamento);
export const deleteDepartamento = (id) => axios.delete(`/departamentos/${id}`);

// Grupos

export const getGruposBySociedad = (sociedadId) =>
  axios.get(`/grupos/sociedad/${sociedadId}`);
export const createGrupo = (grupo) => axios.post("/grupos", grupo);
export const updateGrupo = (id, grupo) => axios.put(`/grupos/${id}`, grupo);
export const deleteGrupo = (id) => axios.delete(`/grupos/${id}`);

//notificaciones
export const getNotificacionesBySociedad = (sociedadId) =>
  axios.get(`/notificaciones/sociedad/${sociedadId}`);

// Documentación
export const uploadDocumentacion = (documentacion) =>
  axios.post("/documentacion", documentacion);
export const getDocumentosPorSociedad = (sociedadId) =>
  axios.get(`/documentacion/sociedad/${sociedadId}`);
export const getDocumentosPorUsuarioYsociedad = (sociedadId) =>
  axios.get(`/documentacion/sociedad/${sociedadId}/documentacionUsuarios`);
export const getDocumentacionPorSociedad = (sociedadId) =>
  axios.get(`/documentacion/sociedad/${sociedadId}/documentacionSociedad`);
export const getDocumentosPorGrupoYsociedad = (sociedadId) =>
  axios.get(`/documentacion/sociedad/${sociedadId}/documentacionGrupos`);

export const getDocumentosPorDepartamentoYsociedad = (sociedadId) =>
  axios.get(`/documentacion/sociedad/${sociedadId}/documentacionDepartamentos`);

//ssologin
export const ssologin = (usuario) => axios.post("/ssologin", usuario);
