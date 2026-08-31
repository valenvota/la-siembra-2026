// La Siembra — modelo de contenido. Todo es data editable (seed provisional).
// Regla: los componentes NO hardcodean programación. Cambiar datos, no componentes.

export type Category =
  | "teatro"
  | "musica"
  | "ciencia"
  | "danza"
  | "debate"
  | "audiovisual"
  | "arte"
  | "encuentro";

export type Level = "inicial" | "primaria" | "secundaria" | "comunidad";

export interface Area {
  id: string;
  /** Número de referencia del plano oficial de Hölters (Ref. del programa). Clave nativa mapa↔programa. */
  referenceNumber: number;
  /** Nombre operativo interno (leyenda 2024 / Excel). No se muestra. Provisional. */
  internalName: string;
  /** Nombre público reconciliado 2026. Se muestra. (Provisional = igual a internalName por ahora.) */
  displayName: string;
  short?: string;
  blurb?: string;
  /** Hotspot como % sobre la imagen del plano (0..100, x izq→der, y arr→ab). Calibrar con el asset real. */
  hotspot: { x: number; y: number };
  /** Marca zonas que son "corazón de grandes eventos" (p.ej. Escenario / Gimnasio). */
  headline?: boolean;
}

export interface Activity {
  id: string;
  name: string;
  /** ISO date (YYYY-MM-DD) dentro del rango del evento. */
  day: string;
  /** "HH:MM" 24h. Ausente = espacio de recorrido libre, sin horario (como en Siembra 2025). */
  start?: string;
  /** "HH:MM" 24h, opcional. */
  end?: string;
  areaId: string;
  level?: Level;
  category: Category;
  description?: string;
  image?: string;
  requiresReservation?: boolean;
  /** Link externo (Google Form / plataforma). No construimos backend. */
  reservationUrl?: string;
}

export interface Partner {
  id: string;
  name: string;
  country: string;
  logo?: string;
  /** Ciudad de origen (spotlight). */
  city?: string;
  /** Descripción corta del vínculo (spotlight). */
  blurb?: string;
  /** Actividad del programa que los conecta con La Siembra — el vínculo es la historia. */
  activityId?: string;
  /** Retrato del contingente (placeholder, se enmascara con la semilla). */
  portrait?: string;
}

/** Streaming: URL/embed externo configurable. No desarrollamos streaming propio. */
export interface Streaming {
  /** Plataforma para copy ("YouTube", "Teams", …). Provisional. */
  platformLabel?: string;
  /** URL externa configurable (embed o link). */
  url: string;
  /** Etiqueta de próxima transmisión cuando aún no arrancó. */
  nextLabel?: string;
}

export interface PracticalInfo {
  address: string;
  howToArrive: string;
  hours: string;
  parking: string;
  accessibility: string;
  services?: string;
}

/** Media del hero — reemplazable por footage real de Hölters sin tocar el layout.
 *  Desktop: paisaje 16:9. Mobile: vertical 4:5. Si no hay src, se muestra el placeholder. */
export interface HeroMedia {
  videoDesktop?: string;
  videoMobile?: string;
  imageDesktop?: string;
  imageMobile?: string;
  poster?: string;
  alt?: string;
}

export interface EventInfo {
  title: string;
  tagline: string;
  /** Rango principal. ISO dates. */
  start: string;
  end: string;
  venueName: string;
  locationLabel: string;
  about: string;
  heroMedia?: HeroMedia;
}

export interface SiembraData {
  event: EventInfo;
  areas: Area[];
  activities: Activity[];
  partners: Partner[];
  streaming: Streaming;
  practical: PracticalInfo;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  teatro: "Teatro",
  musica: "Música",
  ciencia: "Ciencia",
  danza: "Danza",
  debate: "Debates",
  audiovisual: "Audiovisual",
  arte: "Arte",
  encuentro: "Encuentros",
};

export const LEVEL_LABEL: Record<Level, string> = {
  inicial: "Inicial",
  primaria: "Primaria",
  secundaria: "Secundaria",
  comunidad: "Comunidad",
};
