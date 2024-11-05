// src/components/preDocumentacionManagement/PreDocumentacionManagement.jsx
import { Route, Routes } from "react-router-dom";
import DocumentacionManagementPage from "../documentacionManagement/DocumentacionManagementPage";
import DocumentacionUserPage from "../documentacionUser/documentacionUser";
import { Link } from "react-router-dom";

const PreDocumentacionManagement = () => {
  return (
    <>
      <div>
        <Routes>
          <Route
            path="vistaManager"
            element={<DocumentacionManagementPage />}
          />
          <Route path="vistaUser" element={<DocumentacionUserPage />} />
        </Routes>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          alignItems: "center",
          backgroundColor: "var(--color-light)",
        }}
      >
        <div style={
          {
            display: "flex",
            justifyContent: "center",
            margin: "40px",
            flexDirection: "column",
            width: "50%",
            height: "50%",
            alignItems: "center",
            backgroundColor: "var(--color-light)",
          }
        }>
          {" "}
          <button
            style={{
              "max-width": "300px",
              padding: "20px",
              backgroundColor: "var(--color-secondary)",
            }}
          >
            <Link to="vistaManager">Vista Manager</Link>
          </button>
          <button
            style={{
              "max-width": "300px",
              padding: "20px",
              backgroundColor: "var(--color-secondary)",
            }}
          >
            <Link to="vistaUser">Vista User</Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default PreDocumentacionManagement;
