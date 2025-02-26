import React, { useEffect, useState } from "react";
import "../formdoc/style/SkillSoft.css"; // Archivo CSS para estilos

interface HabilidadBlanda {
  idHabilidadBlanda: number;
  habilidad: string;
}

const HabilidadesBlandasManager: React.FC = () => {
  // Nota: Si la API pudiera devolver elementos nulos, definimos el estado como array de (HabilidadBlanda | null)
  const [idDocente, setIdDocente] = useState<number | null>(null);
  const [habilidadesBlandas, setHabilidadesBlandas] = useState<(HabilidadBlanda | null)[]>([]);
  const [editingHabilidad, setEditingHabilidad] = useState<HabilidadBlanda | null>(null);
  const [newHabilidades, setNewHabilidades] = useState<string[]>([]); // Varias habilidades nuevas
  const [modalType, setModalType] = useState<"edit" | "add" | null>(null); // Tipo de modal
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDocenteData = async () => {
      const docenteId = localStorage.getItem("idDocente");
      if (!docenteId) {
        alert("No se encontró el ID del docente en localStorage");
        return;
      }

      setIdDocente(Number(docenteId));
      setLoading(true);

      try {
        const response = await fetch(`http://localhost:4321/api/docentes/${docenteId}`);
        if (!response.ok) throw new Error("Error al obtener datos del docente");

        const data = await response.json();
        // Se asume que la API devuelve la propiedad "habilidades_blandas"
        setHabilidadesBlandas(data.habilidades_blandas || []);
      } catch (error) {
        console.error("Error al obtener las habilidades blandas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocenteData();
  }, []);

  const handleEdit = (habilidad: HabilidadBlanda) => {
    setEditingHabilidad(habilidad);
    setModalType("edit");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idDocente || !editingHabilidad) return;

    try {
      const response = await fetch(`/api/skill/skillput`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idDocente,
          habilidadesBlandas: [editingHabilidad],
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar la habilidad");

      // Actualizamos el estado local reemplazando la habilidad editada
      setHabilidadesBlandas((prev) =>
        prev.map((h) =>
          h && h.idHabilidadBlanda === editingHabilidad.idHabilidadBlanda
            ? { ...h, habilidad: editingHabilidad.habilidad }
            : h
        )
      );

      setModalType(null);
      alert("Habilidad actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la habilidad:", error);
    }
  };

  const handleAddNewHabilidad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idDocente || newHabilidades.length === 0) {
      alert("Debe agregar al menos una habilidad válida.");
      return;
    }

    try {
      const response = await fetch(`/api/skill/skillpost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idDocente,
          habilidadesBlandas: newHabilidades,
        }),
      });

      if (!response.ok) throw new Error("Error al agregar la nueva habilidad");

      // Se esperan los nuevos IDs de las habilidades agregadas
      const newHabilidadesIds = await response.json();

      const newSkills = newHabilidades.map((habilidad, index) => ({
        idHabilidadBlanda: newHabilidadesIds[index],
        habilidad,
      }));

      setHabilidadesBlandas((prev) => [...prev, ...newSkills]);
      setNewHabilidades([]);
      setModalType(null);
      alert("Habilidades agregadas correctamente");
    } catch (error) {
      console.error("Error al agregar habilidades:", error);
    }
  };

  return (
    <div className="habilidades-manager">
      <h1>Gestión de Habilidades Blandas</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="habilidades-container">
          {/* Se filtran los elementos nulos antes de mapear */}
          {habilidadesBlandas.filter((h) => h !== null).map((habilidad) => (
            <div className="habilidad-card" key={habilidad!.idHabilidadBlanda}>
              <p>{habilidad!.habilidad}</p>
              <button className="edit-btn" onClick={() => handleEdit(habilidad!)}>
                Editar
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="add-btn" onClick={() => setModalType("add")}>
        Agregar Habilidades
      </button>

      {/* Modal para editar */}
      {modalType === "edit" && editingHabilidad && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Habilidad</h2>
            <form onSubmit={handleUpdate}>
              <label>
                Habilidad:
                <input
                  type="text"
                  value={editingHabilidad.habilidad}
                  onChange={(e) =>
                    setEditingHabilidad({ ...editingHabilidad, habilidad: e.target.value })
                  }
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setModalType(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para agregar */}
      {modalType === "add" && (
        <div className="modal">
          <div className="modal-content">
            <h2>Agregar Habilidades</h2>
            <form onSubmit={handleAddNewHabilidad}>
              {newHabilidades.map((habilidad, index) => (
                <div key={index} className="new-habilidad">
                  <input
                    type="text"
                    value={habilidad}
                    onChange={(e) => {
                      const updatedHabilidades = [...newHabilidades];
                      updatedHabilidades[index] = e.target.value;
                      setNewHabilidades(updatedHabilidades);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedHabilidades = newHabilidades.filter((_, i) => i !== index);
                      setNewHabilidades(updatedHabilidades);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setNewHabilidades([...newHabilidades, ""])}
              >
                Agregar Más
              </button>
              <div className="modal-actions">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setModalType(null)}>
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

export default HabilidadesBlandasManager;
