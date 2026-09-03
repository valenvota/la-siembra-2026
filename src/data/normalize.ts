// Normalización de la planilla WEB → modelo Activity.
// Módulo PURO (sin APIs de browser ni de Node): lo usan tanto la función serverless
// (api/programa.ts) como el cliente (data/programa.ts). Ver PROGRESO.md / ROADMAP en event.ts.

import type { Activity, Category, Level } from "./types";

/** Planilla "Siembra 2026 - Cronograma interno", pestaña WEB. */
export const SHEET_ID = "1lqRVdzMKGCm78bpKpEZTtAnDZuYDlJLu5z89l2zlFjE";
export const WEB_TAB = "WEB";

/** URL de exportación CSV de la pestaña (pública, CORS-friendly). */
export function sheetCsvUrl(): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(WEB_TAB)}`;
}

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
function key(s: string): string {
  return stripAccents(s.trim().toLowerCase());
}

/** Parser CSV RFC-4180 (comillas dobles, comas y saltos de línea dentro de campos). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n") {
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  // último campo/fila (si el archivo no termina en \n)
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

const CATEGORIES: Category[] = ["teatro", "musica", "ciencia", "danza", "debate", "audiovisual", "arte", "encuentro"];
function toCategory(raw: string): Category {
  const k = key(raw);
  const direct = CATEGORIES.find((c) => c === k);
  if (direct) return direct;
  // plurales / variantes de la planilla
  if (k === "debates") return "debate";
  if (k === "encuentros") return "encuentro";
  if (k === "musicales") return "musica";
  return "encuentro"; // default seguro
}

function toLevel(raw: string): Level | undefined {
  const k = key(raw);
  if (k === "inicial") return "inicial";
  if (k === "primaria" || k === "primario") return "primaria";
  if (k === "secundaria" || k === "secundario") return "secundaria";
  if (k === "general" || k === "comunidad") return "comunidad";
  return undefined;
}

/** "8:00" → "08:00"; vacío → undefined. */
function toTime(raw: string): string | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return undefined;
  return `${m[1].padStart(2, "0")}:${m[2]}`;
}

const TRUE_VALUES = new Set(["true", "1", "si", "sí", "x", "verdadero"]);

/**
 * Filas del CSV (con header) → Activity[]. Mapea por NOMBRE de columna (robusto a
 * columnas extra o reordenadas). Filtra visible_web y filas sin id/actividad.
 */
export function rowsToActivities(rows: string[][]): Activity[] {
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => key(h));
  const col = (name: string) => header.indexOf(name);
  const idx = {
    id: col("id"),
    dia: col("dia"),
    inicio: col("inicio"),
    fin: col("fin"),
    actividad: col("actividad"),
    lugar: col("lugar"),
    areaId: col("areaid"),
    nivel: col("nivel"),
    curso: col("curso"),
    categoria: col("categoria"),
    descripcion: col("descripcion_publica"),
    visible: col("visible_web"),
  };
  const get = (r: string[], i: number) => (i >= 0 && i < r.length ? (r[i] ?? "").trim() : "");

  const out: Activity[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const id = get(r, idx.id);
    const name = get(r, idx.actividad);
    if (!id || !name) continue; // fila vacía o incompleta

    if (idx.visible >= 0) {
      const v = key(get(r, idx.visible));
      if (!TRUE_VALUES.has(v)) continue; // no publicable
    }

    // Un día válido es ISO (YYYY-MM-DD). Cualquier otra cosa (vacío o "Toda la semana")
    // es una muestra de recorrido libre. Nota: gviz exporta como "" el texto "Toda la
    // semana" cuando la columna `dia` quedó tipada como fecha en Sheets — por eso alcanza
    // con "no es una fecha" en vez de buscar el texto literal.
    const diaRaw = get(r, idx.dia);
    const isDay = /^\d{4}-\d{2}-\d{2}$/.test(diaRaw);
    const allWeek = !isDay;
    const day = isDay ? diaRaw : "";

    out.push({
      id,
      name,
      day,
      start: toTime(get(r, idx.inicio)),
      end: toTime(get(r, idx.fin)),
      areaId: get(r, idx.areaId),
      level: toLevel(get(r, idx.nivel)),
      curso: get(r, idx.curso) || undefined,
      category: toCategory(get(r, idx.categoria)),
      description: get(r, idx.descripcion) || undefined,
      allWeek: allWeek || undefined,
    });
  }
  return out;
}

/** Texto CSV → Activity[] (atajo). */
export function csvToActivities(csv: string): Activity[] {
  return rowsToActivities(parseCsv(csv));
}
