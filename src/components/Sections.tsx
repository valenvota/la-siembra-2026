import { useApp, areaById } from "../lib/app";
import { dayLabel } from "../lib/time";
import { matchesCurso } from "../lib/curso";
import { CATEGORY_LABEL, type Category } from "../data/types";
import { GrowthIcon, Herbario, SemillaClip, Surco } from "./Brote";
import { ActivityCard } from "./ActivityCard";

// "De la semilla a la flor, en cinco días" — la ilustración botánica es el indicador de avance.
// El relato lo cuentan el título + los íconos que crecen + la composición; sin nombrar cada etapa.
const STAGES = [
  { n: "01", title: "Se abren las puertas", desc: "El colegio se vuelve un espacio abierto." },
  { n: "02", title: "Aparece lo cotidiano", desc: "El trabajo del año sale del aula." },
  { n: "03", title: "Se recorre el campus", desc: "Cada zona del campus, con algo para descubrir." },
  { n: "04", title: "Se muestra el trabajo", desc: "Teatro, música, ciencia, danza, debate, cine, arte." },
  { n: "05", title: "Nos encontramos", desc: "Familias, docentes y estudiantes, compartiendo el mismo espacio." },
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
          {CATS.map((c) => CATEGORY_LABEL[c]).join(" · ")} · Cierre de proyectos pedagógicos
        </p>
        <div className="collage reveal" data-delay="2">
          {CELLS.map((cell, i) => (
            <figure className={`cell cell--${cell.cls}`} key={cell.img} data-delay={String((i % 4) + 1)}>
              <img src={`/assets/media/${cell.img}.jpg`} alt="" loading="lazy" />
              <figcaption>{cell.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// Muestras de recorrido libre: instalaciones/muestras que suceden toda la semana, sin
// horario fijo (Activity.allWeek). Van en su propia sección, no en el programa por día.
export function MuestrasLibres() {
  const { data, cursoFilter } = useApp();
  const items = data.activities.filter((a) => a.allWeek && matchesCurso(a, cursoFilter));
  if (!items.length) return null;
  return (
    <section id="muestras" className="muestras band">
      <div className="wrap">
        <p className="eyebrow reveal">Toda la semana</p>
        <h2 className="sec-h reveal" data-delay="1">Muestras permanentes</h2>
        <p className="lead reveal" data-delay="2">
          Instalaciones y muestras abiertas durante toda la Siembra, para recorrer a tu ritmo, sin horario.
        </p>
        <div className="prog-grid reveal" data-delay="2">
          {items.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Streaming DESHABILITADO hasta resolver cómo se inserta la transmisión. El botón y la imagen
 * NO redirigen a ningún lado (aparecen "próximamente"). Para habilitarlo: poné `true` — vuelve
 * a linkear a `data.streaming.url`.
 */
const STREAMING_ENABLED = false;

export function Streaming() {
  const { data, mode } = useApp();
  const s = data.streaming;
  const live = mode === "durante";
  const soon = !STREAMING_ENABLED;
  return (
    <section id="streaming" className={`streaming${live ? " is-live" : ""}${soon ? " is-soon" : ""}`}>
      <div className="wrap streaming-in">
        <div className="streaming-copy reveal">
          <p className="eyebrow inst">{live ? "Transmisión en vivo" : "Streaming"}</p>
          <h2 className="sec-h">{live ? "Estamos en vivo." : "También podés ser parte desde casa."}</h2>
          <p className="lead">
            {live
              ? "Sumate a la transmisión y acompañá La Siembra estés donde estés."
              : "Seguí Siembra en vivo desde donde estés. Transmisión en directo para que ninguna familia se lo pierda."}
          </p>
          {soon ? (
            <>
              <button className="btn btn-soon" type="button" disabled>Transmisión — próximamente</button>
              <p className="stream-soon muted">Estamos definiendo cómo transmitir. El enlace se va a habilitar antes del evento.</p>
            </>
          ) : (
            <a className={`btn ${live ? "btn-live" : "btn-inst"}`} href={s.url} target="_blank" rel="noreferrer">
              {live ? <><span className="dot live-dot" style={{ background: "#fff" }} /> Estamos en vivo</> : "Ver transmisión en vivo"}
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M7 17 17 7M9 7h8v8" /></svg>
            </a>
          )}
        </div>
        {soon ? (
          <div className="streaming-frame is-soon reveal" data-delay="1" aria-label="Transmisión próximamente">
            <img className="frame-poster" src="/assets/media/streaming.jpg" alt="" />
            <div className="frame-overlay">
              <span className="frame-play">
                <span className="play-btn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
                Próximamente
              </span>
            </div>
          </div>
        ) : (
          <a className="streaming-frame reveal" data-delay="1" href={s.url} target="_blank" rel="noreferrer" aria-label="Ver transmisión en vivo">
            <img className="frame-poster" src="/assets/media/streaming.jpg" alt="" />
            <div className={`frame-overlay${live ? " on" : ""}`}>
              {live ? (
                <span className="frame-live"><span className="dot live-dot" style={{ background: "#fff" }} /> EN VIVO</span>
              ) : (
                <span className="frame-play">
                  <span className="play-btn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
                  Ver transmisión
                </span>
              )}
            </div>
          </a>
        )}
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
        <p className="eyebrow inst reveal">Invitados 2026</p>
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
            {partner.logo && (
              <img className="cs-logo" src={partner.logo} alt={`Escudo del ${partner.name}`} loading="lazy" />
            )}
            <h3 className="cs-name">{partner.name}</h3>
            <p className="cs-desc serif">
              Desde {[partner.city, partner.country].filter(Boolean).join(", ")}. {partner.blurb}
            </p>
            {(act || partner.videoUrl) && (
              <div className="cs-links">
                {act && (
                  <button className="cs-chip" onClick={goToActivity}>
                    {dayLabel(act.day)} · {act.start} · {act.name}
                  </button>
                )}
                {act && area && (
                  <button className="cs-chip ghost" onClick={goToArea}>
                    {area.displayName}
                  </button>
                )}
                {partner.videoUrl && (
                  <a className="cs-chip" href={partner.videoUrl} target="_blank" rel="noreferrer" aria-label="¡Conocelos! — ver el video en Instagram">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg>
                    ¡Conocelos!
                  </a>
                )}
              </div>
            )}
          </div>
        </article>
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
    { k: "Cuándo", v: p.hours, herb: "espiga" as const },
    { k: "Estacionamiento", v: p.parking, herb: "acacia" as const },
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
            <img className="footer-holters-logo" src="/assets/brand/isologo-holters-horizontal.png" alt="Hölters Natur" loading="lazy" />
          </div>
          <p className="footer-line serif">{data.event.tagline}</p>
          <p className="footer-meta muted">
            {data.event.venueName} · {data.event.locationLabel} · 28 SEP — 2 OCT 2026
          </p>
          <p className="footer-fine muted">Las actividades y horarios pueden estar sujetos a modificaciones.</p>
        </div>
      </div>
    </footer>
  );
}
