
import { Modal } from '../util/modale';// Asegúrate de importar el modal reutilizable
import "../../styles/postulantes.css";

export const AprobarRechazarDocente = ({ postulanteId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Para manejar la apertura del modal
  const [action, setAction] = useState(""); // Para saber si se va a aprobar o rechazar

  const handleAction = (actionType) => {
    setAction(actionType);
    setIsModalOpen(true); // Abrir el modal
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch("/api/docentes/updateEstadoDocente", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idDocente: postulanteId,
          estado: action.toLowerCase(),
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert(`El docente ha sido ${action === "rechazado" ? "rechazado" : "aprobado"} exitosamente.`);
      } else {
        alert(`Hubo un problema al actualizar el estado del docente: ${responseData.error}`);
      }
    } catch (error) {
      console.error("Error al actualizar el estado del docente:", error);
      alert("No se pudo procesar la solicitud. Intenta nuevamente.");
    } finally {
      setIsModalOpen(false); // Cerrar el modal después de la acción
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Cerrar el modal sin hacer nada
  };

  return (
    <div className="buttonsCont">
      <button
        className="approve-button custom-button"
        onClick={() => handleAction("aprobado")}
      >
        <div className="icon-circle">
          <img src="/images/iconos/check.png" alt="Aprobar" className="icon-button" />
        </div>
        <span className="button-text">Aprobar</span>
      </button>

      <button
        className="reject-button custom-button"
        onClick={() => handleAction("rechazado")}
      >
        <div className="icon-circle">
          <img src="/images/iconos/rechazar.png" alt="Rechazar" className="icon-button" />
        </div>
        <span className="button-text">Rechazar</span>
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCancel} title="Confirmación de acción">
        <p>¿Estás seguro de {action === "aprobado" ? "aprobar" : "rechazar"} este docente?</p>
        <div className="modal-buttons">
          <button onClick={handleConfirm} className="v-btn">Aceptar</button>
          <button onClick={handleCancel} className="v-btn cancel-btn">Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};
