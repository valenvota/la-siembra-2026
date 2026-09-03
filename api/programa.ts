// Función serverless (Vercel) — proxy CACHEADO del programa.
// A propósito NO importa nada del proyecto (ni normalize): así el bundle de la función es
// mínimo y no puede fallar al cargar el módulo. Solo baja el CSV de la pestaña WEB y lo
// devuelve con cache en el edge. El cliente (src/data/programa.ts) lo normaliza; si esto
// falla, el cliente cae a gviz directo y luego al snapshot embebido. La web nunca queda vacía.

const SHEET_ID = "1lqRVdzMKGCm78bpKpEZTtAnDZuYDlJLu5z89l2zlFjE";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=WEB`;

export default async function handler(_req: any, res: any) {
  try {
    const r = await fetch(CSV_URL, { redirect: "follow" });
    if (!r.ok) throw new Error(`sheet responded ${r.status}`);
    const csv = await r.text();
    // 60s fresco + 5 min sirviendo stale mientras revalida.
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.status(200).send(csv);
  } catch (e) {
    res.status(502).send(`error: ${String(e)}`);
  }
}
