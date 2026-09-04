import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useApp, areaById } from "../lib/app";
import { dayNumber, dayWeekday, duringSort, isFreeRoam } from "../lib/time";
import { cursoOptions, matchesCurso } from "../lib/curso";
import { ActivityCard } from "./ActivityCard";

function daysBetween(start: string, end: string): string[] {
  const out: string[] = [];
  const [ys, ms, ds] = start.split("-").map(Number);
  const [ye, me, de] = end.split("-").map(Number);
  const cur = new Date(ys, ms - 1, ds);
  const last = new Date(ye, me - 1, de);
  while (cur <= last) {
    out.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`);
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function Programa() {
  const { data, mode, now, selectedAreaId, selectArea, programDay, cursoFilter, setCursoFilter } = useApp();
  const cursoGroups = useMemo(() => cursoOptions(data.activities), [data]);
  const days = useMemo(() => daysBetween(data.event.start, data.event.end), [data]);
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const initialDay = mode === "durante" && days.includes(todayIso) ? todayIso : days[0];
  const [day, setDay] = useState(initialDay);

  const area = selectedAreaId ? areaById(selectedAreaId) : null;
  const gridRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    let l = data.activities.filter((a) => a.day === day);
    if (selectedAreaId) l = l.filter((a) => a.areaId === selectedAreaId);
    if (cursoFilter) l = l.filter((a) => matchesCurso(a, cursoFilter));
    l = [...l].sort((a, b) => {
      if (mode === "durante") return duringSort(a, b, now);
      if (isFreeRoam(a) && !isFreeRoam(b)) return 1;
      if (!isFreeRoam(a) && isFreeRoam(b)) return -1;
      return (a.start || "").localeCompare(b.start || "");
    });
    return l;
  }, [data, day, selectedAreaId, cursoFilter, mode, now]);

  // Día objetivo explícito (deep-link del spotlight a una actividad puntual).
  useEffect(() => {
    if (programDay) setDay(programDay);
  }, [programDay]);

  // Al filtrar por una zona sin actividades en el día actual, saltar al primer día que sí las tenga.
  // Mejora el vínculo mapa→programa sin tocar la lógica del filtro. El día objetivo explícito gana.
  useEffect(() => {
    if (!selectedAreaId || programDay) return;
    const hasOnDay = data.activities.some((a) => a.areaId === selectedAreaId && a.day === day);
    if (hasOnDay) return;
    const firstDay = days.find((d) => data.activities.some((a) => a.areaId === selectedAreaId && a.day === d));
    if (firstDay) setDay(firstDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAreaId]);

  // Re-stagger "brotar" al cambiar de día o filtro.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = gridRef.current?.querySelectorAll(".act");
    if (cards && cards.length) gsap.fromTo(cards, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.42, ease: "power2.out", stagger: 0.05 });
  }, [day, selectedAreaId, cursoFilter, mode]);

  return (
    <section id="programa" className={`programa${area ? " is-filtered" : ""}`}>
      <div className="wrap">
        <p className="eyebrow reveal">{mode === "durante" ? "Próximas actividades" : "Planificá tu visita"}</p>
        <h2 className="sec-h reveal" data-delay="1">Programa</h2>
        <p className="lead reveal" data-delay="2">
          Cinco días de teatro, música, ciencia, danza, debates, arte y encuentro. Elegí un día y descubrí qué te espera.
        </p>

        <div className="prog-controls reveal" data-delay="2">
          <div className="prog-days" role="tablist" aria-label="Días">
            {days.map((d) => (
              <button key={d} role="tab" aria-selected={d === day} className={`day-tab${d === day ? " on" : ""}`} onClick={() => setDay(d)}>
                <span className="day-wd">{dayWeekday(d)}</span>
                <span className="day-nd">{dayNumber(d)}</span>
                {d === todayIso && mode === "durante" && <span className="day-hoy">hoy</span>}
              </button>
            ))}
          </div>
          {cursoGroups.length > 0 && (
            <div className={`prog-curso${cursoFilter ? " on" : ""}`}>
              <label htmlFor="curso-sel">Mi curso</label>
              <select id="curso-sel" value={cursoFilter ?? ""} onChange={(e) => setCursoFilter(e.target.value || null)}>
                <option value="">Todos los cursos</option>
                {cursoGroups.map((g) => (
                  <optgroup key={g.nivel} label={g.label}>
                    {g.options.map((o) => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {cursoFilter && (
                <button className="prog-curso-clear" onClick={() => setCursoFilter(null)} aria-label="Quitar filtro de curso">✕</button>
              )}
            </div>
          )}
        </div>

        {area && (
          <div className="prog-filter" role="status" aria-live="polite">
            <span className="pf-pin" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.4" />
              </svg>
            </span>
            <span className="pf-text">
              Filtrado por zona · <span className="ref-badge">{area.referenceNumber}</span> <b>{area.displayName}</b>
              <span className="pf-count">{list.length} {list.length === 1 ? "actividad" : "actividades"} este día</span>
            </span>
            <button className="pf-clear" onClick={() => selectArea(null)}>Ver todo el programa ✕</button>
          </div>
        )}

        <div className="prog-grid reveal" data-delay="2" ref={gridRef}>
          {list.length === 0 && <p className="muted">No hay actividades para este filtro.</p>}
          {list.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
        <p className="prog-nota reveal">El sábado 3 de octubre, estudiantes de Hölters Natur y del Colegio San Pío X participan de la Fogata de San Juan en Los Cardales.</p>
        <p className="prog-legal muted reveal">Las actividades y horarios pueden estar sujetos a modificaciones.</p>
      </div>
    </section>
  );
}
