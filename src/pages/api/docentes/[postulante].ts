import { connectToDatabase } from "../../../utils/dbConect";
import type { APIContext } from "astro";
import type { RowDataPacket } from "mysql2";


interface EstudioSuperior {
  idEstudio: string;
  carrera: string;
  nombre: string;
  universidad: string;
  pais: string;
  fecha: string;
  modalidad: string;
  gradoTipo: string;
}

interface ExperienciaDocente {
  idExperiencia: string;
  materia: string;
  calidad: string;
  universidad: string;
  concluidoEl: string;
}

interface Idioma {
  idIdiomaDocente: string;
  idioma: string;
  escritura: string;
  oral: string;
  lectura: string;
  escucha: string;
}

interface HabilidadBlanda {
  idHabilidadBlanda: string;
  habilidad: string;
}

interface ExperienciaLaboral {
  idExperienciaLaboral: string;
  nombreEmpresa: string;
  cargo: string;
  ciudad: string;
  fechaInicio: string;
  fechaFinal: string;
  pais: string;
  descripcion: string;
  referencia: {
    idReferencia: string;
    nombreCompleto: string;
    cargo: string;
    numeroContacto: string;
  };
}

interface PublicacionIntelectual {
  idProduccionIntelectual: string;
  nombre: string;
  enlaceEditorial: string;
  pais: string;
  fecha: string;
  tipoPublicacion: string;
}

interface Agenda {
  idAgenda: string;
  fecha: string;
  linkZoom: string;
}

interface Area {
  idArea: string;
}

export interface Postulante extends RowDataPacket {
  idDocente: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  ciudadRadicacion: string;
  telefono: string;
  estado: string;
  fotografia: string;
  fechaNacimiento: string;
  estudiosuperiores: EstudioSuperior[];
  experienciasdocentes: ExperienciaDocente[];
  idiomas: Idioma[];
  habilidades_blandas: HabilidadBlanda[];
  experienciaslaborales: ExperienciaLaboral[];
  publicacionesintelectuales: PublicacionIntelectual[];
  agendas: Agenda[];
  areas: Area[];
  numeroReferencia: string;
  numeroDocumento: string;
  genero: string;
  direccion: string;
  sector: string;
  pais_docente: string;
  tipo_documento: string;
}

