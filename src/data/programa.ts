// Carga del programa en el cliente, con degradación en cascada:
//   1) /api/programa       (serverless de Vercel, cacheado — producción)
//   2) gviz directo        (dev local, o si la función falla — CORS ok)
//   3) null → el caller usa el snapshot embebido (src/data/event.ts)
// Así la web nunca queda sin programa.

import type { Activity } from "./types";
import { csvToActivities, sheetCsvUrl } from "./normalize";

export async function loadActivities(): Promise<Activity[] | null> {
  // 1) Función serverless
  try {
    const r = await fetch("/api/programa", { headers: { accept: "application/json" } });
    if (r.ok) {
      const j = await r.json();
      if (Array.isArray(j?.activities) && j.activities.length) return j.activities as Activity[];
    }
  } catch {
    /* sigue al fallback */
  }
  // 2) gviz directo (sirve en dev, donde /api no corre)
  try {
    const r = await fetch(sheetCsvUrl());
    if (r.ok) {
      const acts = csvToActivities(await r.text());
      if (acts.length) return acts;
    }
  } catch {
    /* sigue al fallback */
  }
  // 3) sin datos frescos
  return null;
}
