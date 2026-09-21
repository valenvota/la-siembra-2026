// Reloj del EVENTO. Toda la lógica temporal (PRE/DURANTE, día actual, AHORA/PRÓXIMA/
// FINALIZADA, fecha del hero) se resuelve en la timezone del EVENTO, nunca en la del
// dispositivo del visitante. Alguien mirando desde Colombia ve los estados según la hora
// de Argentina.
//
// Técnica: convertimos cualquier instante a "hora de pared" de Argentina (un Date cuyos
// getters locales getDay/getDate/getHours… devuelven los números de Argentina). Como el
// resto del código construye las horas de las actividades con new Date(y,m-1,d,hh,mm) y
// compara con getters locales, todo queda en el MISMO espacio de "hora de pared" y el
// offset del dispositivo se cancela.

export const EVENT_TZ = "America/Argentina/Buenos_Aires";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function partsInEventTz(instant: Date) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const o: Record<string, string> = {};
  for (const p of fmt.formatToParts(instant)) if (p.type !== "literal") o[p.type] = p.value;
  const hour = o.hour === "24" ? "0" : o.hour; // algunos motores devuelven "24" a medianoche
  return { y: +o.year, mo: +o.month, d: +o.day, h: +hour, min: +o.minute, s: +o.second };
}

/** Un Date cuyos getters LOCALES reflejan la hora de Argentina para ese instante. */
export function toEventWallClock(instant: Date): Date {
  const p = partsInEventTz(instant);
  return new Date(p.y, p.mo - 1, p.d, p.h, p.min, p.s);
}

/** Ahora real, en hora de pared de Argentina. */
export function eventNow(): Date {
  return toEventWallClock(new Date());
}

/**
 * Parsea el override `?now=`.
 *  - Con offset/Z (ej. 2026-09-30T14:09:00-03:00) → instante real convertido a hora de Argentina.
 *  - Naive, sin offset (ej. 2026-09-30T14:09) → los componentes se toman como hora de Argentina.
 * Devuelve null si no se puede parsear.
 */
export function parseNowParam(raw: string): Date | null {
  const s = (raw || "").trim();
  if (!s) return null;
  const hasTz = /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(s);
  if (hasTz) {
    const inst = new Date(s);
    return isNaN(+inst) ? null : toEventWallClock(inst);
  }
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (m) {
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  }
  const inst = new Date(s);
  return isNaN(+inst) ? null : toEventWallClock(inst);
}

/** Nombre del mes (0 = enero). Para el copy del hero DURANTE, sin hardcodear el mes. */
export function monthName(monthIndex0: number): string {
  return MESES[monthIndex0] ?? "";
}

/** Fecha ISO (YYYY-MM-DD) → Date en hora de pared (mismo espacio que eventNow/at). */
export function isoToWallClock(iso: string, endOfDay = false): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return endOfDay ? new Date(y, m - 1, d, 23, 59, 59) : new Date(y, m - 1, d, 0, 0, 0);
}

/** ¿`now` (hora de Argentina) cae dentro del rango del evento [start, end]? → DURANTE. */
export function isWithinEvent(now: Date, startIso: string, endIso: string): boolean {
  return now >= isoToWallClock(startIso) && now <= isoToWallClock(endIso, true);
}
