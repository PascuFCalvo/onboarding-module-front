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
axios.defaults.baseURL = BASEURL;

const DocumentacionUserPage = () => {
  const [allDocuments, setAllDocuments] = useState([]);
  const [groupedDocuments, setGroupedDocuments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
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
      fetchAllDocuments();
    }
  }, [userId, grupoId, departamentoId]);

  const fetchAllDocuments = async () => {
    try {
      const sociedadId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      ).sociedadId;

      const sociedadRes = await getDocumentacionPorSociedad(sociedadId);
      const userRes = await getDocumentosPorUsuarioYsociedad(sociedadId);

      let groupRes = { data: [] };
      let departmentRes = { data: [] };

      try {
        groupRes = await getDocumentosPorGrupoYsociedad(sociedadId);
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error("Error al obtener documentos de grupo:", error);
        }
      }

      try {
        departmentRes = await getDocumentosPorDepartamentoYsociedad(sociedadId);
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error("Error al obtener documentos de departamento:", error);
        }
      }

      const sociedadDocuments = sociedadRes.data.map((doc) => ({
        ...doc,
        tipo: "Sociedad",
      }));
      const userDocuments = userRes.data
        .filter((doc) => doc.usuario.id === userId)
        .map((doc) => ({ ...doc, tipo: "Usuario" }));
      const groupDocuments = groupRes.data
        .filter((doc) => doc.grupo?.id === grupoId)
        .map((doc) => ({ ...doc, tipo: "Grupo" }));
      const departmentDocuments = departmentRes.data
        .filter((doc) => doc.departamento?.id === departamentoId)
        .map((doc) => ({ ...doc, tipo: "Departamento" }));

      const combinedDocuments = [
        ...sociedadDocuments,
        ...userDocuments,
        ...groupDocuments,
        ...departmentDocuments,
      ];

      // Agrupación de documentos por fecha de finalización
      const groupedByDate = combinedDocuments.reduce((acc, doc) => {
        const date = doc.documento?.periodo || doc.documentacion?.periodo;
        const formattedDate = date
          ? new Date(date).toLocaleDateString()
          : "Sin Fecha";
        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(doc);
        return acc;
      }, {});

      setGroupedDocuments(groupedByDate);
    } catch (error) {
      console.error("Error al obtener documentos generales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (date) => {
    setOpenSections((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const openModal = (url, isUserDocument = false, isSigned = false) => {
    const documentName = url.split("/").pop();

    if (isUserDocument) {
      setIsSignable(!isSigned);
    } else {
      setIsSignable(false);
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

      setAllDocuments((prevDocuments) =>
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
      <h2>ONBOARDING</h2>
      {Object.keys(groupedDocuments).length === 0 ? (
        <p>No hay documentos disponibles.</p>
      ) : (
        Object.keys(groupedDocuments).map((date) => (
          <div key={date} style={{ marginBottom: "1rem" }}>
            <h3
              onClick={() => toggleSection(date)}
              style={{ cursor: "pointer" }}
            >
              {openSections[date] ? "▼" : "►"} {date}
            </h3>
            {openSections[date] && (
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Firmado</th>
                    <th>Documentacion</th>
                    <th>Link Curso</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedDocuments[date].map((doc, index) => {
                    const documentData = doc.documento || doc.documentacion;
                    const isSigned = doc.firma || false;
                    const documentUrl = documentData?.url
                      ? `${BASEURL}/${documentData.url}`
                      : null;
                    const key = `${doc.id}-${index}`; // Clave única

                    return (
                      <tr key={key}>
                        <td>{documentData?.nombre || "No disponible"}</td>
                        <td>{documentData?.descripcion || "No disponible"}</td>
                        <td>{doc.tipo}</td>
                        <td style={{ color: isSigned ? "green" : "red" }}>
                          {isSigned ? "Sí" : "No"}
                        </td>
                        <td>
                          {documentUrl ? (
                            <button
                              className="table-button"
                              onClick={() =>
                                openModal(
                                  documentUrl,
                                  doc.tipo === "Usuario",
                                  isSigned
                                )
                              }
                            >
                              Ver Documento
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {documentData?.linkCourse &&
                          !documentData.linkCourse.includes("null") ? (
                            <a
                              href={documentData.linkCourse}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "var(--color-dark)",
                                textDecoration: "none",
                                alignSelf: "center",
                                justifySelf: "center",
                              }}
                            >
                              LINK CURSO
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}

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
                allDocuments.find(
                  (doc) => doc.documento?.nombre === documentName
                )?.firma || false
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentacionUserPage;
