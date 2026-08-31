import { useApp, areaById } from "../lib/app";
import { dayLabel } from "../lib/time";
import { CATEGORY_LABEL, type Category } from "../data/types";
import { GrowthIcon, Herbario, HoltersShield, Semilla, SemillaClip, Surco } from "./Brote";

// "De la semilla a la flor, en cinco días" — la ilustración botánica es el indicador de avance.
// El relato lo cuentan el título + los íconos que crecen + la composición; sin nombrar cada etapa.
const STAGES = [
  { n: "01", title: "Se abren las puertas", desc: "El colegio deja de ser un adentro." },
  { n: "02", title: "Aparece lo cotidiano", desc: "Lo que pasa todos los días en las aulas, ahora a la vista." },
  { n: "03", title: "Se recorre el campus", desc: "Doce hectáreas, veinte zonas, un solo mapa." },
  { n: "04", title: "Se muestra el trabajo", desc: "Teatro, música, ciencia, danza, arte." },
  { n: "05", title: "Nos encontramos", desc: "Cinco días que terminan con toda la comunidad junta." },
];

export function QueEs({ secondary = false }: { secondary?: boolean }) {
  return (
    <section className={`quees-seq${secondary ? " secondary band" : " quees-hero"}`}>
      {!secondary && <img className="quees-iso" src="/assets/brand/isotipo-cream.png" alt="" aria-hidden="true" />}
      <div className="wrap">
        <div className="quees-head reveal">
          <p className={`eyebrow${secondary ? "" : " on-green"}`}>Qué es La Siembra</p>
          <h2 className="sec-h quees-title" data-delay="1">
            Una semana para compartir, crear y encontrarnos.
          </h2>
          <Surco className="quees-surco" />
        </div>
        <ol className="seq">
          {STAGES.map((s, i) => (
            <li className="seq-step reveal" data-delay={String((i % 4) + 1)} key={s.n}>
              <span className="seq-rail" aria-hidden="true" />
              <GrowthIcon i={i} className="seq-icon" size={40} />
              <span className="seq-n">{s.n}</span>
              <h3 className="seq-title">{s.title}</h3>
              <p className="seq-desc">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const CATS: Category[] = ["teatro", "musica", "ciencia", "danza", "debate", "audiovisual", "arte", "encuentro"];

const CELLS = [
  { img: "c-perform", label: "Teatro y música", cls: "xl" },
  { img: "c-campo", label: "Ciencia al aire libre", cls: "wide" },
  { img: "c-danza", label: "Danza", cls: "sm" },
  { img: "c-arte", label: "Arte", cls: "sm" },
  { img: "c-encuentro", label: "Encuentros", cls: "wide" },
  { img: "c-muestra", label: "Muestras", cls: "wide" },
];

export function QueEncontras() {
  return (
    <section className="encontras">
      <div className="wrap">
        <p className="eyebrow reveal">Qué vas a encontrar</p>
        <h2 className="sec-h reveal" data-delay="1">Cinco días, muchas formas de crear.</h2>
        <p className="cat-line serif reveal" data-delay="2">
          {CATS.map((c) => CATEGORY_LABEL[c]).join(" · ")}
        </p>
        <div className="collage reveal" data-delay="2">
          {CELLS.map((cell, i) => (
            <figure className={`cell cell--${cell.cls}`} key={cell.img} data-delay={String((i % 4) + 1)}>
              <img src={`/assets/media/${cell.img}.jpg`} alt="" loading="lazy" />
              <figcaption>{cell.label}</figcaption>
            </figure>
          ))}
        </div>
        <p className="encontras-note reveal muted">Fotografía temporal con licencia libre · se reemplaza por imágenes reales de Hölters.</p>
      </div>
    </section>
  );
}

export function Streaming() {
  const { data, mode } = useApp();
  const s = data.streaming;
  const live = mode === "durante";
  return (
    <section id="streaming" className={`streaming${live ? " is-live" : ""}`}>
      <div className="wrap streaming-in">
        <div className="streaming-copy reveal">
          <p className="eyebrow inst">{live ? "Transmisión en vivo" : "Desde casa"}</p>
          <h2 className="sec-h">{live ? "Estamos en vivo." : "También podés ser parte desde casa."}</h2>
          <p className="lead">
            {live
              ? "Sumate a la transmisión y acompañá La Siembra estés donde estés."
              : `Familias y amigos pueden acompañar a distancia. Próxima transmisión: ${s.nextLabel}.`}
          </p>
          <a className={`btn ${live ? "btn-live" : "btn-inst"}`} href={s.url} target="_blank" rel="noreferrer">
            {live ? <><span className="dot live-dot" style={{ background: "#fff" }} /> Estamos en vivo</> : "Ver transmisión en vivo"}
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </a>
          <p className="stream-plat muted">Plataforma: {s.platformLabel} · enlace configurable (provisional)</p>
        </div>
        <a className="streaming-frame reveal" data-delay="1" href={s.url} target="_blank" rel="noreferrer" aria-label={live ? "Ver transmisión en vivo" : `Próxima transmisión ${s.nextLabel}`}>
          <img className="frame-poster" src="/assets/media/streaming.jpg" alt="" />
          <div className={`frame-overlay${live ? " on" : ""}`}>
            {live ? (
              <span className="frame-live"><span className="dot live-dot" style={{ background: "#fff" }} /> EN VIVO</span>
            ) : (
              <span className="frame-play">
                <span className="play-btn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
                Próxima transmisión · <b>{s.nextLabel}</b>
              </span>
            )}
          </div>
        </a>
      </div>
    </section>
  );
}

// Spotlight de colaboradores: San Pío X es la única institución invitada y ya tiene actividad
// en el programa ("Bailes de Argentina y Colombia"). Ese vínculo es la historia.
export function Colaboradores() {
  const { data, selectArea, setProgramDay } = useApp();
  const partner = data.partners[0];
  const act = partner?.activityId ? data.activities.find((a) => a.id === partner.activityId) : undefined;
  const area = act ? areaById(act.areaId) : undefined;

  function goToActivity() {
    if (area) selectArea(area.id);
    if (act) setProgramDay(act.day); // día exacto de la actividad (después de selectArea, que lo limpia)
    document.getElementById("programa")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function goToArea() {
    if (area) selectArea(area.id);
    document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!partner) return null;
  return (
    <section className="colab">
      <SemillaClip />
      <div className="wrap">
        <p className="eyebrow inst reveal">Colaboradores</p>
        <h2 className="sec-h reveal" data-delay="1">Instituciones que siembran con nosotros.</h2>

        <article className="colab-spotlight reveal" data-delay="2">
          <figure className="cs-portrait">
            {partner.portrait ? (
              <img className="semilla-masked" src={partner.portrait} alt={`Contingente del ${partner.name}`} loading="lazy" />
            ) : (
              <div className="cs-portrait-ph semilla-masked" aria-hidden="true" />
            )}
          </figure>
          <div className="cs-body">
            <p className="eyebrow inst">Colaboradores · Invitados 2026</p>
            {partner.logo && (
              <img className="cs-logo" src={partner.logo} alt={`Escudo del ${partner.name}`} loading="lazy" />
            )}
            <h3 className="cs-name">{partner.name}</h3>
            <p className="cs-desc serif">
              {[partner.city, partner.country].filter(Boolean).join(", ")}. {partner.blurb}
            </p>
            {act && (
              <div className="cs-links">
                <button className="cs-chip" onClick={goToActivity}>
                  {dayLabel(act.day)} · {act.start} · {act.name}
                </button>
                {area && (
                  <button className="cs-chip ghost" onClick={goToArea}>
                    {area.displayName}
                  </button>
                )}
              </div>
            )}
          </div>
        </article>

        <div className="colab-empty reveal" data-delay="2">
          <span className="colab-empty-seeds" aria-hidden="true">
            <Semilla variant="line" size={26} className="empty-seed" />
            <Semilla variant="line" size={26} className="empty-seed" />
            <Semilla variant="line" size={26} className="empty-seed" />
          </span>
          <span className="colab-empty-note">Más instituciones se suman pronto.</span>
        </div>
      </div>
    </section>
  );
}

export function InfoPractica() {
  const { data } = useApp();
  const p = data.practical;
  // Una firma vegetal (herbario de línea) por tarjeta, en la esquina — nunca sobre el dato.
  const items = [
    { k: "Dónde es", v: p.address },
    { k: "Cómo llegar", v: p.howToArrive },
    { k: "Horarios", v: p.hours, herb: "espiga" as const },
    { k: "Estacionamiento", v: p.parking, herb: "acacia" as const },
    { k: "Accesibilidad", v: p.accessibility, herb: "eucalipto" as const },
    { k: "Comida y servicios", v: p.services || "", herb: "cardo" as const },
  ].filter((i) => i.v);
  return (
    <section id="info" className="info">
      <div className="wrap">
        <p className="eyebrow reveal">Información práctica</p>
        <h2 className="sec-h reveal" data-delay="1">Todo lo que necesitás para venir.</h2>
        <div className="info-grid reveal" data-delay="2">
          {items.map((i) => (
            <div className={`info-item${i.herb ? " has-herb" : ""}`} key={i.k}>
              <div className="info-k">{i.k}</div>
              <div className="info-v">{i.v}</div>
              {i.herb && <Herbario kind={i.herb} className="info-herb" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { data } = useApp();
  return (
    <footer className="site-footer">
      <div className="wrap footer-in">
        <div className="footer-copy">
          <div className="footer-brand">
            <img className="footer-logo" src="/assets/brand/logo-siembra-2026.png" alt="Siembra · Edición 2026" loading="lazy" />
            <span className="footer-x" aria-hidden="true">×</span>
            <HoltersShield size={28} />
            <span className="footer-holters">Hölters Natur</span>
          </div>
          <p className="footer-line serif">{data.event.tagline}</p>
          <p className="footer-meta muted">
            {data.event.venueName} · {data.event.locationLabel} · 28 SEP — 2 OCT 2026
          </p>
          <p className="footer-fine muted">Programa y datos sujetos a confirmación.</p>
        </div>
      </div>
    </footer>
  );
}
