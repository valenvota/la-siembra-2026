import type { Activity } from "../data/types";

export type ActivityStatus = "libre" | "proxima" | "ahora" | "finalizada";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function at(day: string, time?: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  if (!time) return new Date(y, m - 1, d, 0, 0, 0);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0);
}

export function isFreeRoam(a: Activity): boolean {
  return !a.start;
}

const HORA_MS = 60 * 60 * 1000;

/**
 * Fin de una actividad para calcular su estado:
 *  1) si tiene `end` (endTime real de la planilla), usa esa hora;
 *  2) si no, lo infiere: min(inicio de la próxima actividad en la MISMA ubicación, inicio + 60min);
 *  3) sin próxima en esa ubicación: inicio + 60min.
 * "Misma ubicación" = mismo `lugar` exacto si está, si no el `areaId`. Requiere que `a.start` exista.
 */
export function estimatedEnd(a: Activity, all: Activity[]): Date {
  const start = at(a.day, a.start);
  if (a.end) return at(a.day, a.end);
  const cap = new Date(start.getTime() + HORA_MS);
  const loc = (a.lugar || a.areaId || "").trim();
  if (loc) {
    let next: number | null = null;
    for (const b of all) {
      if (b === a || !b.start || b.day !== a.day) continue;
      if ((b.lugar || b.areaId || "").trim() !== loc) continue;
      const bs = at(b.day, b.start).getTime();
      if (bs <= start.getTime()) continue; // debe empezar DESPUÉS (no cuenta lo simultáneo)
      if (next === null || bs < next) next = bs;
    }
    if (next !== null && next < cap.getTime()) return new Date(next);
  }
  return cap;
}

/**
 * Estado temporal de una actividad:
 *   proxima     → now < inicio
 *   ahora       → inicio <= now < fin(estimado)
 *   finalizada  → now >= fin(estimado)
 * `libre` para las muestras sin horario. `all` es el set de actividades (para inferir el fin).
 */
export function activityStatus(a: Activity, now: Date, all: Activity[]): ActivityStatus {
  if (!a.start) return "libre";
  const start = at(a.day, a.start);
  if (now < start) return "proxima";
  return now < estimatedEnd(a, all).getTime() ? "ahora" : "finalizada";
}

/** Orden para el estado DURANTE: ahora → próxima → libre → finalizada, y por hora. */
export function duringSort(a: Activity, b: Activity, now: Date, all: Activity[]): number {
  const rank: Record<ActivityStatus, number> = { ahora: 0, proxima: 1, libre: 2, finalizada: 3 };
  const ra = rank[activityStatus(a, now, all)];
  const rb = rank[activityStatus(b, now, all)];
  if (ra !== rb) return ra - rb;
  return at(a.day, a.start).getTime() - at(b.day, b.start).getTime();
}

export function dayLabel(day: string): string {
  const dt = at(day);
  return `${DAYS[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
}

export function dayNumber(day: string): string {
  return String(at(day).getDate());
}

export function dayWeekday(day: string): string {
  return DAYS[at(day).getDay()];
}

export function timeRange(a: Activity): string {
  if (!a.start) return "Muestra permanente";
  return a.end ? `${a.start}–${a.end}` : a.start;
}

export function statusLabel(s: ActivityStatus): string {
  return s === "ahora" ? "Ahora" : s === "proxima" ? "Próxima" : s === "libre" ? "Libre" : "Finalizada";
}
