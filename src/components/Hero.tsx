import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useApp } from "../lib/app";
import { duringSort, activityStatus } from "../lib/time";
import { ActivityCard } from "./ActivityCard";
import { BroteHero, SelloLive } from "./Brote";

function BroteArt() {
  return (
    <svg className="brote" viewBox="0 0 400 380" fill="none" aria-hidden="true">
      {/* sol */}
      <circle cx="300" cy="96" r="46" fill="var(--yellow)" opacity="0.9" />
      <circle cx="300" cy="96" r="66" stroke="var(--yellow)" strokeWidth="2" strokeDasharray="3 9" opacity="0.7" />
      {/* cielo institucional (guiño azul Hölters) */}
      <circle cx="110" cy="70" r="7" fill="var(--blue)" opacity="0.8" />
      <circle cx="150" cy="48" r="4" fill="var(--blue)" opacity="0.6" />
      {/* tierra / surcos */}
      <path d="M20 300 Q200 268 380 300 L380 380 L20 380 Z" fill="var(--green-soft)" />
      <path d="M40 322 Q200 300 360 322" stroke="var(--green)" strokeWidth="2.5" strokeDasharray="2 12" opacity="0.6" />
      <path d="M50 344 Q200 326 350 344" stroke="var(--green)" strokeWidth="2.5" strokeDasharray="2 12" opacity="0.5" />
      {/* tallo */}
      <path d="M200 300 C200 250 198 220 200 180" stroke="var(--green-deep)" strokeWidth="9" strokeLinecap="round" />
      {/* hoja izq */}
      <path d="M200 232 C160 224 128 196 120 156 C168 156 198 188 200 232 Z" fill="var(--green)" />
      {/* hoja der */}
      <path d="M200 208 C244 202 280 172 292 130 C240 128 206 162 200 208 Z" fill="var(--green-deep)" />
      {/* brote superior */}
      <path d="M200 182 C186 160 186 138 200 120 C214 138 214 160 200 182 Z" fill="var(--green)" />
      <circle cx="200" cy="120" r="7" fill="var(--yellow)" />
    </svg>
  );
}

function BroteMark() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M16 30 V16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 20c-6 0-9-3-9-8 5 0 9 3 9 8Z" fill="currentColor" />
      <path d="M16 17c5 0 8-3 8-7-5 0-8 3-8 7Z" fill="currentColor" opacity=".7" />
    </svg>
  );
}

/** Contenedor de media del hero — recibe footage real de Hölters sin tocar el layout.
 *  Desktop 16:9 · Mobile 4:5. El brote queda como identidad gráfica de apoyo, no protagonista. */
function HeroMedia() {
  const { data } = useApp();
  const m = data.event.heroMedia;
  const hasVideo = m?.videoDesktop || m?.videoMobile;
  const hasImg = m?.imageDesktop || m?.imageMobile;
  return (
    <figure className="hero-media reveal" data-delay="2">
      {hasVideo ? (
        <video className="hero-media-el" autoPlay muted loop playsInline poster={m?.poster}>
          {m?.videoMobile && <source src={m.videoMobile} media="(max-width:640px)" />}
          {m?.videoDesktop && <source src={m.videoDesktop} />}
        </video>
      ) : hasImg ? (
        <picture>
          {m?.imageMobile && <source srcSet={m.imageMobile} media="(max-width:640px)" />}
          <img className="hero-media-el" src={m?.imageDesktop || m?.imageMobile} alt={m?.alt || "Campus de Hölters Natur"} />
        </picture>
      ) : (
        <div className="hero-media-ph" role="img" aria-label="Espacio reservado para foto o video del campus">
          <BroteArt />
          <span className="ph-label">Foto / loop del campus · 16:9 desktop · 4:5 mobile</span>
        </div>
      )}
      <span className="hero-motif" aria-hidden="true"><BroteMark /> Siembra</span>
    </figure>
  );
}

