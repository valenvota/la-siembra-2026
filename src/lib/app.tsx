import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { data } from "../data/event";
import { loadActivities } from "../data/programa";

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
}

const Ctx = createContext<AppCtx | null>(null);

function isoToDate(iso: string, endOfDay = false): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return endOfDay ? new Date(y, m - 1, d, 23, 59, 59) : new Date(y, m - 1, d, 0, 0, 0);
}

/**
 * Producción: el modo se resuelve AUTOMÁTICAMENTE por fecha (durante si hoy cae en el
 * rango del evento; antes en caso contrario). Override configurable para testing con
 * ?modo=antes|durante. ?now=ISO simula el reloj. ?dev=1 muestra el toggle de desarrollo.
 */
function readParams(): { mode: Mode; now: Date; dev: boolean } {
  const p = new URLSearchParams(location.search);
  const modo = p.get("modo");
  const dev = p.get("dev") === "1";
  const override: Mode | null = modo === "durante" ? "durante" : modo === "antes" ? "antes" : null;

  const nowParam = p.get("now");
  // Al forzar DURANTE sin reloj explícito, simulamos miércoles 30/09/2026 15:30.
  const defaultNow = override === "durante" && !nowParam ? new Date(2026, 8, 30, 15, 30, 0) : new Date();
  const now = nowParam ? new Date(nowParam) : defaultNow;

  let mode: Mode;
  if (override) mode = override;
  else {
    const within = now >= isoToDate(data.event.start) && now <= isoToDate(data.event.end, true);
    mode = within ? "durante" : "antes";
  }
  return { mode, now, dev };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(readParams, []);
  const [mode, setMode] = useState<Mode>(initial.mode);
  const [now, setNow] = useState<Date>(initial.now);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [programDay, setProgramDay] = useState<string | null>(null);
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

  // Seleccionar un área (mapa, chips, tarjetas) limpia el día objetivo → el programa
  // hace su auto-salto genérico. El spotlight setea programDay después para un día puntual.
  function selectArea(id: string | null) {
    setProgramDay(null);
    setSelectedAreaId(id);
  }

  // Al cambiar de modo con el toggle, ajustamos el "ahora" simulado.
  function changeMode(m: Mode) {
    setMode(m);
    setNow(m === "durante" ? new Date(2026, 8, 30, 15, 30, 0) : new Date());
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
