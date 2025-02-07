
import React, { useState, useEffect } from "react";
import './style/IdiomasManager.css';
import IdiomasSelect from "../perfil-doc/IdiomasSelect";


interface Idioma {
  idIdiomaDocente?: string; // Solo necesario para PUT
  idIdioma: string;
  idioma: string; // Agregar campo idioma
  escritura: number; // Cambiar tipo a número
  oral: number; // Cambiar tipo a número
  lectura: number; // Cambiar tipo a número
  escucha: number; // Cambiar tipo a número
}

interface DocenteData {
  idDocente: string;
  idiomas: Idioma[];
}

const IdiomasManager: React.FC = () => {
  const [docenteData, setDocenteData] = useState<DocenteData | null>(null);
  const [newIdioma, setNewIdioma] = useState<Idioma>({
    idIdioma: "",
    idioma: "", // Agregar campo idioma
    escritura: 1, // Valor predeterminado (Bajo)
    oral: 1, // Valor predeterminado (Bajo)
    lectura: 1, // Valor predeterminado (Bajo)
    escucha: 1, // Valor predeterminado (Bajo)
  });
  const [selectedIdioma, setSelectedIdioma] = useState<Idioma | null>(null);
  const [idDocente, setIdDocente] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false); // Estado para la modal de agregar idioma
  const [showEditModal, setShowEditModal] = useState<boolean>(false); // Estado para la modal de editar idioma

  // Cargar datos del docente al montar el componente
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

  // Manejar cambios en el nuevo idioma
  const handleNewIdiomaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIdioma({ ...newIdioma, [name]: parseInt(value) }); // Convertir el valor a número
  };

  // Manejar cambios en el idioma seleccionado para editar
  const handleEditIdiomaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedIdioma) {
      const { name, value } = e.target;
      setSelectedIdioma({ ...selectedIdioma, [name]: parseInt(value) }); // Convertir el valor a número
    }
  };

  // Abrir modal de agregar idioma
  const openAddModal = () => {
    setNewIdioma({
      idioma: "", // Agregar campo idioma
      idIdioma: "",
      escritura: 1, // Valor predeterminado (Bajo)
      oral: 1, // Valor predeterminado (Bajo)
      lectura: 1, // Valor predeterminado (Bajo)
      escucha: 1, // Valor predeterminado (Bajo)
    });
    setShowAddModal(true);
  };

  // Cerrar modal de agregar idioma
  const closeAddModal = () => {
    setShowAddModal(false);
  };

  // Abrir modal de editar idioma
  const openEditModal = (idioma: Idioma) => {
    setSelectedIdioma(idioma);
    setShowEditModal(true);
  };

  // Cerrar modal de editar idioma
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // Crear un nuevo idioma (POST)
  const handleAddIdioma = async () => {
    if (!idDocente) {
      alert("No se encontró el ID del docente");
      return;
    }

    try {
      const response = await fetch("/api/idiomasdoc/idiomasdocpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idDocente,
          idiomas: [newIdioma],
        }),
      });

      if (!response.ok) throw new Error("Error al crear el idioma");

      // Recargar datos después de agregar
      alert("Idioma creado con éxito");
      setNewIdioma({
        idioma: "", // Agregar campo idioma
        idIdioma: "",
        escritura: 1,
        oral: 1,
        lectura: 1,
        escucha: 1,
      });
      const updatedData = await response.json();
      setDocenteData(updatedData);
      closeAddModal();
    } catch (error) {
      console.error("Error al agregar idioma:", error);
    }
  };

  // Actualizar un idioma (PUT)
  const handleUpdateIdioma = async () => {
    if (!idDocente || !selectedIdioma) {
      alert("No se encontró el ID del docente o el idioma seleccionado");
      return;
    }

    try {
      const response = await fetch("/api/idiomasdoc/idiomasdocput", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idDocente,
          idiomas: [selectedIdioma],
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar el idioma");

      // Recargar datos después de actualizar
      alert("Idioma actualizado con éxito");
      const updatedData = await response.json();
      setDocenteData(updatedData);
      closeEditModal();
    } catch (error) {
      console.error("Error al actualizar idioma:", error);
    }
  };

  const getLevelText = (level: string | number | undefined) => {
    const numLevel = Number(level); // Convertir a número
  
    switch (numLevel) {
      case 3:
        return "Alto";
      case 2:
        return "Medio";
      case 1:
        return "Bajo";
      default:
        return "No especificado";  // Si no es un número válido, devolvemos "No especificado"
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="idiomas-manager">
      <h1>Gestión de Idiomas</h1>
        <button onClick={openAddModal} className="button add-button">Agregar Idioma</button>

      {/* Lista de idiomas */}
      <div className="idiomas-list">
  {docenteData?.idiomas.map((idioma) => (
    <div key={idioma.idIdiomaDocente} className="idioma-card">
      <p><strong>Idioma:</strong> {idioma.idioma}</p>
      <p><strong>Escritura:</strong> {getLevelText(idioma.escritura)}</p>
      <p><strong>Oral:</strong> {getLevelText(idioma.oral)}</p>
      <p><strong>Lectura:</strong> {getLevelText(idioma.lectura)}</p>
      <p><strong>Escucha:</strong> {getLevelText(idioma.escucha)}</p>
      <button onClick={() => openEditModal(idioma)} className="button edit-button">Editar</button>
    </div>
  ))}
</div>



      {/* Modal de Agregar Idioma */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Agregar Nuevo Idioma</h2>
            <IdiomasSelect
              selectedIdioma={{ id: parseInt(newIdioma.idIdioma), name: newIdioma.idioma }}
              onIdiomaChange={(selected) => setNewIdioma({ ...newIdioma, idIdioma: selected.id.toString(), idioma: selected.name })}
              valueAndId="idIdioma"
              selected={newIdioma.idioma}
              selectedId={parseInt(newIdioma.idIdioma)}
            />

            {/* Checkboxes para los niveles */}
            {["escritura", "oral", "lectura", "escucha"].map((field) => (
              <div key={field} className="checkbox-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {["Alto", "Medio", "Bajo"].map((level, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      name={field}
                      value={3 - index}
                      checked={newIdioma[field as keyof Idioma] === 3 - index}
                      onChange={handleNewIdiomaChange}
                    />
                    <label>{level}</label>
                  </div>
                ))}
              </div>
            ))}

            <button onClick={handleAddIdioma}>Agregar</button>
            <button onClick={closeAddModal}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de Editar Idioma */}
      {showEditModal && selectedIdioma && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Idioma</h2>
            <input
              type="text"
              name="idIdioma"
              placeholder="ID Idioma"
              value={selectedIdioma.idIdioma}
              onChange={handleEditIdiomaChange}
              disabled
            />

            {/* Checkboxes para los niveles */}
            {["escritura", "oral", "lectura", "escucha"].map((field) => (
              <div key={field} className="checkbox-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {["Alto", "Medio", "Bajo"].map((level, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      name={field}
                      value={3 - index}
                      checked={selectedIdioma[field as keyof Idioma] === 3 - index}
                      onChange={handleEditIdiomaChange}
                    />
                    <label>{level}</label>
                  </div>
                ))}
              </div>
            ))}

            <button onClick={handleUpdateIdioma}>Actualizar</button>
            <button onClick={closeEditModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdiomasManager;
