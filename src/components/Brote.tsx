/**
 * Sistema Brote — primitivas reutilizables.
 * La primitiva: cinco lóbulos alrededor de un centro (termina el ✳ del logo).
 * Tres variantes (sólida / línea / radiada), tamaños XS..XL.
 * Reglas: el amarillo sólo vive en el centro radiado; el rojo sólo en sello-live;
 * un asset decorativo por viewport; nunca sobre texto.
 */

// --- geometría: 5 lóbulos en pentágono alrededor del centro (viewBox 0 0 200 200) ---
const CX = 100, CY = 100;
const LOBES = [0, 1, 2, 3, 4].map((i) => {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return { cx: CX + 46 * Math.cos(a), cy: CY + 46 * Math.sin(a) };
});
const LOBE_R = 42;
const CORE_R = 40;

type SemVariant = "solid" | "line" | "radiada";

export function Semilla({
  variant = "solid",
  size = 40,
  className = "",
  color = "currentColor",
  petalClass,
}: {
  variant?: SemVariant;
  size?: number;
  className?: string;
  color?: string;
  petalClass?: string;
}) {
  if (variant === "line") {
    // Rosetón de 5 círculos entrelazados: ornamento fino, estados vacíos, marcas de sección.
    return (
      <svg className={`semilla semilla-line ${className}`} width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden="true">
        {LOBES.map((l, i) => (
          <circle key={i} cx={l.cx} cy={l.cy} r={44} stroke={color} strokeWidth={3} opacity={0.9} />
        ))}
        <circle cx={CX} cy={CY} r={10} stroke={color} strokeWidth={3} />
      </svg>
    );
  }

  const pale = variant === "radiada";
  return (
    <svg className={`semilla semilla-${variant} ${className}`} width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <g className="semilla-petals">
        {LOBES.map((l, i) => (
          <circle key={i} className={petalClass} cx={l.cx} cy={l.cy} r={LOBE_R} fill={pale ? "var(--blue-200)" : color} style={{ transformOrigin: `${CX}px ${CY}px` }} />
        ))}
        <circle cx={CX} cy={CY} r={CORE_R} fill={pale ? "var(--blue-200)" : color} />
      </g>
      {variant === "radiada" && <RadiatedCore />}
    </svg>
  );
}

/** Centro radiado — único lugar donde vive el amarillo. */
function RadiatedCore() {
  const rays = Array.from({ length: 32 }, (_, i) => {
    const a = (i / 32) * 2 * Math.PI;
    return { x1: CX + 15 * Math.cos(a), y1: CY + 15 * Math.sin(a), x2: CX + 34 * Math.cos(a), y2: CY + 34 * Math.sin(a) };
  });
  return (
    <g className="semilla-core">
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="var(--ink)" strokeWidth={1.4} opacity={0.55} />
      ))}
      <circle cx={CX} cy={CY} r={15} fill="var(--yellow)" />
    </g>
  );
}

/** brote-hero — semilla radiada a escala XL, detrás de la foto del hero, recortada por el borde. */
export function BroteHero({ className = "" }: { className?: string }) {
  return <Semilla variant="radiada" size={520} className={`brote-hero ${className}`} petalClass="brote-hero-petal" />;
}

/** petalo-esquina — un lóbulo suelto asomando ¼ detrás de una tarjeta de foto. */
export function PetaloEsquina({ className = "" }: { className?: string }) {
  return (
    <svg className={`petalo-esquina ${className}`} width={72} height={72} viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="30" fill="var(--blue)" />
      <circle cx="36" cy="36" r="9" fill="var(--blue-darker)" opacity="0.55" />
    </svg>
  );
}

/** sello-live — semilla sólida en rojo con centro que late. Único uso del rojo. */
export function SelloLive({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`sello-live ${className}`} aria-hidden="true">
      <Semilla variant="solid" size={size} color="var(--live)" />
      <span className="sello-live-core" />
    </span>
  );
}

