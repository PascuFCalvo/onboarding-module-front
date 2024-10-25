import { useEffect, useState } from "react";
import {
  getDocumentosPorUsuarioYsociedad,
  getDocumentacionPorSociedad,
  getDocumentosPorGrupoYsociedad,
  getDocumentosPorDepartamentoYsociedad,
} from "../../api";
import SignatureModal from "../../components/SignDocument";
import { createSignature } from "../../api";
import axios from "axios";

let BASEURL = import.meta.env.VITE_BASEURL;
if (!BASEURL) {
  throw new Error("La variable VITE_BASEURL no está definida.");
}
console.log("Base URL:", BASEURL);
axios.defaults.baseURL = BASEURL;

const DocumentacionUserPage = () => {
  const [sociedadDocuments, setSociedadDocuments] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const [groupDocuments, setGroupDocuments] = useState([]);
  const [departmentDocuments, setDepartmentDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [userId, setUserId] = useState(null);
  const [departamentoId, setDepartamentoId] = useState(null);
  const [grupoId, setGrupoId] = useState(null);
  const [isSignable, setIsSignable] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { id, grupoId, departamentoId } = JSON.parse(
        atob(token.split(".")[1])
      );
      setUserId(id);
      setGrupoId(grupoId);
      setDepartamentoId(departamentoId);
    }
  }, []);

  useEffect(() => {
    if (userId && grupoId && departamentoId) {
      fetchSociedadDocuments();
      fetchUserDocuments();
      fetchGrupsDocuments();
      fetchDepartmentsDocuments();
    }
  }, [userId, grupoId, departamentoId]);

  const fetchSociedadDocuments = async () => {
    try {
      const sociedadId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).sociedadId;
      const response = await getDocumentacionPorSociedad(sociedadId);
      setSociedadDocuments(response.data);
    } catch (error) {
      console.error("Error al obtener documentos de la sociedad:", error);
    }
  };

  const fetchUserDocuments = async () => {
    try {
      const sociedadId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).sociedadId;
      const response = await getDocumentosPorUsuarioYsociedad(sociedadId);
      const filteredDocuments = response.data.filter(
        (doc) => doc.usuario.id === userId
      );
      setUserDocuments(filteredDocuments);
    } catch (error) {
      console.error("Error al obtener documentos asignados:", error);
    }
  };

  const fetchGrupsDocuments = async () => {
    try {
      const sociedadId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).sociedadId;
      const response = await getDocumentosPorGrupoYsociedad(sociedadId);
      const filteredDocuments = response.data.filter(
        (doc) => doc.grupo.id === grupoId
      );
      setGroupDocuments(filteredDocuments);
    } catch (error) {
      console.error("Error al obtener documentos asignados por grupo:", error);
    }
  };

  const fetchDepartmentsDocuments = async () => {
    try {
      const sociedadId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).sociedadId;
      const response = await getDocumentosPorDepartamentoYsociedad(sociedadId);
      const filteredDocuments = response.data.filter(
        (doc) => doc.departamento.id === departamentoId
      );
      setDepartmentDocuments(filteredDocuments);
    } catch (error) {
      console.error(
        "Error al obtener documentos asignados por departamento:",
        error
      );
    } finally {
      setIsLoading(false); // Marcar como cargado
    }
  };

  const isDocumentInUserDocuments = (documentName) => {
    return userDocuments.some((doc) => doc.documento?.nombre === documentName);
  };

  const openModal = (url, isUserDocument = false, isSigned = false) => {
    const documentName = url.split("/").pop();

    // Solo permitir firma en documentos de la tabla de usuario
    if (isUserDocument && isDocumentInUserDocuments(documentName)) {
      setIsSignable(!isSigned); // Permitir firmar si no está firmado
    } else {
      setIsSignable(false); // No permitir firmar en otras tablas
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

      // Actualizar el estado de firma en userDocuments
      setUserDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.documento.id === documento_id ? { ...doc, firma: true } : doc
        )
      );

      closeModal();
    } catch (error) {
      console.error("Error al registrar la firma:", error);
    }
  };

  if (isLoading) return <p>Cargando documentos...</p>;

  return (
    <div>
      <div className="tables-container">
        <h2>Documentacion general</h2>
        {sociedadDocuments.length === 0 ? (
          <p>No hay documentos disponibles para esta sociedad.</p>
        ) : (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Descripción</th>
                <th>Fecha de Subida</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {sociedadDocuments.map((doc) => (
                <tr key={doc?.id}>
                  <td>{doc?.documentacion?.nombre || "No disponible"}</td>
                  <td>{doc?.documentacion?.descripcion || "No disponible"}</td>
                  <td>
                    {doc?.documentacion?.fecha_subida
                      ? new Date(
                          doc.documentacion.fecha_subida
                        ).toLocaleDateString()
                      : "No disponible"}
                  </td>
                  <td>
                    <button
                      className="table-button"
                      onClick={() =>
                        openModal(`${BASEURL}/${doc?.documentacion?.url}`)
                      }
                    >
                      Ver Documento
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="tables-container">
        <h2>Documentos por usuario</h2>
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
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {userDocuments.map((doc) => {
                const isSigned = doc.firma;
                const documentUrl = isSigned
                  ? `${BASEURL}/${doc.url}` // URL para documento firmado
                  : `${BASEURL}/${doc.documento.url}`; // URL para documento sin firmar

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
                      <button
                        className="table-button"
                        onClick={() => openModal(documentUrl, true, isSigned)}
                      >
                        Ver Documento
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="tables-container">
        <h2>Documentacion asignada al grupo</h2>
        {groupDocuments.length === 0 ? (
          <p>No hay documentos asignados a este grupo.</p>
        ) : (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Descripción</th>
                <th>Fecha de Subida</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {groupDocuments.map((doc) => (
                <tr key={doc?.documento?.id}>
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
                    <button
                      className="table-button"
                      onClick={() =>
                        openModal(`${BASEURL}/${doc?.documento?.url}`)
                      }
                    >
                      Ver Documento
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="tables-container">
        <h2>Documentacion asignada al departamento</h2>
        {departmentDocuments.length === 0 ? (
          <p>No hay documentos asignados a este departamento.</p>
        ) : (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Descripción</th>
                <th>Fecha de Subida</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {departmentDocuments.map((doc) => (
                <tr key={doc?.documento?.id}>
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
                    <button
                      className="table-button"
                      onClick={() =>
                        openModal(`${BASEURL}/${doc?.documento?.url}`)
                      }
                    >
                      Ver Documento
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de firma */}
      {isModalOpen && (
        <div className="modalOverPage">
          <div className="modalContent">
            <SignatureModal
              previewUrl={previewUrl}
              closeModal={closeModal}
              handleSignDocument={handleSignDocument}
              documentName={documentName}
              isSigned={
                userDocuments.find(
                  (doc) => doc.documento.nombre === documentName
                )?.firma || false
              }
              isSignable={isSignable}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentacionUserPage;
