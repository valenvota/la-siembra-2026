import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { data } from "../data/event";
import { loadActivities } from "../data/programa";
import { eventNow, parseNowParam, isWithinEvent } from "./clock";

export type Mode = "antes" | "durante";

/**
 * Toggle Antes/Durante en el nav. APAGADO para publicación (etapa pública): el público
 * NO ve el toggle; el modo se resuelve solo por fecha. El equipo sigue pudiendo previsualizar
 * el estado Durante con `?modo=durante` en la URL (funciona siempre, independiente de esto).
 */
export const PREVIEW_MODE_TOGGLE = false;

interface AppCtx {
  mode: Mode;
  setMode: (m: Mode) => void;
  now: Date;
  data: typeof data;
  /** true sólo con ?dev=1 — habilita controles de desarrollo (no navegación de producción). */
  dev: boolean;
  /** Muestra el toggle Antes/Durante: con ?dev=1 o mientras PREVIEW_MODE_TOGGLE esté activo. */
  showModeToggle: boolean;
  /** Área seleccionada — nexo mapa↔programa. */
  selectedAreaId: string | null;
  selectArea: (id: string | null) => void;
  /** Día objetivo del programa (deep-link desde el spotlight a una actividad puntual). */
  programDay: string | null;
  setProgramDay: (d: string | null) => void;
  /** Filtro "Mi curso" — grado/sala elegido por la familia (persistido). null = todos. */
  cursoFilter: string | null;
  setCursoFilter: (c: string | null) => void;
}

const Ctx = createContext<AppCtx | null>(null);

/**
 * Producción: el modo se resuelve AUTOMÁTICAMENTE por fecha (durante si hoy cae en el
 * rango del evento; antes en caso contrario). Override configurable para testing con
 * ?modo=antes|durante. ?now=ISO simula el reloj. ?dev=1 muestra el toggle de desarrollo.
 */
interface Params {
  /** Modo forzado por ?modo=; null = derivado por fecha (producción). */
  modeOverride: Mode | null;
  /** Instante base del reloj, en hora de pared de Argentina. */
  base: Date;
  /** ?now= presente → reloj CONGELADO en `base` (testing de un momento exacto). */
  frozen: boolean;
  /** ?modo=durante sin ?now → reloj SIMULADO que avanza desde `base` (QA del "durante"). */
  simulated: boolean;
  dev: boolean;
}

function readParams(): Params {
  const p = new URLSearchParams(location.search);
  const dev = p.get("dev") === "1";
  const modo = p.get("modo");
  const modeOverride: Mode | null = modo === "durante" ? "durante" : modo === "antes" ? "antes" : null;

  const parsed = p.get("now") ? parseNowParam(p.get("now")!) : null;
  const frozen = !!parsed;
  const simulated = !parsed && modeOverride === "durante";

  let base: Date;
  if (parsed) base = parsed;
  else if (simulated) base = new Date(2026, 8, 30, 15, 30, 0); // miércoles 30/09 15:30 (avanza)
  else base = eventNow(); // producción: hora real de Argentina

  return { modeOverride, base, frozen, simulated, dev };
}

function within(now: Date): boolean {
  return isWithinEvent(now, data.event.start, data.event.end);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(readParams, []);

  // Reloj REACTIVO del evento (hora de Argentina). Se recalcula cada 30s sin refresh, para
  // que AHORA/PRÓXIMA/FINALIZADA, "Qué pasa ahora", el orden del programa y el cambio de
  // día/modo se actualicen solos. `?now=` congela el reloj; `?modo=durante` lo simula avanzando.
  const baseRef = useRef({ base: initial.base.getTime(), mount: Date.now(), frozen: initial.frozen, simulated: initial.simulated });
  const readClock = () => {
    const b = baseRef.current;
    if (b.frozen) return new Date(b.base);
    if (b.simulated) return new Date(b.base + (Date.now() - b.mount));
    return eventNow();
  };
  const [now, setNow] = useState<Date>(readClock);
  const [modeOverride, setModeOverride] = useState<Mode | null>(initial.modeOverride);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [programDay, setProgramDay] = useState<string | null>(null);
  const [cursoFilter, setCursoFilterState] = useState<string | null>(() => {
    try { return localStorage.getItem("siembra-curso") || null; } catch { return null; }
  });
  const setCursoFilter = (c: string | null) => {
    setCursoFilterState(c);
    try { c ? localStorage.setItem("siembra-curso", c) : localStorage.removeItem("siembra-curso"); } catch { /* sin storage */ }
  };
  const dev = initial.dev;

  // Programa en vivo desde la planilla WEB (Google Sheets). Arranca con el snapshot
  // embebido (data.activities) y se re-hidrata al montar; si la carga falla, queda el snapshot.
  const [activities, setActivities] = useState(data.activities);
  useEffect(() => {
    let alive = true;
    loadActivities().then((live) => {
      if (alive && live && live.length) setActivities(live);
    });
    return () => { alive = false; };
  }, []);
  const liveData = useMemo(() => ({ ...data, activities }), [activities]);

  // Tick del reloj: cada 30s (salvo congelado por ?now=). Cleanup del interval al desmontar.
  useEffect(() => {
    if (baseRef.current.frozen) return;
    const id = setInterval(() => setNow(readClock()), 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modo: en producción se deriva por fecha (reactivo, cruza el borde PRE/DURANTE sin refresh);
  // el override (?modo= o el toggle dev) tiene prioridad.
  const mode: Mode = modeOverride ?? (within(now) ? "durante" : "antes");

  // Debug de QA — SOLO con ?dev=1 (invisible en producción): expone reloj/modo para verificar
  // que el tick de 30s actualiza el estado sin refresh.
  useEffect(() => {
    if (!dev) return;
    (window as unknown as { __siembra?: unknown }).__siembra = { now: now.toString(), mode };
  }, [dev, now, mode]);

  // Seleccionar un área (mapa, chips, tarjetas) limpia el día objetivo → el programa
  // hace su auto-salto genérico. El spotlight setea programDay después para un día puntual.
  function selectArea(id: string | null) {
    setProgramDay(null);
    setSelectedAreaId(id);
  }

  // Toggle de desarrollo (?dev=1): fija el modo y re-basea el reloj para ver un estado poblado.
  function changeMode(m: Mode) {
    setModeOverride(m);
    const simulated = m === "durante";
    baseRef.current = {
      base: (simulated ? new Date(2026, 8, 30, 15, 30, 0) : eventNow()).getTime(),
      mount: Date.now(), frozen: false, simulated,
    };
    setNow(readClock());
    setSelectedAreaId(null);
    setProgramDay(null);
  }

  const value: AppCtx = {
    mode,
    setMode: changeMode,
    now,
    data: liveData,
    dev,
    showModeToggle: dev || PREVIEW_MODE_TOGGLE,
    selectedAreaId,
    selectArea,
    programDay,
    setProgramDay,
    cursoFilter,
    setCursoFilter,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp fuera de AppProvider");
  return c;
}

export function areaById(id: string) {
  return data.areas.find((a) => a.id === id);
}

/** Observer global "brotar": revela elementos .reveal al entrar en viewport. */
export function useRevealObserver(dep: unknown) {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reduce) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}
