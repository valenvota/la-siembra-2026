// Función serverless (Vercel) — fuente del programa para la web.
// Lee la pestaña WEB de la planilla, la normaliza y la devuelve como JSON cacheado.
// El cliente (src/data/programa.ts) le pega a este endpoint; si falla, cae a gviz directo
// y, en última instancia, al snapshot embebido (src/data/event.ts). La web nunca queda vacía.

import { csvToActivities, sheetCsvUrl } from "../src/data/normalize";

// Vercel Node function. `res` trae los helpers .status()/.setHeader()/.send() de Vercel.
export default async function handler(_req: any, res: any) {
  try {
    const r = await fetch(sheetCsvUrl(), { redirect: "follow" });
    if (!r.ok) throw new Error(`sheet responded ${r.status}`);
    const csv = await r.text();
    const activities = csvToActivities(csv);
    // Cache en el edge: 60s fresco + 5 min sirviendo stale mientras revalida.
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).send(JSON.stringify({ activities, count: activities.length }));
  } catch (e) {
    // 502 → el cliente cae a su fallback (gviz directo / snapshot).
    res.status(502).json({ error: "No se pudo leer la planilla WEB", detail: String(e) });
  }
}
