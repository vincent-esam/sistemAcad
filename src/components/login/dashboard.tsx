import React, { useState, useEffect, Suspense } from "react";
import "../formdoc/style/step1.css";


interface Docente {
  idDocente: number;
  apellidoMaterno: string;
  apellidoPaterno: string;
  nombres: string;
  numeroReferencia: string;
  correo: string;
  telefono: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  ciudadRadicacion: string;
  genero: string;
  direccion: string;
  estado: string;
  fotografia: string;
}

export const Dashboard: React.FC = () => {
  const [idDocente, setIdDocente] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [docenteData, setDocenteData] = useState<Docente | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const formatDate = (date: string) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Genera una URL temporal para mostrar la imagen en el navegador
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSaveInfo = async (newInfo: Docente) => {
    setLoading(true);
    try {
      const response = await fetch("/api/update_postulante", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInfo),
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log("Datos actualizados:", updatedData);
        alert("Datos actualizados con éxito");
      } else {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        alert("Hubo un error al actualizar los datos");
      }
    } catch (error) {
      console.error("Error en el cliente:", error);
      alert("Hubo un error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDocenteData = async () => {
      const docenteId = localStorage.getItem("idDocente");
      if (!docenteId) {
        alert("No se encontró el ID del docente en localStorage");
        return;
      }

      setIdDocente(docenteId);
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:4321/api/docentes/${docenteId}`
        );
        if (!response.ok) throw new Error("Error al obtener datos del docente");
        const data = await response.json();
        setDocenteData(data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocenteData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocenteData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docenteData) {
      handleSaveInfo(docenteData);
    }
  };

  // Cargar los componentes de manera perezosa
  const EstudiosSuperioresList = React.lazy(
    () => import("../formdoc/PostDegreeForm")
  );
  const ExperienciaDocenteManager = React.lazy(
    () => import("../formdoc/CourseForm")
  );
  const HabilidadesBlandasManager = React.lazy(
    () => import("../formdoc/SkillForm")
  );
  const IdiomasManager = React.lazy(() => import("../formdoc/IdiomasManager"));
  const ProduccionesIntelectualesManager = React.lazy(
    () => import("../formdoc/DocentesIntel")
  );

  const openModal = (content: string) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div>
      <div className="Prueba">
      <div className="contenedor1">
  <h1 className="form-title">Contenedor 1</h1>
  {/* Muestra la fotografía actual proveniente de la base de datos */}
  {docenteData?.fotografia && !previewURL && (
    <img src={docenteData.fotografia} alt="Fotografía del docente" style={{ width: '150px', height: '150px' }} />
  )}
  {/* Si se selecciona una nueva foto, muestra la preview */}
  {previewURL && (
    <img src={previewURL} alt="Preview de la foto" style={{ width: '150px', height: '150px' }} />
  )}

          <h1 className="form-title">contenedor1 </h1>
          <div className="form-group">
  <label className="form-label">Fotografía:</label>
  <input
    className="form-input"
    type="file"
    accept="image/*"
    onChange={handleFileChange}
  />
</div>

        </div>

        <div className="contenedor2">
          <h1> contenedor 2</h1>
          <div className="contenedor2-1">
            <h1 className="form-title">contenedor2-1</h1>
          </div>
          <div className="contenedor2-2">
            {/* Contenedor para profile-info y edit-button */}
            <div className="profile-info-edit-container">
              {docenteData && (
                <div className="profile-info">
                  <div>
                    <p className="profile-info-name">
                      {docenteData.nombres} {docenteData.apellidoPaterno}{" "}
                      {docenteData.apellidoMaterno}
                    </p>
                    <p className="profile-info-email">{docenteData.correo}</p>
                    <p className="profile-info-phone">{docenteData.telefono}</p>
                    <p className="profile-info-city">
                      {docenteData.ciudadRadicacion}
                    </p>
                  </div>
                </div>
              )}
              <button
                className="edit-button1"
                onClick={() => setIsEditing(true)}
              ></button>
            </div>

            {/* Profile container debajo de los dos elementos anteriores */}
            <div className="profile-container">
              <div>
                <h1>Agregar Información</h1>
                <div className="buttons-container-perfil">
                  {/* Botones para abrir cada modal */}
                  <button
                    className="animated-button-estudios"
                    onClick={() => openModal("estudios")}
                  >
                    Ver Estudios Superiores
                  </button>
                  <button
                    className="animated-button-experiencia"
                    onClick={() => openModal("experiencia")}
                  >
                    Ver Experiencia Docente
                  </button>
                  <button
                    className="animated-button-habilidades"
                    onClick={() => openModal("habilidades")}
                  >
                    Ver Habilidades Blandas
                  </button>
                  <button
                    className="animated-button-idiomas"
                    onClick={() => openModal("idiomas")}
                  >
                    Ver Idiomas
                  </button>
                  <button
                    className="animated-button-producciones"
                    onClick={() => openModal("producciones")}
                  >
                    Ver Producciones Intelectuales
                  </button>
                </div>
                {/* Modal dinámico */}
                {modalContent && (
  <div className="modaldash">
    <div className="modaldash-content">
      <button onClick={closeModal} className="modaldash-close-button">
        Cerrar
      </button>
      <Suspense fallback={<p>Cargando...</p>}>
        {modalContent === "estudios" && <EstudiosSuperioresList />}
        {modalContent === "experiencia" && <ExperienciaDocenteManager />}
        {modalContent === "habilidades" && <HabilidadesBlandasManager />}
        {modalContent === "idiomas" && <IdiomasManager />}
        {modalContent === "producciones" && <ProduccionesIntelectualesManager />}
      </Suspense>
    </div>
  </div>
)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="modaldash">
          <div className="modaldash-content">
            <h2>Editar Información</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
              {[
                { label: "Nombres", name: "nombres" },
                { label: "Apellido Paterno", name: "apellidoPaterno" },
                { label: "Apellido Materno", name: "apellidoMaterno" },
                { label: "Número de Referencia", name: "numeroReferencia" },
                { label: "Correo", name: "correo", type: "email" },
                { label: "Teléfono", name: "telefono" },
                { label: "Número de Documento", name: "numeroDocumento" },
                { label: "Ciudad de Radicación", name: "ciudadRadicacion" },
                { label: "Género", name: "genero" },
                { label: "Dirección", name: "direccion" },
                { label: "Estado", name: "estado" },
              ].map((field) => (
                <div className="form-group" key={field.name}>
                  <label className="form-label">{field.label}:</label>
                  <input
                    className="form-input"
                    type={field.type || "text"}
                    name={field.name}
                    value={(docenteData as any)[field.name] || ""}
                    onChange={handleInputChange}
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Fecha de Nacimiento:</label>
                <input
                  className="form-input"
                  type="date"
                  name="fechaNacimiento"
                  value={
                    docenteData?.fechaNacimiento
                      ? formatDate(docenteData.fechaNacimiento)
                      : ""
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-guardar">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  className="cancel-button1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
