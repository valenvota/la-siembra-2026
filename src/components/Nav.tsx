import { useState } from "react";
import { useApp } from "../lib/app";

const QUICK = [
  { id: "programa", label: "Programa", icon: "M4 5h16M4 12h16M4 19h10" },
  { id: "mapa", label: "Mapa", icon: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14" },
  { id: "streaming", label: "En vivo", icon: "M8 5v14l11-7z" },
  { id: "info", label: "Cómo llegar", icon: "M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function Nav() {
  const { mode, setMode, showModeToggle } = useApp();
  const [open, setOpen] = useState(false);

  const live = mode === "durante";

  function go(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); }}>
          <img className="brand-logo" src="/assets/brand/logo-siembra-2026.png" alt="Siembra · Edición 2026" />
          <span className="brand-x" aria-hidden="true">×</span>
          <img className="brand-holters-logo" src="/assets/brand/isologo-holters-horizontal.png" alt="Hölters Natur" />
        </a>

        <nav className="quick" aria-label="Accesos rápidos">
          {QUICK.map((q) => (
            <button key={q.id} className={`quick-item${q.id === "streaming" && live ? " is-live" : ""}`} onClick={() => go(q.id)}>
              {q.id === "streaming" && live ? <span className="dot live-dot" style={{ background: "var(--live)" }} /> : <Icon d={q.icon} />}
              {q.label}
            </button>
          ))}
        </nav>

        <div className="nav-tools">
          {showModeToggle && (
            <button className="statepill" onClick={() => setMode(mode === "antes" ? "durante" : "antes")} title="Vista previa — alterná entre el estado Antes y Durante del festival (temporal, se quita al lanzar)">
              <span className="statepill-tag">vista</span>
              <span className={mode === "antes" ? "on" : ""}>Antes</span>
              <span className={mode === "durante" ? "on" : ""}>Durante</span>
            </button>
          )}
          <button className="icon-btn burger" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="nav-sheet">
          {showModeToggle && (
            <div className="sheet-state">
              <span className="sheet-state-label">Vista previa</span>
              <div className="statepill" role="group" aria-label="Cambiar entre Antes y Durante">
                <button className={mode === "antes" ? "on" : ""} onClick={() => { setMode("antes"); }}>Antes</button>
                <button className={mode === "durante" ? "on" : ""} onClick={() => { setMode("durante"); }}>Durante</button>
              </div>
            </div>
          )}
          {QUICK.map((q) => (
            <button key={q.id} className={`sheet-item${q.id === "streaming" && live ? " is-live" : ""}`} onClick={() => go(q.id)}>
              {q.id === "streaming" && live ? <span className="dot live-dot" style={{ background: "var(--live)" }} /> : <Icon d={q.icon} />}
              {q.id === "streaming" && live ? "Estamos en vivo" : q.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
