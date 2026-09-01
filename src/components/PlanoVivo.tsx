import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useApp, areaById } from "../lib/app";
import { activityStatus, dayLabel, statusLabel, timeRange } from "../lib/time";
import type { Area } from "../data/types";

export function PlanoVivo() {
  const { data, selectedAreaId, selectArea } = useApp();
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const activeAreaIds = useMemo(() => new Set(data.activities.map((a) => a.areaId)), [data]);
  const seededAreas = useMemo(
    () => data.areas.filter((a) => activeAreaIds.has(a.id)).sort((x, y) => x.referenceNumber - y.referenceNumber),
    [data, activeAreaIds]
  );

  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Entrada GSAP: brotan los pines + se dibuja el recorrido al entrar en viewport.
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = wrapRef.current;
    if (!root) return;
    const markers = root.querySelectorAll<HTMLElement>(".pin");
    const path = root.querySelector<SVGPathElement>(".route-path");
    if (reduce) {
      gsap.set(markers, { scale: 1, opacity: 1 });
      if (path) path.style.strokeDashoffset = "0";
      return;
    }
    gsap.set(markers, { scale: 0.2, opacity: 0, transformOrigin: "50% 100%" });
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const tl = gsap.timeline();
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0.1);
      }
      tl.to(markers, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.04 }, 0.15);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && play()),
      { threshold: 0.15 }
    );
    io.observe(root);
    // Fallback: los pines son contenido esencial, nunca deben depender de que dispare el observer.
    const safety = window.setTimeout(play, 2200);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [size.w]);

  // Focus mobile: al seleccionar una zona, el mapa (ampliado) hace paneo suave para centrarla.
  useEffect(() => {
    if (!selectedAreaId) return;
    const mobile = matchMedia("(max-width: 760px)").matches;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!mobile || !stage || !canvas) return;
    const area = areaById(selectedAreaId);
    if (!area) return;
    const hx = (area.hotspot.x / 100) * canvas.clientWidth;
    const hy = (area.hotspot.y / 100) * canvas.clientHeight;
    stage.scrollTo({ left: hx - stage.clientWidth / 2, top: hy - stage.clientHeight / 2, behavior: "smooth" });
  }, [selectedAreaId]);

  function pick(id: string) {
    selectArea(id === selectedAreaId ? null : id);
  }

  const pt = (a: Area) => ({ x: (a.hotspot.x / 100) * size.w, y: (a.hotspot.y / 100) * size.h });
  const routeD = seededAreas.map((a, i) => `${i === 0 ? "M" : "L"} ${pt(a).x.toFixed(1)} ${pt(a).y.toFixed(1)}`).join(" ");
  const selected = selectedAreaId ? areaById(selectedAreaId) : null;

  return (
    <section id="mapa" className="plano">
      <div className="wrap">
        <p className="eyebrow inst reveal">Hölters Natur · 12 hectáreas</p>
        <h2 className="sec-h reveal" data-delay="1">Recorré el campus</h2>
        <p className="lead reveal" data-delay="2">
          Un territorio para recorrer. Elegí una zona del campus y descubrí qué está pasando ahí.
        </p>
      </div>

      <div className="wrap">
        {/* Selector de zonas — control primario en mobile, targets cómodos */}
        <div className="area-selector reveal" role="tablist" aria-label="Elegí una zona del campus">
          <button className={`area-opt${!selectedAreaId ? " on" : ""}`} role="tab" aria-selected={!selectedAreaId} onClick={() => selectArea(null)}>
            Todo el campus
          </button>
          {seededAreas.map((a) => (
            <button key={a.id} className={`area-opt${a.id === selectedAreaId ? " on" : ""}`} role="tab" aria-selected={a.id === selectedAreaId} onClick={() => pick(a.id)}>
              <span className="ref-badge">{a.referenceNumber}</span>
              {a.short || a.displayName}
            </button>
          ))}
        </div>

        <div className={`plano-layout${selected ? " has-panel" : ""}`} ref={wrapRef}>
          <div className="plano-stage" ref={stageRef}>
            <span className="plano-tag" aria-hidden="true">Plano · Hölters Natur</span>
            <div className="plano-canvas" ref={canvasRef}>
              <img className="plano-img" src="/assets/plano-holters.png" alt="Plano ilustrado del campus de Hölters Natur" />
              <div className="plano-tint" aria-hidden="true" />
              <svg className="plano-overlay" width={size.w} height={size.h} preserveAspectRatio="none" aria-hidden="true">
                <path className="route-path" d={routeD} fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 10" opacity="0.75" />
              </svg>
              {data.areas.map((a) => {
                const seeded = activeAreaIds.has(a.id);
                const isSel = a.id === selectedAreaId;
                return (
                  <button
                    key={a.id}
                    className={`pin${seeded ? " seeded" : ""}${isSel ? " sel" : ""}${a.headline ? " headline" : ""}`}
                    style={{ left: `${a.hotspot.x}%`, top: `${a.hotspot.y}%` }}
                    onClick={() => pick(a.id)}
                    aria-label={`${a.displayName} — ${seeded ? "ver actividades" : "sin actividades"}`}
                    aria-pressed={isSel}
                  >
                    <span className="pin-hit" />
                    <span className="pin-num">{a.referenceNumber}</span>
                    <span className="pin-label">{a.short || a.displayName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AreaPanel area={selected} onClose={() => selectArea(null)} />
        </div>

        <p className="plano-hint only-mobile reveal">Deslizá el plano para explorar · tocá una zona o usá el selector.</p>
      </div>
    </section>
  );
}

function AreaPanel({ area, onClose }: { area: Area | null | undefined; onClose: () => void }) {
  const { data, mode, now } = useApp();
  if (!area) {
    return (
      <aside className="plano-panel empty">
        <div className="panel-hint">
          <span className="ref-badge big">?</span>
          <p>Elegí una zona del mapa o del selector para ver sus actividades.</p>
        </div>
      </aside>
    );
  }
  const acts = data.activities
    .filter((a) => a.areaId === area.id)
    .sort((a, b) => (a.day + (a.start || "")).localeCompare(b.day + (b.start || "")));

  return (
    <aside className="plano-panel">
      <div className="panel-head">
        <div>
          <div className="panel-eyebrow"><span className="ref-badge">{area.referenceNumber}</span> Zona seleccionada</div>
          <h3 className="panel-title">{area.displayName}</h3>
        </div>
        <button className="panel-close" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
      {area.blurb && <p className="panel-blurb">{area.blurb}</p>}
      <div className="panel-list">
        {acts.length === 0 && <p className="muted">Sin actividades programadas por ahora.</p>}
        {acts.map((a) => {
          const st = activityStatus(a, now);
          return (
            <div className={`panel-act st-${st}`} key={a.id}>
              <div className="panel-act-top">
                {mode === "durante" ? (
                  <span className={`tag st-${st}`}><span className={`dot${st === "ahora" ? " live-dot" : ""}`} />{statusLabel(st)}</span>
                ) : (
                  <span className="panel-day">{dayLabel(a.day)}</span>
                )}
                <span className="panel-time">{timeRange(a)}</span>
              </div>
              <div className="panel-act-name">{a.name}</div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
