import React, { useState, useEffect } from "react";
import "../formdoc/style/Form2.css";
import CountrySelect from "../perfil-doc/CountrySelect";
import ModalidadesSelect from "../perfil-doc/ModalidadesSelect";
import GradosSelect from "../perfil-doc/GradosSelect";
import TypesSelect from "../perfil-doc/TipoEstudios";

interface EstudioSuperior {
  idEstudio: number | null; // null para nuevos registros
  universidad: string;
  carrera: string;
  fecha: string;
  nombre: string;
  idPais: number;
  pais: string;
  idGrado: number;
  gradoTipo: string;
  idModalidad: number;
  modalidad: string;
  idTipoEstudios: number;
  tipoEstudios: string;
}

interface DocenteData {
  idDocente: number;
  estudiossuperiores: EstudioSuperior[];
}

const FormularioDocente: React.FC = () => {
  const [docenteData, setDocenteData] = useState<DocenteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false); // Controla si se muestran todas las cards
  const [selectedEstudio, setSelectedEstudio] = useState<EstudioSuperior | null>(null);

  // Cargar datos del docente
  useEffect(() => {
    const fetchDocenteData = async () => {
      const docenteId = localStorage.getItem("idDocente");
      if (!docenteId) {
        console.error("No se encontró el idDocente en el localStorage.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:4321/api/docentes/${docenteId}`);
        if (!response.ok) {
          throw new Error("Error al obtener datos del docente");
        }

        const data: DocenteData = await response.json();
        setDocenteData(data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocenteData();
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  // Si no se pudo obtener la data, mostramos un mensaje de error
  if (!docenteData) {
    return <p>Error: No se pudieron cargar los datos del docente.</p>;
  }

  const { idDocente, estudiossuperiores } = docenteData;

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (selectedEstudio) {
      setSelectedEstudio({
        ...selectedEstudio,
        [field]: e.target.value,
      });
    }
  };

  // Guardar el estudio (nuevo o actualizado)
  const handleSave = async () => {
    if (!selectedEstudio) return;

    try {
      if (selectedEstudio.idEstudio === null) {
        // Crear nuevo estudio
        const response = await fetch(`/api/estudiossuppost`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idDocente, // Incluimos el ID del docente
            estudiossuperiores: [
              {
                universidad: selectedEstudio.universidad,
                carrera: selectedEstudio.carrera,
                fecha: selectedEstudio.fecha,
                nombre: selectedEstudio.nombre,
                idPais: Number(selectedEstudio.idPais),
                idGrado: Number(selectedEstudio.idGrado),
                idModalidad: Number(selectedEstudio.idModalidad),
                idTipoEstudio: Number(selectedEstudio.idTipoEstudios),
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Error al crear el estudio");
        }

        const result = await response.json();
        setMessage(result.message || "Estudio creado correctamente");

        // Actualizar el estado con el ID del nuevo estudio
        setDocenteData((prevData) =>
          prevData
            ? {
                ...prevData,
                estudiossuperiores: prevData.estudiossuperiores.map((e) =>
                  e === selectedEstudio ? { ...selectedEstudio, idEstudio: result.idEstudio } : e
                ),
              }
            : null
        );
      } else {
        // Actualizar estudio existente
        const response = await fetch(`/api/estudiossup`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idDocente,
            idEstudioSuperior: selectedEstudio.idEstudio,
            updateFields: {
              universidad: selectedEstudio.universidad,
              carrera: selectedEstudio.carrera,
              fecha: selectedEstudio.fecha,
              nombre: selectedEstudio.nombre,
              idPais: selectedEstudio.idPais,
              idGrado: selectedEstudio.idGrado,
              idModalidad: selectedEstudio.idModalidad,
              idTipoEstudio: selectedEstudio.idTipoEstudios,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el estudio");
        }

        const result = await response.json();
        setMessage(result.message || "Estudio actualizado correctamente");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al guardar el estudio");
    } finally {
      setSelectedEstudio(null);
    }
  };

  // Crear un nuevo registro vacío y abrir la modal para creación
  const handleCreate = () => {
    const nuevoEstudio: EstudioSuperior = {
      idEstudio: null, // null indica que es un nuevo registro no guardado en la base de datos
      universidad: "",
      carrera: "",
      fecha: "",
      nombre: "",
      idPais: 0,
      pais: "",
      idGrado: 0,
      gradoTipo: "",
      idModalidad: 0,
      modalidad: "",
      idTipoEstudios: 0,
      tipoEstudios: "",
    };

    setSelectedEstudio(nuevoEstudio);
  };

  // Alternar visibilidad de todos los estudios (cards)
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className="postdegreeform-container">
      <h3 className="form-title">Información del Docente</h3>

      {/* Renderizar el botón "Mostrar más" solo si hay más de 3 estudios */}
      {estudiossuperiores.length > 3 && (
        <button className="toggle-button1" onClick={toggleShowAll}>
          {showAll ? "Mostrar menos" : "Mostrar más"}
        </button>
      )}

      {/* Botón para crear un nuevo estudio, siempre visible */}
      <button className="create-button1" onClick={handleCreate}>
        Crear Nuevo Estudio
      </button>
      <p hidden>ID Docente: {idDocente}</p>

      {/* Si no hay estudios, se muestra un mensaje informativo */}
      {estudiossuperiores.filter(estudio => estudio !== null).length === 0 ? (
  <p>No hay estudios para mostrar. Por favor, crea uno nuevo.</p>
) : (
  estudiossuperiores
    .filter(estudio => estudio !== null)
    .slice(0, showAll ? estudiossuperiores.length : 2)
    .map((estudio, index) => (
      <div key={index} className="study-card">
        <h4 className={`study-title ${estudio.idEstudio ? "hidden" : ""}`}>
          Estudio Superior #{estudio.idEstudio || "Nuevo"}
        </h4>
        <div className="study-fields">
          <p>
            <strong>Universidad:</strong> {estudio.universidad}
          </p>
          <p>
            <strong>Carrera:</strong> {estudio.carrera}
          </p>
          <p>
            <strong>Fecha:</strong> {estudio.fecha}
          </p>
          <p>
            <strong>Nombre:</strong> {estudio.nombre}
          </p>
          <p>
            <strong>País:</strong> {estudio.pais}
          </p>
          <p>
            <strong>Grado:</strong> {estudio.gradoTipo}
          </p>
          <p>
            <strong>Modalidad:</strong> {estudio.modalidad}
          </p>
          <p>
            <strong>Tipo de Estudios:</strong> {estudio.tipoEstudios}
          </p>
        </div>
        <button className="edit-button2" onClick={() => setSelectedEstudio(estudio)}>
          Editar
        </button>
      </div>
    ))
)}
      {message && <p className="message-text">{message}</p>}

      {/* Modal para editar o crear un estudio */}
      {selectedEstudio && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-title">
              <h4>Editar Estudio</h4>
            </div>
            <div>
              <label>Universidad:</label>
              <input
                className="custom-input"
                type="text"
                value={selectedEstudio.universidad}
                onChange={(e) => handleChange(e, "universidad")}
              />
            </div>
            <div>
              <label>Carrera:</label>
              <input
                className="custom-input"
                type="text"
                value={selectedEstudio.carrera}
                onChange={(e) => handleChange(e, "carrera")}
              />
            </div>
            <div>
              <label>Fecha:</label>
              <input
                className="custom-input"
                type="date"
                value={selectedEstudio.fecha}
                onChange={(e) => handleChange(e, "fecha")}
              />
            </div>
            <div>
              <label>Nombre:</label>
              <input
                className="custom-input"
                type="text"
                value={selectedEstudio.nombre}
                onChange={(e) => handleChange(e, "nombre")}
              />
            </div>
            <div>
              <CountrySelect
                valueAndId="idPais"
                selectedId={selectedEstudio.idPais}
                selected={selectedEstudio.pais}
                selectedCountry={{
                  id: selectedEstudio.idPais,
                  name: selectedEstudio.pais,
                }}
                onCountryChange={(selectedCountry) => {
                  setSelectedEstudio((prev) =>
                    prev
                      ? {
                          ...prev,
                          idPais: selectedCountry.id,
                          pais: selectedCountry.name,
                        }
                      : null
                  );
                }}
              />
            </div>
            <div>
              <GradosSelect
                valueAndId="idGrado"
                selectedId={selectedEstudio.idGrado}
                selected={selectedEstudio.gradoTipo}
                selectedGrado={{
                  id: selectedEstudio.idGrado,
                  name: selectedEstudio.gradoTipo,
                }}
                onGradoChange={(selectedGrado) => {
                  setSelectedEstudio((prev) =>
                    prev
                      ? {
                          ...prev,
                          idGrado: selectedGrado.id,
                          gradoTipo: selectedGrado.name,
                        }
                      : null
                  );
                }}
              />
            </div>
            <div>
              <ModalidadesSelect
                valueAndId="idModalidad"
                selectedId={selectedEstudio.idModalidad}
                selected={selectedEstudio.modalidad}
                selectedModalidad={{
                  id: selectedEstudio.idModalidad,
                  name: selectedEstudio.modalidad,
                }}
                onModalidadChange={(selectedModalidad) => {
                  setSelectedEstudio((prev) =>
                    prev
                      ? {
                          ...prev,
                          idModalidad: selectedModalidad.id,
                          modalidad: selectedModalidad.name,
                        }
                      : null
                  );
                }}
              />
            </div>
            <div>
              <TypesSelect
                valueAndId="idTipoEstudio"
                selectedTypes={{
                  id: selectedEstudio.idTipoEstudios,
                  name: selectedEstudio.tipoEstudios,
                }}
                onTypesChange={(selectedType) => {
                  setSelectedEstudio((prev) =>
                    prev
                      ? {
                          ...prev,
                          idTipoEstudios: selectedType.id,
                          tipoEstudios: selectedType.name,
                        }
                      : null
                  );
                }}
              />
            </div>
            <button className="save-button" onClick={handleSave}>
              Guardar
            </button>
            <button className="cancel-button" onClick={() => setSelectedEstudio(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormularioDocente;
