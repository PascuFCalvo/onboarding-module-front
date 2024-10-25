/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { attachSignatureToDocument } from "../api";

const SignatureModal = ({
  previewUrl,
  documentName,
  closeModal,
  handleSignDocument,
  isSigned,
  isSignable,
}) => {
  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [location, setLocation] = useState(null);
  const [deviceInfo] = useState(navigator.userAgent);
  const [isClearHovered, setIsClearHovered] = useState(false);
  const [isSignHovered, setIsSignHovered] = useState(false);
  const [usuarioId, setUsuarioId] = useState("");
  const [sociedadId, setSociedadId] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const token = localStorage.getItem("token");
  const userInfo = token ? JSON.parse(atob(token.split(".")[1])) : null;

  useEffect(() => {
    if (userInfo) {
      setUsuarioId(userInfo.id);
      setSociedadId(userInfo.sociedadId);
    }
  }, [userInfo]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error obteniendo la geolocalización:", error);
          setLocation({ error: "Geolocalización no disponible" });
        }
      );
    }
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    const timestamp = Date.now();
    setPoints([{ x: offsetX, y: offsetY, timestamp }]);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    const timestamp = Date.now();
    setPoints((prevPoints) => [
      ...prevPoints,
      { x: offsetX, y: offsetY, timestamp },
    ]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();
  };

  const handleCanvasClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setPoints([]);
    setName("");
    setDni("");
  };

  const handleSignatureInfoToAttachtoDocument = async () => {
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL("image/png");

    try {
      const response = await attachSignatureToDocument({
        name,
        dni,
        signatureData,
        usuarioId,
        sociedadId,
        documentName,
      });
      console.log("Documento actualizado con la firma", response.data);
      closeModal();
    } catch (error) {
      console.error("Error al adjuntar la firma:", error);
    }
  };

  const handleSignatureSubmit = () => {
    const signatureId = uuidv4();
    const biometrics = calculateBiometrics();

    const signatureInfo = {
      signatureId,
      name,
      dni,
      signatureData: canvasRef.current.toDataURL("image/png"),
      biometrics,
      user: {
        id: userInfo?.id,
        username: userInfo?.username,
        role: userInfo?.role,
        sociedadId: userInfo?.sociedadId,
        marcaId: userInfo?.marcaId,
      },
      deviceInfo,
      location,
      timestamp: Date.now(),
    };

    handleSignDocument(signatureInfo);
    handleSignatureInfoToAttachtoDocument();
  };

  const calculateBiometrics = () => {
    const biometrics = [];
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currPoint = points[i];
      const dx = currPoint.x - prevPoint.x;
      const dy = currPoint.y - prevPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const dt = currPoint.timestamp - prevPoint.timestamp;
      const speed = dt !== 0 ? distance / dt : 0;
      biometrics.push({ x: currPoint.x, y: currPoint.y, speed });
    }
    return biometrics;
  };

  return (
    <div
      style={{
        position: "relative",
        "margin-top": "5%",
      }}
      className="modal-overlay"
      onClick={closeModal}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={previewUrl}
          title="Document Preview"
          width="100%"
          height="600px"
        />

        {!isSigned && isSignable && (
          <div className="signature-section">
            <input
              type="text"
              placeholder="Nombre del Firmante"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            <canvas
              ref={canvasRef}
              width={300}
              height={150}
              style={{ border: "1px solid #000" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <div>
              <button
                style={{
                  backgroundColor: isClearHovered
                    ? "var(--color-danger-hover)"
                    : "var(--color-danger)",
                  color: "var(--color-light)",
                  padding: "0.5rem",
                  borderRadius: "var(--border-radius)",
                  cursor: "pointer",
                  width: "30%",
                }}
                onMouseEnter={() => setIsClearHovered(true)}
                onMouseLeave={() => setIsClearHovered(false)}
                onClick={handleCanvasClear}
              >
                Borrar Firma
              </button>
            </div>

            <button
              style={{
                backgroundColor: isSignHovered
                  ? "var(--color-success-hover)"
                  : "var(--color-success)",
                color: "var(--color-light)",
                padding: "0.5rem",
                borderRadius: "var(--border-radius)",
                cursor: "pointer",
                width: "30%",
              }}
              onMouseEnter={() => setIsSignHovered(true)}
              onMouseLeave={() => setIsSignHovered(false)}
              onClick={handleSignatureSubmit}
            >
              Firmar
            </button>
          </div>
        )}
      </div>
      <button
        style={{
          backgroundColor: isHovered
            ? "var(--color-danger-hover)"
            : "var(--color-danger)",
          color: "var(--color-light)",
          padding: "0.5rem",
          borderRadius: "var(--border-radius)",
          cursor: "pointer",
          width: "4%",
          alignSelf: "flex-end",
          position: "absolute",
          top: "-65px",
          right: "0",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={closeModal}
      >
        X
      </button>
    </div>
  );
};

export default SignatureModal;
