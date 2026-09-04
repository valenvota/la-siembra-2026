import type { SiembraData } from "./types";

/**
 * SEED PROVISIONAL — La Siembra 2026.
 * Fuentes: brief 2026 + evidencia estructural del Programa Siembra 2025 y el plano
 * numerado de Hölters (Ref · Lugar · Actividad · Nivel). Los números de referencia,
 * nombres de sedes y actividades son PROVISIONALES hasta reconciliar con datos 2026.
 * Cambiar acá, nunca en los componentes.
 *
 * ROADMAP (no prioritario) — Google Sheets como base de datos del cronograma:
 * la idea es que `data.activities` (y `areas`) se hidrate desde una hoja de Google para
 * que el equipo del colegio actualice el programa sin tocar código. Camino sugerido:
 * publicar la hoja como CSV/JSON (o Apps Script / Sheets API v4), mapear filas → Activity
 * en un loader async (mismo shape que este seed) y cachear. Mantener este archivo como
 * fallback/estructura canónica. No implementar hasta confirmar la hoja fuente.
 */

export const data: SiembraData = {
  event: {
    title: "La Siembra 2026",
    tagline: "Una semana para compartir, crear y encontrarnos.",
    start: "2026-09-28",
    end: "2026-10-02",
    venueName: "Hölters Natur",
    locationLabel: "Los Cardales, Buenos Aires",
    about:
      "Cinco días para abrir las puertas del colegio y compartir con nuestra comunidad aquello que sucede todos los días en nuestras aulas: ideas, preguntas, conocimiento, expresión, creatividad y encuentro.",
    // Loop de video real de Hölters (optimizado para web, sin audio). Imagen = fallback.
    heroMedia: {
      videoDesktop: "/assets/media/hero-loop.mp4",
      videoMobile: "/assets/media/hero-loop-mobile.mp4",
      poster: "/assets/media/hero-poster.jpg",
      imageDesktop: "/assets/media/hero-desktop.jpg",
      imageMobile: "/assets/media/hero-mobile.jpg",
      alt: "La Siembra en Hölters Natur",
    },
  },

  // Nombres y números tomados de la leyenda del plano oficial (oct 2024). internalName = leyenda;
  // displayName = reconciliado 2026 (por ahora igual). Coordenadas de hotspot en % sobre la
  // imagen del plano (2399×1433) — CALIBRAR con el asset real antes del sprint de craft.
  areas: [
    // Solo zonas con actividades. Numeración 1–8. Hotspots calibrados con el plano oficial
    // etiquetado del colegio (ref: Nivel Inicial=1, Primario=2, Secundario=3, Gimnasio=4,
    // CIEDA=5, Idiomas=7, Comedor=8, Vianda=14 en el plano completo).
    { id: "inicial", referenceNumber: 1, internalName: "Nivel Inicial", displayName: "Edificio Nivel Inicial", hotspot: { x: 61, y: 31 }, blurb: "Salas de los más chicos: juego, luz y color." },
    { id: "primaria", referenceNumber: 2, internalName: "Nivel Primario", displayName: "Edificio Nivel Primario", hotspot: { x: 69, y: 68 } },
    { id: "secundaria", referenceNumber: 3, internalName: "Nivel Secundario", displayName: "Edificio Nivel Secundario", hotspot: { x: 28, y: 60 } },
    { id: "gimnasio", referenceNumber: 4, internalName: "Gimnasio", displayName: "Gimnasio", hotspot: { x: 57, y: 71 }, headline: true, blurb: "Corazón de los grandes eventos en espacio cubierto." },
    { id: "cieda", referenceNumber: 5, internalName: "CIEDA y Secretaría", displayName: "CIEDA", hotspot: { x: 80, y: 55 }, blurb: "Ciencia, laboratorio y experiencias." },
    { id: "idiomas", referenceNumber: 6, internalName: "Dpto. de Idiomas", displayName: "Departamento de Idiomas", short: "Idiomas", hotspot: { x: 54, y: 49 } },
    { id: "comedor", referenceNumber: 7, internalName: "Comedor", displayName: "Comedor", hotspot: { x: 56, y: 55 } },
    { id: "vianda", referenceNumber: 8, internalName: "Vianda", displayName: "Vianda", hotspot: { x: 57, y: 65 } },
  ],

  // start ausente = recorrido libre sin horario (como Siembra 2025). day = fecha ISO 2026.
  activities: [
    { id: "apertura", name: "Apertura de Siembra 2026", day: "2026-09-28", start: "08:00", areaId: "gimnasio", level: "comunidad", curso: "Toda la comunidad", category: "encuentro", description: "Arranca la semana: proyección del video institucional y bienvenida de toda la comunidad." },
    { id: "inicial-tu-tesoro", name: "¿Cuál es tu tesoro?", day: "2026-09-28", start: "08:30", areaId: "inicial", level: "inicial", curso: "Salas de 5", category: "arte", description: "Seguimiento de personaje (Pirata) con las salas de 5." },
    { id: "show-quimica", name: "Show de Química", day: "2026-09-28", start: "09:00", areaId: "gimnasio", level: "secundaria", curso: "Nivel Secundario", category: "ciencia", description: "Experimentos en vivo a cargo de Secundaria." },
    { id: "pizzeria-1a", name: "\"La Pizzería de 1ro\" — Castellano", day: "2026-09-28", start: "09:30", areaId: "vianda", level: "primaria", curso: "1.° A", category: "teatro", description: "Muestra dramatizada de 1.° A." },
    { id: "ratones-2v", name: "\"La escuela de ratones\" — Castellano", day: "2026-09-28", start: "10:30", areaId: "cieda", level: "primaria", curso: "2.° V", category: "teatro", description: "Muestra dramatizada de 2.° V." },
    { id: "revolucion-decisiones-5azul", name: "\"La revolución de las decisiones\"", day: "2026-09-28", start: "10:45", areaId: "gimnasio", level: "primaria", curso: "5.° Azul", category: "teatro", description: "Presentación de 5.° Azul." },
    { id: "monster-me-1a", name: "\"Monster Me\"", day: "2026-09-28", start: "10:50", areaId: "vianda", level: "primaria", curso: "1.° A", category: "teatro", description: "Muestra de 1.° A (Junior 1)." },
    { id: "revolucion-decisiones-5verde", name: "\"La revolución de las decisiones\"", day: "2026-09-28", start: "11:30", areaId: "gimnasio", level: "primaria", curso: "5.° Verde", category: "teatro", description: "Presentación de 5.° Verde." },
    { id: "teatro-manzana-discordia", name: "Obra de teatro \"La manzana de la discordia\"", day: "2026-09-28", start: "11:30", areaId: "secundaria", level: "secundaria", curso: "4.° Sociales", category: "teatro", description: "Antecedentes de la Ilíada, por 4.° Sociales." },
    { id: "wizard-oz-6azul", name: "Musical \"The Wizard of Oz\"", day: "2026-09-28", start: "15:00", areaId: "gimnasio", level: "primaria", curso: "6.° Azul", category: "musica", description: "On Stage de 6.° Azul." },
    { id: "cine-antes-de-irme", name: "Cine en Siembra: \"Antes de irme\"", day: "2026-09-28", start: "19:30", areaId: "gimnasio", level: "comunidad", curso: "Toda la comunidad", category: "audiovisual", description: "Proyección abierta a toda la comunidad." },
    { id: "onstage-inicial-k12", name: "On Stage Inicial (Kinder 1 y 2)", day: "2026-09-29", start: "09:00", areaId: "gimnasio", level: "inicial", curso: "Salas 1 y 2", category: "musica", description: "Muestra artística de las salas 1 y 2." },
    { id: "universos-en-serie", name: "\"Universos en Serie\" — Festival de Streaming", day: "2026-09-29", start: "09:00", areaId: "secundaria", level: "secundaria", curso: "2.° año", category: "audiovisual", description: "Guiones de miniseries creados por 2.° año." },
    { id: "sembrando-raices-entrevista-3v", name: "\"Sembrando Raíces\" — Entrevista a abuelos", day: "2026-09-29", start: "09:30", areaId: "comedor", level: "primaria", curso: "3.° Verde", category: "encuentro", description: "Encuentro intergeneracional de 3.° Verde." },
    { id: "sembrando-raices-cierre-3v", name: "\"Sembrando Raíces\" — Cierre artístico musical", day: "2026-09-29", start: "11:00", areaId: "gimnasio", level: "primaria", curso: "3.° Verde", category: "musica", description: "Cierre musical de 3.° Verde." },
    { id: "debate-racismo", name: "Debate abierto de ciudadanía: \"¿Argentina es un país racista?\"", day: "2026-09-29", start: "12:00", areaId: "gimnasio", level: "secundaria", curso: "3.° año", category: "debate", description: "Debate de 3.° año." },
    { id: "onstage-inicial-k4", name: "On Stage Inicial (Kinder 4)", day: "2026-09-29", start: "14:00", areaId: "gimnasio", level: "inicial", curso: "Sala 4", category: "musica", description: "Muestra artística de la sala 4." },
    { id: "inicial-todos-podemos-crear", name: "¿Todos podemos crear?", day: "2026-09-30", start: "08:30", areaId: "inicial", level: "inicial", curso: "Salas de 3", category: "arte", description: "Seguimiento de autor (Pablo Bernasconi) con las salas de 3." },
    { id: "porristas-colombia", name: "Show Internacional de Porristas", day: "2026-09-30", start: "09:00", areaId: "gimnasio", level: "comunidad", curso: "Toda la comunidad", category: "danza", description: "Presentación conjunta con la delegación de Colombia." },
    { id: "pizzeria-1v", name: "\"La Pizzería de 1ro\" — Castellano", day: "2026-09-30", start: "09:30", areaId: "vianda", level: "primaria", curso: "1.° V", category: "teatro", description: "Muestra dramatizada de 1.° V." },
    { id: "ratones-2a", name: "\"La escuela de ratones\" — Castellano", day: "2026-09-30", start: "10:30", areaId: "cieda", level: "primaria", curso: "2.° A", category: "teatro", description: "Muestra dramatizada de 2.° A." },
    { id: "pizzeria-1v-ingles", name: "\"La Pizzería de 1ro\" — Inglés", day: "2026-09-30", start: "10:50", areaId: "vianda", level: "primaria", curso: "1.° V", category: "teatro", description: "Muestra dramatizada de 1.° V (Junior 1)." },
    { id: "onstage-inicial-k5", name: "On Stage Inicial (Kinder 5)", day: "2026-09-30", start: "13:00", areaId: "gimnasio", level: "inicial", curso: "Sala 5", category: "musica", description: "Muestra artística de la sala 5." },
    { id: "libro-cuentos-ventanas", name: "Presentación del libro \"Las ventanas que abrimos\"", day: "2026-09-30", start: "14:00", areaId: "secundaria", level: "secundaria", curso: "1.° A y B", category: "arte", description: "Cuentos escritos por 1.° año." },
    { id: "wizard-oz-6verde", name: "Musical \"The Wizard of Oz\"", day: "2026-09-30", start: "15:00", areaId: "gimnasio", level: "primaria", curso: "6.° Verde", category: "musica", description: "On Stage de 6.° Verde." },
    { id: "ratones-2n", name: "\"La escuela de ratones\" — Castellano", day: "2026-10-01", start: "09:00", areaId: "cieda", level: "primaria", curso: "2.° N", category: "teatro", description: "Muestra dramatizada de 2.° N." },
    { id: "inicial-detectives-colores", name: "Detectives de colores", day: "2026-10-01", start: "09:00", areaId: "inicial", level: "inicial", curso: "Salas de 1 y 2", category: "arte", description: "Actividad de exploración de las salas de 1 y 2." },
    { id: "debate-onu", name: "Modelo de Naciones Unidas — Educación de calidad", day: "2026-10-01", start: "08:30", areaId: "gimnasio", level: "secundaria", curso: "5.° año", category: "debate", description: "Debate formato ONU de 5.° año." },
    { id: "museo-ajuar-faraon", name: "Museo interactivo \"El ajuar del faraón\"", day: "2026-10-01", start: "10:30", areaId: "idiomas", level: "secundaria", curso: "1.° A y B", category: "arte", description: "Cerámica egipcia + escape room, por 1.° año." },
    { id: "relatos-memoria", name: "\"Relatos sobre la memoria\"", day: "2026-10-01", start: "10:00", areaId: "secundaria", level: "secundaria", curso: "3.° A y B", category: "arte", description: "Muestra con presentación breve de los alumnos de 3.° año." },
    { id: "charlas-ted", name: "Charlas TED — ¿A qué problemáticas se enfrentan los jóvenes?", day: "2026-10-01", start: "12:00", areaId: "gimnasio", level: "secundaria", curso: "6.° Sociales", category: "debate", description: "Investigación en Ciencias Sociales de 6.° Sociales." },
    { id: "wizard-oz-6naranja", name: "Musical \"The Wizard of Oz\"", day: "2026-10-01", start: "15:00", areaId: "gimnasio", level: "primaria", curso: "6.° Naranja", category: "musica", description: "On Stage de 6.° Naranja." },
    { id: "teen-beach-noche", name: "Musical Secundaria: \"Teen Beach Movie\"", day: "2026-10-01", start: "18:00", areaId: "gimnasio", level: "secundaria", curso: "Nivel Secundario", category: "musica", description: "Función principal nocturna — el gran evento del Arena." },
    { id: "onstage-inicial-k3", name: "On Stage Inicial (Kinder 3)", day: "2026-10-02", start: "09:00", areaId: "gimnasio", level: "inicial", curso: "Sala 3", category: "musica", description: "Muestra artística de la sala 3." },
    { id: "feria-ciencias-5a", name: "Feria de Ciencias", day: "2026-10-02", start: "09:15", areaId: "vianda", level: "primaria", curso: "5.° A", category: "ciencia", description: "Feria de 5.° A." },
    { id: "grullas-5v", name: "Grullas", day: "2026-10-02", start: "09:15", areaId: "cieda", level: "primaria", curso: "5.° V", category: "arte", description: "Actividad de primaria, 5.° V." },
    { id: "feria-ciencias-5v", name: "Feria de Ciencias", day: "2026-10-02", start: "10:00", areaId: "vianda", level: "primaria", curso: "5.° V", category: "ciencia", description: "Feria de 5.° V." },
    { id: "grullas-5a", name: "Grullas", day: "2026-10-02", start: "10:00", areaId: "cieda", level: "primaria", curso: "5.° A", category: "arte", description: "Actividad de primaria, 5.° A." },
    { id: "sembrando-raices-entrevista-3azul", name: "\"Sembrando Raíces\" — Entrevista a abuelos", day: "2026-10-02", start: "09:30", areaId: "comedor", level: "primaria", curso: "3.° Azul", category: "encuentro", description: "Encuentro intergeneracional de 3.° Azul." },
    { id: "sembrando-raices-cierre-3azul", name: "\"Sembrando Raíces\" — Cierre artístico musical", day: "2026-10-02", start: "11:00", areaId: "gimnasio", level: "primaria", curso: "3.° Azul", category: "musica", description: "Cierre musical de 3.° Azul." },
    { id: "teen-beach-tarde", name: "Musical Secundaria: \"Teen Beach Movie\" (2.ª función)", day: "2026-10-02", start: "13:30", areaId: "gimnasio", level: "secundaria", curso: "Nivel Secundario", category: "musica", description: "Función de tarde, prioridad 2.° ciclo de Primaria." },
    { id: "bailes-tradicionales", name: "Argentina + Colombia: bailes tradicionales", day: "2026-10-02", start: "16:00", areaId: "gimnasio", level: "secundaria", curso: "Nivel Secundario", category: "danza", description: "Muestra conjunta de danzas con la delegación de Colombia." },
    { id: "encuentro-bandas", name: "Encuentro de Bandas", day: "2026-10-02", start: "18:30", areaId: "gimnasio", level: "secundaria", curso: "Nivel Secundario", category: "musica", description: "Banda San Pío X (Colombia) + Banda Hölters Natur." },
    { id: "cena-matinee-cierre", name: "Cena & Matinée — Cierre de Siembra 2026", day: "2026-10-02", start: "20:00", areaId: "gimnasio", level: "comunidad", curso: "Toda la comunidad", category: "encuentro", description: "Gran cierre festivo con toda la comunidad." },
    { id: "muestra-voices-pride", name: "\"Voices from Pride and Prejudice\"", day: "", areaId: "secundaria", level: "secundaria", curso: "4.° Nat. y Soc.", category: "arte", description: "Diarios de personajes en formato antiguo (4.° Nat. y Soc.).", allWeek: true },
    { id: "muestra-cuentos-silenciosos", name: "\"Cuentos silenciosos\"", day: "", areaId: "secundaria", level: "secundaria", curso: "4.° Soc. y Nat.", category: "arte", description: "Libros dibujados a partir de Cuentos de Amor, Locura y Muerte (4.° Soc. y Nat.).", allWeek: true },
    { id: "muestra-ecos-del-pantano", name: "\"Ecos del pantano\"", day: "", areaId: "", level: "secundaria", curso: "6.° Soc. y Nat.", category: "arte", description: "Performance e instalación de terror (6.° Soc. y Nat.).", allWeek: true },
    { id: "muestra-our-tales", name: "\"Our Tales of Childhood\"", day: "", areaId: "secundaria", level: "secundaria", curso: "3.° A y B", category: "arte", description: "Scrapbooks inspirados en Roald Dahl, con QR para aportes de la comunidad (3.° A y B).", allWeek: true },
    { id: "muestra-innovando-colegio", name: "\"Innovando el colegio\"", day: "", areaId: "secundaria", level: "secundaria", curso: "5.° Sociales", category: "ciencia", description: "Prototipos tecnológicos de 5.° Sociales.", allWeek: true },
    { id: "muestra-mi-robot", name: "\"Mi Robot\"", day: "", areaId: "secundaria", level: "secundaria", curso: "3.° A y B", category: "ciencia", description: "Robot programado que reconoce obstáculos (3.° A y B).", allWeek: true },
    { id: "muestra-orient-express", name: "\"All Aboard the Orient Express\"", day: "", areaId: "secundaria", level: "secundaria", curso: "2.° A y B", category: "ciencia", description: "Geografía y Environmental Science (2.° A y B).", allWeek: true },
    { id: "muestra-earth-in-motion", name: "\"Earth in Motion\"", day: "", areaId: "secundaria", level: "secundaria", curso: "2.° A y B", category: "ciencia", description: "Geografía y Environmental Science (2.° A y B).", allWeek: true },
    { id: "muestra-number-the-stars", name: "\"Reinventing the Cover – Number the Stars\"", day: "", areaId: "secundaria", level: "secundaria", curso: "1.° A y B", category: "arte", description: "Reversión de tapas del libro (1.° A y B).", allWeek: true },
    { id: "muestra-pelicula-favorita", name: "\"Mi película favorita\" — Flyer", day: "", areaId: "secundaria", level: "secundaria", curso: "6.° Alemán", category: "arte", description: "Flyers de cine hechos por 6.° Alemán.", allWeek: true },
    { id: "muestra-soy-feliz-cuando", name: "\"Soy feliz cuando…\"", day: "", areaId: "secundaria", level: "secundaria", curso: "2.° A Alemán", category: "arte", description: "Mural de flores sobre papel madera (2.° A Alemán).", allWeek: true },
  ],

  partners: [
    {
      id: "sanpio",
      name: "Colegio San Pío X",
      country: "Colombia",
      city: "Bogotá",
      blurb: "Vienen a compartir su música, sus bailes y una semana entera con nuestra comunidad.",
      activityId: "bailes-tradicionales",
      // Escudo oficial del colegio (Colegio San Pío X · Bogotá).
      logo: "/assets/media/colpiox-escudo.png",
      // Retrato temporal (placeholder) — reemplazar por la foto real del contingente.
      portrait: "/assets/media/sanpio.jpg",
      // Video de Colombia en Instagram — PEGAR EL LINK ACÁ y aparece el botón "Ver el video".
      videoUrl: "",
    },
  ],

  streaming: {
    platformLabel: "YouTube",
    // URL/embed externo configurable. Reemplazar por el link real cuando se confirme la plataforma.
    url: "https://www.youtube.com/@holtersnatur",
    nextLabel: "Viernes 2 · 18:30",
  },

  practical: {
    address: "Los Flamencos 125, Alto Los Cardales, Campana, Buenos Aires.",
    howToArrive: "Ingresá por Ruta 4 y seguí Calle Los Flamencos hasta la entrada del campus.",
    hours: "Del lunes 28 de septiembre al viernes 2 de octubre. Consultá el programa para los horarios de cada actividad.",
    parking: "Espacio dentro del campus.",
    accessibility: "Recorridos accesibles en los sectores principales. Ante cualquier necesidad, acercate a Recepción.",
    services: "Comedor y puntos de comida disponibles durante el evento.",
  },
};
