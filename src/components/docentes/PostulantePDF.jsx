
import { PDFDownloadLink, Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import "../../styles/postulantes.css";


const styles = StyleSheet.create({
  page: {
    margin: 10,
    paddingTop: 15,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  container: {
    flex:1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  leftColumn: {
    width: "35%",
    backgroundColor: "#1d2a44",
    color: "white",
    padding: 20,
    borderRight: "2px solid black",
    flexGrow:1,
  },
  profileImage: {
    borderRadius: 55,
    width: 110,
    height: 110,
    marginBottom: 20,
    borderWidth: 4,     
    borderColor: "#fdd835", 
    borderStyle: "solid"
  },
  leftColumnHeading: {
    fontSize: 14,
    marginBottom: 10,
  },
  leftColumnText: {
    marginVertical: 5,
    fontSize: 11,
  },
  rightColumn: {
    width: "65%",
    padding: 30,
  },
  rightColumnHeading: {
    fontSize: 16,
    color: "#1d2a44",
    marginBottom: 15,
    borderBottom: "1px solid #1d2a44",
    paddingBottom: 5,
  },
  rightColumnText: {
    marginVertical: 8,
    fontSize: 12,
  },
  listItem: {
    marginBottom: 10,
    padding: 5,
    borderBottom: "1px solid #ddd",
  },

});

const PDFContent = ({ postulante }) => (
  <Document>
    <Page size="LEGAL" style={styles.page} wrap>
      <View style={styles.container}>

      
        <View style={styles.leftColumn}>
          <Image src={postulante.fotografia} style={styles.profileImage} />
          <Text style={styles.leftColumnHeading}><Image src="/images/iconos/usuario (1).png" style={styles.icon} /> {postulante.nombres}</Text>
          <Text style={styles.leftColumnText}><Image src="/images/iconos/carnet-de-identidad.png" style={styles.icon} /> {postulante.numeroDocumento}</Text>
          <Text style={styles.leftColumnText}><Image src="/images/iconos/pastel.png" style={styles.icon} /> Fecha de Nacimiento</Text>
          <Text style={styles.leftColumnText}><Image src="/images/iconos/sobre-de-papel-blanco.png" style={styles.icon} /> {postulante.correo}</Text>
          <Text style={styles.leftColumnText}><Image src="/images/iconos/telefono.png" style={styles.icon} /> {postulante.telefono}</Text>
          <Text style={styles.leftColumnText}><Image src="/images/iconos/genero.png" style={styles.icon} /> Género</Text>
          <Text style={styles.leftColumnText}><Image src="/images/iconos/mapa.png" style={styles.icon} /> Ciudad</Text>
          <Text style={styles.leftColumnText}><Image src="/images/iconos/ubicacion (2).png" style={styles.icon} /> Ubicación</Text>
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.rightColumnHeading}>Estudios Pregrado</Text>
          {postulante.estudiossuperiores && postulante.estudiossuperiores
    .filter((estudios) => estudios.tipo === "pregrado") // Filtrar solo los de tipo "pregrado"
    .map((estudios, index) => (
            <View key={index} style={styles.listItem} wrap={false}>
              <Text style={styles.rightColumnText}>
                Carrera: {estudios.carrera}
              </Text>
              <Text style={styles.rightColumnText}>
                Universidad: {estudios.universidad}
              </Text>
              <Text style={styles.rightColumnText}>País: {estudios.pais}</Text>
              <Text style={styles.rightColumnText}>Año: {estudios.fecha}</Text>
              <Text style={styles.rightColumnText}>
                Modalidad: {estudios.modalidad}
              </Text>
            </View>
          ))}

          <Text style={styles.rightColumnHeading}>Estudios Postgrado</Text>
          {postulante.estudiossuperiores && postulante.estudiossuperiores
    .filter((estudios) => estudios.tipo === "postgrado") // Filtrar solo los de tipo "pregrado"
    .map((estudios, index) => (
            <View key={index} style={styles.listItem} wrap={false}>
              <Text style={styles.rightColumnText}>
                Nombre: {estudios.nombre}
              </Text>
              <Text style={styles.rightColumnText}>
                Universidad: {estudios.universidad}
              </Text>
              <Text style={styles.rightColumnText}>País: {estudios.pais}</Text>
              <Text style={styles.rightColumnText}>Año: {estudios.fecha}</Text>
              <Text style={styles.rightColumnText}>
                Modalidad: {estudios.modalidad}
              </Text>
            </View>
          ))}

            <Text style={styles.rightColumnHeading}>Cursos</Text>
            {postulante.cursos?.map((cursos, index) => (
            <View key={index} style={styles.listItem} wrap={false}>
              <Text style={styles.rightColumnText}>Nombre: {cursos.nombre}</Text>
              <Text style={styles.rightColumnText}>Universidad: {cursos.universidad}</Text>
              <Text style={styles.rightColumnText}>País: {cursos.pais}</Text>
              <Text style={styles.rightColumnText}>Año: {cursos.anio}</Text>
            </View>
          ))}

        </View>
      </View>
    </Page>
  </Document>
);

export const PostulantePDF = ({ postulante }) => (
  <div className="download-pdf-container"> {/* Contenedor principal */}
  <PDFDownloadLink
    document={<PDFContent postulante={postulante} />}
    fileName={`${postulante.nombres}_CV.pdf`}
  >
    {({ loading }) => (
      <button className="download-btn">
        <img src="/images/iconos/download-pdf.png" alt="Icono PDF" className="download-icon" />
        {loading ? "Generando PDF..." : ""}
      </button>
    )}
  </PDFDownloadLink>
</div>
);
