// Carga del programa en el cliente, con degradación en cascada:
//   1) /api/programa       (proxy serverless cacheado de Vercel — producción)
//   2) gviz directo        (dev local, o si la función falla — CORS ok)
//   3) null → el caller usa el snapshot embebido (src/data/event.ts)
// Ambas fuentes devuelven el CSV de la pestaña WEB; la normalización es siempre local.

import type { Activity } from "./types";
import { csvToActivities, sheetCsvUrl } from "./normalize";

async function fetchCsv(url: string): Promise<string | null> {
  try {
    const r = await fetch(url);
    if (r.ok) return await r.text();
  } catch {
    /* sin conexión / bloqueado */
  }
  return null;
}

export async function loadActivities(): Promise<Activity[] | null> {
  for (const url of ["/api/programa", sheetCsvUrl()]) {
    const csv = await fetchCsv(url);
    if (csv) {
      const acts = csvToActivities(csv);
      if (acts.length) return acts;
    }
  }
  return null;
}
