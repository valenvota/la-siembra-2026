import type { SiembraData } from "./types";

/**
 * SEED PROVISIONAL — La Siembra 2026.
 * Fuentes: brief 2026 + evidencia estructural del Programa Siembra 2025 y el plano
 * numerado de Hölters (Ref · Lugar · Actividad · Nivel). Los números de referencia,
 * nombres de sedes y actividades son PROVISIONALES hasta reconciliar con datos 2026.
 * Cambiar acá, nunca en los componentes.
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
    { id: "inicial", referenceNumber: 1, internalName: "Nivel Inicial", displayName: "Nivel Inicial", short: "Inicial", hotspot: { x: 59, y: 34 }, blurb: "Salas de los más chicos: juego, luz y color." },
    { id: "primaria", referenceNumber: 2, internalName: "Nivel Primario", displayName: "Nivel Primario", short: "Primaria", hotspot: { x: 67, y: 66 } },
    { id: "secundaria", referenceNumber: 3, internalName: "Nivel Secundario", displayName: "Nivel Secundario", short: "Secundaria", hotspot: { x: 29, y: 60 } },
    { id: "gimnasio", referenceNumber: 4, internalName: "Gimnasio", displayName: "Gimnasio", hotspot: { x: 56, y: 71 }, headline: true, blurb: "Corazón de los grandes eventos en espacio cubierto." },
    { id: "cieda", referenceNumber: 5, internalName: "CIEDA y Secretaría", displayName: "CIEDA", hotspot: { x: 78, y: 55 }, blurb: "Ciencia, laboratorio y experiencias." },
    { id: "idiomas", referenceNumber: 7, internalName: "Dpto. de Idiomas", displayName: "Departamento de Idiomas", short: "Idiomas", hotspot: { x: 54, y: 50 } },
    { id: "comedor", referenceNumber: 8, internalName: "Comedor", displayName: "Comedor", hotspot: { x: 56, y: 55 } },
    { id: "vianda", referenceNumber: 14, internalName: "Vianda", displayName: "Vianda", hotspot: { x: 56, y: 64 } },
    { id: "bosque", referenceNumber: 12, internalName: "Sector Bosque", displayName: "Sector Bosque", short: "Bosque", hotspot: { x: 47, y: 26 }, blurb: "Naturaleza abierta para recorrer." },
    { id: "piscinas", referenceNumber: 9, internalName: "Sector de Piscinas", displayName: "Sector de Piscinas", short: "Piscinas", hotspot: { x: 72, y: 26 } },
    { id: "recepcion", referenceNumber: 6, internalName: "Recepción", displayName: "Recepción / Entrada", short: "Entrada", hotspot: { x: 49, y: 54 }, blurb: "Punto de llegada e información." },
    { id: "escenario", referenceNumber: 20, internalName: "Escenario principal", displayName: "Escenario principal", short: "Escenario", hotspot: { x: 11, y: 54 }, headline: true, blurb: "Música, danza y grandes espectáculos al aire libre." },
  ],

  // start ausente = recorrido libre sin horario (como Siembra 2025). day = fecha ISO 2026.
  activities: [
    // Lunes 28
    { id: "a01", name: "Teen Beach Movie", day: "2026-09-28", start: "16:00", end: "17:30", areaId: "primaria", level: "primaria", category: "audiovisual", description: "Proyección y coreografías de la película, con la comunidad de Primaria." },
    { id: "a02", name: "Show de Magia", day: "2026-09-28", start: "16:30", end: "17:15", areaId: "vianda", level: "primaria", category: "teatro", description: "Ilusionismo para toda la familia." },
    // Martes 29
    { id: "a03", name: "On Stage", day: "2026-09-29", start: "18:30", end: "20:00", areaId: "gimnasio", level: "secundaria", category: "teatro", description: "Muestra de teatro de Secundaria en el Gimnasio." },
    { id: "a04", name: "Somos Polvo de Estrellas", day: "2026-09-29", start: "15:00", end: "15:45", areaId: "primaria", level: "primaria", category: "audiovisual", description: "Experiencia audiovisual sobre el cosmos." },
    // Miércoles 30 (día simulado para el estado DURANTE)
    { id: "a05", name: "Taller de Huerta", day: "2026-09-30", start: "14:00", end: "14:45", areaId: "bosque", level: "comunidad", category: "encuentro", description: "Sembrar, cuidar y cosechar en comunidad." },
    { id: "a06", name: "Show de Química", day: "2026-09-30", start: "15:00", end: "16:00", areaId: "cieda", level: "secundaria", category: "ciencia", description: "Experimentos en vivo: color, reacción y sorpresa." },
    { id: "a07", name: "Coro de Inicial", day: "2026-09-30", start: "16:30", end: "17:00", areaId: "inicial", level: "inicial", category: "musica", description: "Las voces más chicas del colegio." },
    { id: "a08", name: "Got Talent Hölters", day: "2026-09-30", start: "18:00", end: "20:00", areaId: "escenario", level: "comunidad", category: "musica", description: "El gran show de talentos de la comunidad, en el Escenario principal." },
    // Jueves 1
    { id: "a09", name: "Modelo ONU", day: "2026-10-01", start: "09:00", end: "13:00", areaId: "idiomas", level: "secundaria", category: "debate", description: "Simulación de debate internacional.", requiresReservation: true, reservationUrl: "https://forms.gle/ejemplo-modelo-onu" },
    { id: "a10", name: "Debate Abierto", day: "2026-10-01", start: "17:00", end: "18:30", areaId: "cieda", level: "secundaria", category: "debate", description: "Ideas y preguntas abiertas a la comunidad." },
    // Viernes 2
    { id: "a11", name: "Bailes de Argentina y Colombia", day: "2026-10-02", start: "19:00", end: "20:00", areaId: "escenario", level: "comunidad", category: "danza", description: "Danzas tradicionales junto al Colegio San Pío X (Colombia)." },
    { id: "a12", name: "Encuentro de Bandas", day: "2026-10-02", start: "20:30", end: "22:00", areaId: "escenario", level: "comunidad", category: "musica", description: "Bandas de la comunidad y visitantes cierran La Siembra." },
    // Recorrido libre (sin horario) — como los espacios "para recorrer libremente" de 2025
    { id: "f01", name: "Mural colaborativo", day: "2026-09-28", areaId: "inicial", level: "inicial", category: "arte", description: "Una obra que crece con las manos de todos." },
    { id: "f02", name: "Kunstgalerie — muestra de arte", day: "2026-09-30", areaId: "secundaria", level: "secundaria", category: "arte", description: "Galería de producciones visuales de los estudiantes." },
    { id: "f03", name: "Del átomo al animal", day: "2026-09-30", areaId: "secundaria", level: "secundaria", category: "ciencia", description: "Recorrido científico por el laboratorio." },
  ],

  partners: [
    {
      id: "sanpio",
      name: "Colegio San Pío X",
      country: "Colombia",
      city: "Bogotá",
      blurb: "Viajan para bailar con nosotros y compartir una semana de aula abierta.",
      activityId: "a11",
      // Retrato temporal (placeholder) — reemplazar por la foto real del contingente.
      portrait: "/assets/media/sanpio.jpg",
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
    howToArrive: "Acceso por Ruta 4. Seguí Calle Los Flamencos hasta la entrada del campus.",
    hours: "Lunes 28 de septiembre a viernes 2 de octubre. Actividades por la tarde; consultá el programa.",
    parking: "Estacionamiento dentro del campus, señalizado con la letra E.",
    accessibility: "Recorridos accesibles en los sectores principales. Ante cualquier necesidad, acercate a Recepción.",
    services: "Comedor y puntos de comida disponibles durante el evento.",
  },
};