/** Motion del hero: florecer (pétalos del brote, una vez) + acompañar (rotación ligada al scroll). */
function useBroteMotion(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = ref.current;
    if (!root) return;
    const brote = root.querySelector<HTMLElement>(".hero-brote-el");
    const petals = root.querySelectorAll<SVGCircleElement>(".brote-hero-petal");
    const core = root.querySelector<SVGGElement>(".semilla-core");
    const isDur = brote?.classList.contains("dur");
    if (reduce) {
      if (brote) gsap.fromTo(brote, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      return;
    }
    // florecer: los pétalos abren una sola vez
    if (isDur && petals.length) {
      // "Estamos en vivo": floración con rebote + estallido del centro (tipo Superlocal).
      // fromTo + clearProps al terminar → estado final robusto aunque StrictMode reinvoque el efecto.
      const settle = () => { gsap.set(petals, { clearProps: "all" }); if (core) gsap.set(core, { clearProps: "all" }); brote?.classList.add("pulsing"); };
      const tl = gsap.timeline({ onComplete: settle });
      tl.fromTo(petals, { opacity: 0, scale: 0.82, rotate: -10, transformOrigin: "100px 100px" }, { opacity: 1, scale: 1, rotate: 0, duration: 0.85, ease: "back.out(1.8)", stagger: 0.05 }, 0);
      if (core) tl.fromTo(core, { scale: 0, transformOrigin: "100px 100px" }, { scale: 1, duration: 0.6, ease: "back.out(2.4)" }, 0.28);
    } else if (petals.length) {
      gsap.fromTo(petals, { rotate: -6, scale: 0.92 }, { rotate: 0, scale: 1, transformOrigin: "100px 100px", duration: 0.7, ease: "power2.out", stagger: 0.04, clearProps: "transform" });
    }
    // acompañar: el brote rota 0→8° a lo largo del hero (solo transform)
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = root.getBoundingClientRect();
        const prog = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
        if (brote) brote.style.setProperty("--brote-rot", (prog * 8).toFixed(2) + "deg");
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/**
 * Flor (brote) del hero ANTES. APAGADA a pedido del colegio (en mobile quedaba muy cargado).
 * Para VOLVER a integrarla: poné `true`. El layout, la animación (florecer + rotación por scroll)
 * y los estilos siguen intactos — es solo este interruptor.
 */
const SHOW_HERO_FLOWER = false;

export function HeroAntes() {
  const secRef = useRef<HTMLElement>(null);
  useBroteMotion(secRef);
  return (
    <section id="top" className="hero-antes" ref={secRef}>
      {SHOW_HERO_FLOWER && <BroteHero className="hero-brote-el" />}
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow reveal">28 sep — 2 oct 2026</p>
          <h1 className="display hero-title reveal" data-delay="1">
            <span className="ht-name"><span className="seed">Siembra</span></span>
            <span className="ht-year">2026</span>
          </h1>
          <p className="hero-place serif reveal" data-delay="2">
            Colegio Hölters Natur · Los Cardales, Buenos Aires
          </p>
        </div>
        <HeroMedia />
      </div>

      <div className="wrap">
        <QuickAccessStrip />
      </div>
    </section>
  );
}

const QUICK_ICONS: Record<string, string> = {
  programa: "M4 5h16M4 12h16M4 19h10",
  mapa: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14",
  streaming: "M8 5v14l11-7z",
  info: "M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};
function QuickAccessStrip() {
  const items = [
    { id: "programa", label: "Programa", sub: "Planificá tu visita" },
    { id: "mapa", label: "Mapa", sub: "Recorré el campus" },
    { id: "streaming", label: "En vivo", sub: "Sumate a distancia" },
    { id: "info", label: "Cómo llegar", sub: "Acceso y estacionamiento" },
  ];
  return (
    <nav className="qstrip reveal" data-delay="3" aria-label="Accesos rápidos">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className="qcard" onClick={smooth(i.id)}>
          <span className="qcard-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={QUICK_ICONS[i.id]} /></svg>
          </span>
          <span className="qcard-txt">
            <span className="qcard-label">{i.label}</span>
            <span className="qcard-sub">{i.sub}</span>
          </span>
          <span className="qcard-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </a>
      ))}
    </nav>
  );
}

export function HeroDurante() {
  const { now } = useApp();
  const secRef = useRef<HTMLElement>(null);
  useBroteMotion(secRef);
  const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const label = `${DAYS[now.getDay()]} ${now.getDate()} de septiembre`;
  return (
    <section id="top" className="hero-durante" ref={secRef}>
      <BroteHero className="hero-brote-el dur" />
      <div className="wrap">
        <p className="eyebrow live-eyebrow reveal">
          <SelloLive size={22} /> Estamos en La Siembra
        </p>
        <h1 className="display hero-title dur reveal" data-delay="1">
          {label}.<br />La Siembra está <span className="seed">sucediendo</span>.
        </h1>
        <div className="hero-cta reveal" data-delay="2">
          <a className="btn btn-cream" href="#ahora" onClick={smooth("ahora")}>Ver qué pasa ahora</a>
          <a className="btn btn-live" href="#streaming" onClick={smooth("streaming")}>
            <span className="dot live-dot" style={{ background: "#fff" }} /> Ver transmisión
          </a>
        </div>
      </div>
    </section>
  );
}

export function AhoraProximo() {
  const { data, now } = useApp();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const list = data.activities
    .filter((a) => a.day === today)
    .filter((a) => activityStatus(a, now) !== "finalizada")
    .sort((a, b) => duringSort(a, b, now));

  return (
    <section id="ahora" className="ahora band">
      <div className="wrap">
        <p className="eyebrow reveal">En este momento</p>
        <h2 className="sec-h reveal" data-delay="1">¿Qué está pasando ahora?</h2>
      </div>
      <div className="ahora-scroll reveal" data-delay="2">
        {list.map((a) => (
          <div className="ahora-item" key={a.id}>
            <ActivityCard activity={a} />
          </div>
        ))}
      </div>
    </section>
  );
}

function smooth(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}
