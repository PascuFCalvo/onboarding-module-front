import { useState, useEffect } from "react";

const UserConfiguracion = () => {
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [colorAcentoPrimario, setColorAcentoPrimario] = useState("#000000");
  const [colorAcentoSecundario, setColorAcentoSecundario] = useState("#000000");
  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState("M");
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");
  const [sociedadId, setSociedadId] = useState(null);

  // Obtener la sociedad
  useEffect(() => {
    fetchSociedad();
  }, []);

  const fetchSociedad = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token no encontrado");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const sociedadId = decodedToken.sociedadId;
      setSociedadId(sociedadId); // Establece el ID de la sociedad en el estado
    } catch (error) {
      setError("No se pudo obtener la sociedad: " + error.message);
    }
  };

  // Guardar la configuración
  const saveConfig = async () => {
    if (!sociedadId) {
      setError("ID de sociedad no encontrado");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token no encontrado");
        return;
      }

      const config = {
        primaryColor,
        secondaryColor,
        colorAcentoPrimario,
        colorAcentoSecundario,
        font,
        fontSize,
      };

      const formData = new FormData();
      formData.append("config", JSON.stringify(config));
      formData.append("logo", logo);
      formData.append("sociedadId", sociedadId);

      // Aquí es donde harías la llamada al backend para guardar los datos
      console.log(formData.get("config"));
      console.log(formData.get("logo"));
      console.log(formData.get("sociedadId"));

      setError("");
      alert("Configuración guardada exitosamente");
    } catch (error) {
      setError("No se pudo guardar la configuración: " + error.message);
    }
  };

  return (
    <div className="config-container">
      <h1>Configura tu sociedad</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="color-picker-group">
        <label>Color primario</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />

        <label>Color secundario</label>
        <input
          type="color"
          value={secondaryColor}
          onChange={(e) => setSecondaryColor(e.target.value)}
        />

        <label>Color acento primario</label>
        <input
          type="color"
          value={colorAcentoPrimario}
          onChange={(e) => setColorAcentoPrimario(e.target.value)}
        />

        <label>Color acento secundario</label>
        <input
          type="color"
          value={colorAcentoSecundario}
          onChange={(e) => setColorAcentoSecundario(e.target.value)}
        />
      </div>

      <br />
      <label>Fuente</label>
      <select value={font} onChange={(e) => setFont(e.target.value)}>
        <option value="Arial" style={{ fontFamily: "Arial" }}>
          Arial
        </option>
        <option value="Helvetica" style={{ fontFamily: "Helvetica" }}>
          Helvetica
        </option>
        <option value="Trebuchet MS" style={{ fontFamily: "Trebuchet MS" }}>
          Trebuchet MS
        </option>
        <option
          value="Times New Roman"
          style={{ fontFamily: "Times New Roman" }}
        >
          Times New Roman
        </option>
        <option value="Courier New" style={{ fontFamily: "Courier New" }}>
          Courier New
        </option>
        <option
          value="Brush Script MT"
          style={{ fontFamily: "Brush Script MT" }}
        >
          Brush Script MT
        </option>
        <option value="Roboto" style={{ fontFamily: "Roboto" }}>
          Roboto
        </option>
        <option value="Comic Sans" style={{ fontFamily: "Comic Sans MS" }}>
          Comic Sans
        </option>
      </select>

      <label>Tamaño de fuente</label>
      <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
        <option value="S">Pequeño</option>
        <option value="M">Mediano</option>
        <option value="L">Grande</option>
      </select>

      <label>Logo</label>
      <input type="file" onChange={(e) => setLogo(e.target.files[0])} />

      <button onClick={saveConfig}>Guardar</button>
    </div>
  );
};

export default UserConfiguracion;
