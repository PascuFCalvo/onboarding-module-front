//en construccion

const Table = ({
  title,
  data,
  columns,
  isHidden,
  toggleHidden,
  onViewClick,
}) => (
  <div className="tables-container">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <h2 style={{ margin: 0, alignSelf: "flex-end" }}>{title}</h2>
      <button
        style={{
          backgroundColor: isHidden
            ? "var(--color-info-hover)"
            : "var(--color-info)",
          color: "var(--color-light)",
          borderRadius: "var(--border-radius)",
          cursor: "pointer",
          fontSize: "1.2rem",
          width: "3rem",
        }}
        onClick={toggleHidden}
      >
        {isHidden ? "▼" : "▲"}
      </button>
    </div>
    <div
      style={{
        maxHeight: isHidden ? 0 : "500px",
        overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}
    >
      {data.length === 0 ? (
        <p>No hay documentos disponibles.</p>
      ) : (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((doc) => (
              <tr key={doc?.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(doc) : doc[col.key]}
                  </td>
                ))}
                <td>
                  <button
                    className="table-button"
                    onClick={() => onViewClick(doc)}
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
  </div>
);

export default Table;
