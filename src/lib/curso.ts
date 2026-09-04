import type { Activity } from "../data/types";

/**
 * Filtro "Mi curso": el campo `curso` de la planilla es texto libre e inconsistente
 * (en Primaria A/V/N = Azul/Verde/Naranja; en Secundaria A/B son secciones; Inicial usa
 * "Sala/Salas N"; hay "Nivel Secundario", "Toda la comunidad", etc.). Para que sea robusto
 * filtramos por GRADO/SALA (no por sección): una familia de "5.° Azul" ve todo lo de 5.°.
 *
 * Claves canónicas: "inicial-sala-3", "primaria-5", "secundaria-3".
 * Especiales: "general" (comunidad, se muestra siempre), "nivel-primaria"/"nivel-secundaria"
 * /"nivel-inicial" (actividad de todo el nivel → se muestra para cualquier curso de ese nivel).
 */
export function cursoKeys(a: Activity): string[] {
  const lvl = a.level ?? "";
  const c = (a.curso ?? "").trim().toLowerCase();

  if (lvl === "comunidad" || !c || /toda la comunidad|comunidad general/.test(c)) return ["general"];

  if (lvl === "inicial") {
    if (/sala/.test(c)) {
      const nums = c.match(/\d+/g);
      if (nums) return nums.map((n) => `inicial-sala-${n}`);
    }
    return ["nivel-inicial"];
  }

  if (lvl === "primaria" || lvl === "secundaria") {
    if (/nivel/.test(c)) return [`nivel-${lvl}`]; // "Nivel Secundario"
    const g = c.match(/(\d)/); // primer dígito = grado/año
    if (g) return [`${lvl}-${g[1]}`];
    return [`nivel-${lvl}`];
  }
  return ["general"];
}

function nivelOf(key: string): string {
  return key.split("-")[0]; // "primaria-5" → "primaria", "inicial-sala-3" → "inicial"
}

/** ¿La actividad se muestra con el curso filtrado? Los eventos de comunidad y de todo el
 *  nivel siempre entran; el resto, solo si coincide el grado/sala. */
export function matchesCurso(a: Activity, filter: string | null): boolean {
  if (!filter) return true;
  const keys = cursoKeys(a);
  if (keys.includes("general")) return true;
  if (keys.includes(`nivel-${nivelOf(filter)}`)) return true;
  return keys.includes(filter);
}

const ORDER: Record<string, number> = { inicial: 0, primaria: 1, secundaria: 2 };
const NIVEL_LABEL: Record<string, string> = { inicial: "Inicial", primaria: "Primaria", secundaria: "Secundaria" };

export function cursoLabel(key: string): string {
  const [niv, a, b] = key.split("-");
  if (niv === "inicial") return `Sala ${b}`; // inicial-sala-N
  const n = a; // primaria-N / secundaria-N
  return niv === "primaria" ? `${n}.° grado` : `${n}.° año`;
}

export interface CursoGroup {
  nivel: string;
  label: string;
  options: { key: string; label: string }[];
}

/** Opciones de curso presentes en el programa, agrupadas por nivel (para el selector). */
export function cursoOptions(activities: Activity[]): CursoGroup[] {
  const keys = new Set<string>();
  for (const a of activities) {
    for (const k of cursoKeys(a)) {
      if (k !== "general" && !k.startsWith("nivel-")) keys.add(k);
    }
  }
  const byNivel = new Map<string, { key: string; label: string }[]>();
  for (const k of keys) {
    const niv = nivelOf(k);
    if (!byNivel.has(niv)) byNivel.set(niv, []);
    byNivel.get(niv)!.push({ key: k, label: cursoLabel(k) });
  }
  const groups: CursoGroup[] = [];
  for (const [niv, opts] of byNivel) {
    opts.sort((x, y) => x.label.localeCompare(y.label, "es", { numeric: true }));
    groups.push({ nivel: niv, label: NIVEL_LABEL[niv] ?? niv, options: opts });
  }
  groups.sort((x, y) => (ORDER[x.nivel] ?? 9) - (ORDER[y.nivel] ?? 9));
  return groups;
}