// --- Íconos de crecimiento para "De la semilla a la flor" (línea, currentColor) ---
export const GROWTH: { key: string; label: string; icon: JSX.Element }[] = [
  {
    key: "semilla",
    label: "Semilla",
    icon: <ellipse cx="16" cy="20" rx="6" ry="8" transform="rotate(18 16 20)" />,
  },
  {
    key: "brote",
    label: "Brote",
    icon: (
      <>
        <path d="M16 30 V16" />
        <path d="M16 20c-5 0-8-2.5-8-7 4.4 0 8 2.6 8 7Z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    key: "tallo",
    label: "Tallo",
    icon: (
      <>
        <path d="M16 30 V10" />
        <path d="M16 20c-5 0-8-2.5-8-7 4.4 0 8 2.6 8 7Z" fill="currentColor" stroke="none" />
        <path d="M16 16c4.4 0 8-2.6 8-7-5 0-8 2.5-8 7Z" fill="currentColor" stroke="none" opacity=".75" />
      </>
    ),
  },
  {
    key: "pimpollo",
    label: "Pimpollo",
    icon: (
      <>
        <path d="M16 30 V14" />
        <path d="M16 20c-5 0-8-2.5-8-7 4.4 0 8 2.6 8 7Z" fill="currentColor" stroke="none" opacity=".8" />
        <path d="M16 14c-2.6 0-4.6-2.4-4.6-6 0-2.4 2-4 4.6-4s4.6 1.6 4.6 4c0 3.6-2 6-4.6 6Z" />
      </>
    ),
  },
  {
    key: "flor",
    label: "Flor",
    icon: (
      <>
        <path d="M16 30 V20" />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (-90 + i * 72) * (Math.PI / 180);
          return <circle key={i} cx={16 + 5.4 * Math.cos(a)} cy={11 + 5.4 * Math.sin(a)} r={3.6} />;
        })}
        <circle cx="16" cy="11" r="2.4" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export function GrowthIcon({ i, size = 34, className = "" }: { i: number; size?: number; className?: string }) {
  return (
    <svg className={`growth-icon ${className}`} width={size} height={size} viewBox="0 0 32 34" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {GROWTH[i].icon}
    </svg>
  );
}

// --- Herbario: firmas vegetales de línea para las tarjetas de práctica ---
type Herb = "espiga" | "acacia" | "cardo" | "eucalipto";
const HERBARIO: Record<Herb, JSX.Element> = {
  // espiga (trigo) — Horarios
  espiga: (
    <>
      <path d="M28 6 V50" />
      {[12, 19, 26, 33, 40].map((y) => (
        <g key={y}>
          <path d={`M28 ${y} C22 ${y - 2} 18 ${y + 2} 16 ${y + 7}`} />
          <path d={`M28 ${y} C34 ${y - 2} 38 ${y + 2} 40 ${y + 7}`} />
        </g>
      ))}
    </>
  ),
  // acacia — Estacionamiento (árbol real del campus)
  acacia: (
    <>
      <path d="M28 52 V26" />
      <path d="M28 30 C20 26 14 20 12 12" />
      <path d="M28 34 C36 30 42 24 44 16" />
      <path d="M28 24 C24 20 22 15 22 9" />
      {[[12, 12], [44, 16], [22, 9], [28, 24]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" />
      ))}
    </>
  ),
  // cardo — Comida y servicios (Los Cardales)
  cardo: (
    <>
      <path d="M28 52 V22" />
      <path d="M28 22c-4 0-7-3-7-8 0 0 7 1 7 8Z" fill="currentColor" stroke="none" />
      <path d="M28 22c4 0 7-3 7-8 0 0-7 1-7 8Z" fill="currentColor" stroke="none" />
      <path d="M28 14c0-5 0-8 0-8" />
      {[10, 6, 2].map((y, i) => (
        <g key={i}>
          <path d={`M28 ${y + 4} l-3 -4`} />
          <path d={`M28 ${y + 4} l3 -4`} />
        </g>
      ))}
      <path d="M22 34 C18 32 16 28 16 24" />
      <path d="M34 40 C38 38 40 34 40 30" />
    </>
  ),
  // eucalipto — Accesibilidad
  eucalipto: (
    <>
      <path d="M20 52 C24 40 30 30 42 12" />
      {[[26, 40], [30, 33], [34, 26], [38, 19]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x - 6} cy={y} rx="5" ry="3.2" transform={`rotate(-24 ${x - 6} ${y})`} />
          <ellipse cx={x + 4} cy={y - 3} rx="5" ry="3.2" transform={`rotate(-24 ${x + 4} ${y - 3})`} />
        </g>
      ))}
    </>
  ),
};

export function Herbario({ kind, className = "" }: { kind: Herb; className?: string }) {
  return (
    <svg className={`herbario herbario-${kind} ${className}`} width={64} height={68} viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {HERBARIO[kind]}
    </svg>
  );
}

/** semilla-mask — clipPath de cinco lóbulos para retratos (Nivel 3). Reservado a retratos. */
const CLIP_LOBES = [0, 1, 2, 3, 4].map((i) => {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return { cx: 0.5 + 0.245 * Math.cos(a), cy: 0.5 + 0.245 * Math.sin(a) };
});
export function SemillaClip() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <clipPath id="semilla-clip" clipPathUnits="objectBoundingBox">
          {CLIP_LOBES.map((l, i) => (
            <circle key={i} cx={l.cx} cy={l.cy} r={0.225} />
          ))}
          <circle cx={0.5} cy={0.5} r={0.2} />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Escudo de Hölters — identidad del colegio, en sus colores originales (no se adapta a la paleta
 *  de La Siembra: así se lee la colaboración La Siembra × Hölters). Recreado como SVG limpio. */
export function HoltersShield({ size = 28, className = "" }: { size?: number; className?: string }) {
  const field = "#EFC12E"; // amarillo escudo
  const outline = "#1A1A1A"; // contorno negro
  const letter = "#CE2B1F"; // H roja
  return (
    <svg className={`holters-shield ${className}`} width={size} height={size * 76 / 64} viewBox="0 0 64 76" fill="none" aria-hidden="true">
      <path d="M6 9 Q6 5 10 5 H54 Q58 5 58 9 V40 Q58 61 32 73 Q6 61 6 40 Z" fill={field} stroke={outline} strokeWidth="3" strokeLinejoin="round" />
      {/* H */}
      <path d="M20 22 h6 V34 h12 V22 h6 V54 h-6 V40 H26 V54 h-6 Z" fill={letter} stroke={outline} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** surco — tres a cinco arcos paralelos dibujados a mano. Bajo títulos de sección. */
export function Surco({ className = "" }: { className?: string }) {
  return (
    <svg className={`surco ${className}`} width={132} height={26} viewBox="0 0 132 26" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
      <path d="M4 8 Q66 2 128 8" strokeWidth="2" opacity=".9" />
      <path d="M4 15 Q66 9 128 15" strokeWidth="2" opacity=".6" />
      <path d="M6 22 Q66 17 126 22" strokeWidth="2" opacity=".35" />
    </svg>
  );
}