export async function GET({ params }: APIContext) {
  try {
    const { postulante } = params;

    if (!postulante || isNaN(Number(postulante))) {
      return new Response(
        JSON.stringify({ error: "ID del postulante inválido" }),
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    const query = `
SELECT  
    d.idDocente,
    d.apellidoMaterno,
    d.apellidoPaterno,
    d.nombres,
    d.numeroReferencia,
    d.correo,
    d.telefono,
    d.numeroDocumento,
    d.fechaNacimiento,  
    d.ciudadRadicacion,
    d.genero,
    d.direccion,
    d.estado,
    d.fotografia,

    -- Sector
    s.nombre AS sector,

    -- País del docente
    p.nombre AS pais_docente,

    -- Tipo de documento
    doc.tipo AS tipo_documento,

    -- Estudios superiores
    GROUP_CONCAT(
        DISTINCT CONCAT(
            '{',
            '"idEstudio":"', es.idEstudioSuperior, '",',
            '"idPais":"', es.idPais, '",',
            '"idGrado":"', es.idGrado, '",',
            '"idModalidad":"', es.idModalidad, '",',
            '"carrera":"', es.carrera, '",',
            '"nombre":"', es.nombre, '",',
            '"universidad":"', es.universidad, '",',
            '"pais":"', ep.nombre, '",',
            '"fecha":"', es.fecha, '",',
            '"modalidad":"', m.tipo, '",',
            '"gradoTipo":"', g.tipo, '",',
            '"idTipoEstudios":"', te.idTipoEstudio, '",',
            '"tipoEstudios":"', te.tipo, '"',
            '}'
        ) SEPARATOR ',' 
    ) AS estudiossuperiores,

    -- Experiencias docentes
    GROUP_CONCAT(
        DISTINCT CONCAT(
            '{',
            '"idExperiencia":"', ed.idExperienciaDocente, '",',
            '"materia":"', ed.materia, '",',
            '"calidad":"', ed.calidad, '",',
            '"universidad":"', ed.universidad, '",',
            '"concluidoEl":"', ed.concluidoEl, '"}'
        ) SEPARATOR ',' 
    ) AS experienciasdocentes,

    -- Idiomas
    GROUP_CONCAT(
       DISTINCT CONCAT(
            '{',
            '"idIdiomaDocente":"', id.idIdiomaDocente, '",',
             '"idIdioma":"', id.idIdioma, '",',
            '"idioma":"', i.idioma, '",',
            '"escritura":"', id.escritura, '",',
            '"oral":"', id.oral, '",',
            '"lectura":"', id.lectura, '",',
            '"escucha":"', id.escucha, '"}'
        ) SEPARATOR ',' 
    ) AS idiomas,

    -- Habilidades blandas
    GROUP_CONCAT(
        DISTINCT CONCAT(
            '{',
            '"idHabilidadBlanda":"', hb.idHabilidadBlanda, '",',
            '"habilidad":"', hb.habilidad, '"}'
        ) SEPARATOR ',' 
    ) AS habilidades_blandas,

    -- Experiencias laborales
    GROUP_CONCAT(
        DISTINCT CONCAT(
            '{',
            '"idExperienciaLaboral":"', el.idExperienciaLaboral, '",',
            '"nombreEmpresa":"', el.nombreEmpresa, '",',
            '"cargo":"', el.cargo, '",',
            '"ciudad":"', el.ciudad, '",',
            '"fechaInicio":"', el.fechaInicio, '",',
            '"fechaFinal":"', el.fechaFinal, '",',
            '"idPais":"', el.idPais, '",',
            '"pais":"', epais.nombre, '",',
            '"descripcion":"', el.descripcion, '",',
            '"referencia":{',
                '"idReferencia":"', r.idReferencia, '",',
                '"nombreCompleto":"', r.nombreCompleto, '",',
                '"cargo":"', r.cargo, '",',
                '"numeroContacto":"', r.numeroContacto, '"}',
            '}'
        ) SEPARATOR ',' 
    ) AS experienciaslaborales,

    -- Publicaciones intelectuales
    GROUP_CONCAT(
       DISTINCT CONCAT(
            '{',
            '"idProduccionIntelectual":"', pi.idProduccionIntelectual, '",',
            '"nombre":"', pi.nombre, '",',
            '"enlaceEditorial":"', pi.enlaceEditorial, '",',
            '"idPais":"', pp.idPais, '",',
            '"pais":"', pp.nombre, '",',
            '"fecha":"', pi.fecha, '",',
         '"idTipoPublicacion":"', tp.idTipoPublicacion, '",',

            '"tipoPublicacion":"', tp.tipo, '"}'
        ) SEPARATOR ',' 
    ) AS publicacionesintelectuales,

    -- Nueva relación con 'agendas'
    GROUP_CONCAT(
        DISTINCT CONCAT(
            '{',
            '"idAgenda":"', ag.idAgenda, '",',
            '"fecha":"', ag.fecha, '",',
            '"linkZoom":"', ag.linkZoom, '"}'
        ) SEPARATOR ',' 
    ) AS agendas,

    -- Nueva relación con 'áreas'
    GROUP_CONCAT(
       DISTINCT CONCAT(
            '{',
            '"idArea":"', ar.idArea, '"}'
        ) SEPARATOR ',' 
    ) AS areas

FROM 
    docentes d

    -- Relación con sectores
    LEFT JOIN sectores s ON d.idSector = s.idSector

    -- Relación con países (para el docente)
    LEFT JOIN paises p ON d.idPais = p.idPais

    -- Relación con documentos
    LEFT JOIN documentos doc ON d.idDocumento = doc.idDocumentos

    -- Relación con estudios superiores
    LEFT JOIN docentes_estudios de ON d.idDocente = de.idDocente
    LEFT JOIN estudiossuperiores es ON de.idEstudioSuperior = es.idEstudioSuperior
    LEFT JOIN modalidades m ON m.idModalidad = es.idModalidad
    LEFT JOIN grados g ON g.idGrado = es.idGrado
    LEFT JOIN paises ep ON ep.idPais = es.idPais  

    -- Relación con experiencias docentes
    LEFT JOIN docente_experienciadocente ded ON d.idDocente = ded.idDocente
    LEFT JOIN experienciadocente ed ON ded.idExperienciaDocente = ed.idExperienciaDocente

    -- Relación con idiomas
    LEFT JOIN idiomas_docente id ON d.idDocente = id.idDocente
    LEFT JOIN idiomas i ON id.idIdioma = i.idIdioma

    -- Relación con habilidades blandas
    LEFT JOIN habilidadesblandas hb ON d.idDocente = hb.idDocentes

    -- Relación con experiencias laborales
    LEFT JOIN docente_experiencias dexp ON d.idDocente = dexp.idDocente
    LEFT JOIN experiencialaboral el ON dexp.idExperienciaLaboral = el.idExperienciaLaboral
    LEFT JOIN paises epais ON el.idPais = epais.idPais
    LEFT JOIN referencias r ON el.idReferencia = r.idReferencia

    -- Relación con publicaciones intelectuales
    LEFT JOIN docentes_publicacionesintelectuales dpi ON d.idDocente = dpi.idDocente
    LEFT JOIN produccionesintelectuales pi ON dpi.idProduccionIntelectual = pi.idProduccionIntelectual
    LEFT JOIN paises pp ON pi.idPais = pp.idPais
    LEFT JOIN tipospublicaciones tp ON pi.idTipoPublicacion = tp.idTipoPublicacion

    -- Relación con tipoestudios
    LEFT JOIN tiposestudios te ON es.idTipoEstudio = te.idTipoEstudio

    -- Relación con agendas
    LEFT JOIN agendas ag ON d.idDocente = ag.idDocente

    -- Relación con áreas
    LEFT JOIN areas ar ON d.idAreaInteres = ar.idArea

WHERE 
    d.idDocente = ? 
    AND d.estado = 'postulante'

GROUP BY 
    d.idDocente;

    `;

    // Ejecutar la consulta y desestructurar los resultados
    const [results]: [Postulante[], any] = await db.query<Postulante[]>(query, [
      Number(postulante),
    ]);

    db.end();

    if (results.length === 0) {
      return new Response(
        JSON.stringify({ error: "Postulante no encontrado" }),
        { status: 404 }
      );
    }

  // Agrupar los resultados de 'estudiossuperiores' y 'experienciasdocentes'
const postulanteData = results[0];

// Parsear el JSON en el campo de 'estudiossuperiores'
postulanteData.estudiossuperiores = JSON.parse(`[${postulanteData.estudiossuperiores}]`);
// Parsear el JSON en el campo de 'experienciasdocentes'
postulanteData.experienciasdocentes = JSON.parse(`[${postulanteData.experienciasdocentes}]`);
// Parsear el JSON en el campo de 'experienciasdocentes'
postulanteData.idiomas = JSON.parse(`[${postulanteData.idiomas}]`);
// Parsear el JSON en el campo de hqabilidades blandas
postulanteData.habilidades_blandas = JSON.parse(`[${postulanteData.habilidades_blandas}]`);
// Parsear el JSON en el campo de Experiencias Laborales 
postulanteData.experienciaslaborales = JSON.parse(`[${postulanteData.experienciaslaborales}]`);
// Parsear campos JSON en el resultado
postulanteData.publicacionesintelectuales = JSON.parse(`[${postulanteData.publicacionesintelectuales}]`);
// Parsear las nuevas relaciones
postulanteData.agendas = JSON.parse(`[${postulanteData.agendas}]`);
postulanteData.areas = JSON.parse(`[${postulanteData.areas}]`);


    // Devolver los resultados sin el campo 'detalles'
    return new Response(JSON.stringify(postulanteData), { status: 200 });
  } catch (error) {
    console.error("Error al obtener el postulante:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener el postulante" }),
      { status: 500 }
    );
  }
}
