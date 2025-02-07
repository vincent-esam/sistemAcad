
import { ScheduleMeeting } from "./agendarReu/ScheduleMeeting";

export function ReprogramMeetingButton({ telefono, email, fecha, link, idDocente }) {
  const [showScheduler, setShowScheduler] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseScheduler = () => {
    setShowScheduler(false); // Cierra el modal
  };

  const handleReprogramarClick = async () => {
    setIsLoading(true); // Activa el estado de carga
    try {
      // Simula una operación asincrónica (por ejemplo, una llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowScheduler(true); // Abre el modal después de la "operación"
    } catch (error) {
      // Manejo de error si es necesario
      console.error("Error al reprogramar reunión:", error);
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <div className="schedule-meeting">
      {/* Verifica si está en carga */}
      {isLoading && <p>Cargando...</p>}

      {/* Botón de "Reprogramar Reunión" */}
      <button
        className="v-btn v-btn--slim v-theme--light"
        onClick={handleReprogramarClick}
        disabled={isLoading} // Deshabilitar si está en carga
      >
        Reprogramar Reunión
      </button>

      {/* Mostrar modal de ScheduleMeeting cuando sea necesario */}
      {showScheduler && (
        <ScheduleMeeting
          telefono={telefono}
          email={email}
          fechaInicial={fecha} // Prellenado
          linkInicial={link} // Prellenado
          setShowScheduler={handleCloseScheduler}
          idDocente={idDocente}
          isUpdate={true} // Indica que es una reprogramación
        />
      )}
    </div>
  );
}
