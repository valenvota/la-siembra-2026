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

export function activityStatus(a: Activity, now: Date): ActivityStatus {
  if (!a.start) return "libre";
  const start = at(a.day, a.start);
  const end = a.end ? at(a.day, a.end) : new Date(start.getTime() + 60 * 60 * 1000);
  if (now >= start && now <= end) return "ahora";
  if (now < start) return "proxima";
  return "finalizada";
}

/** Orden para el estado DURANTE: ahora → próxima → libre → finalizada, y por hora. */
export function duringSort(a: Activity, b: Activity, now: Date): number {
  const rank: Record<ActivityStatus, number> = { ahora: 0, proxima: 1, libre: 2, finalizada: 3 };
  const ra = rank[activityStatus(a, now)];
  const rb = rank[activityStatus(b, now)];
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
