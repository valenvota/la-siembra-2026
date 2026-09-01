# PROGRESO — La Siembra 2026

Bitácora de avances para trabajo multi-máquina (Windows + Mac). Leé esto después de un
`git pull` para ponerte al día. Lo más nuevo va arriba.

---

## 2026-09-01 — Revisión 1 del sitio + modo claro + deploy en Vercel

### Estado actual
- Sitio **deployado y en vivo**: https://siembra-alpha.vercel.app (con la Revisión 1 aplicada).
- **Integración Git ↔ Vercel conectada hoy**: de ahora en más, cada push a `main` dispara un
  deploy automático. (Antes el proyecto de Vercel NO estaba conectado a este repo —
  probablemente se había subido por Vercel CLI. Si algún push no deploya, revisar en Vercel
  **Settings → Git**.)
- Los `npm warn allow-scripts` de `esbuild` en el log de Vercel son **inofensivos**, ignorar.

### Qué se hizo — Revisión 1
Base: documento "Siembra 2026 sitio web revisión 1.pdf" + ajustes puntuales por chat
(los del chat, más nuevos, pisan al PDF donde hubo conflicto). Regla del sprint: solo lo
explícito, sin inferencias.

**Textos:**
- Hero: etiqueta "Festival cultural · 28 sep — 2 oct 2026" → "28 sep — 2 oct 2026";
  título "La Siembra 2026" → **"Siembra 2026"** (se quitó "La", tamaños emparejados);
  subtítulo → "**Colegio** Hölters Natur · Los Cardales, Buenos Aires"; tarjeta rápida
  "Cómo llegar" sub → "Acceso y estacionamiento".
- "Qué es La Siembra": reescritos los 5 pasos (04 ahora dice "…danza, **debate, cine**, arte").
- "Qué vas a encontrar": eliminada la leyenda "Fotografía temporal…".
- Plano Vivo: título "El Plano Vivo" → **"Recorré el campus"**; bajada recortada;
  eliminada la leyenda "Base: plano ilustrado real de Hölters…".
- Programa: agregada la leyenda **"Las actividades y horarios pueden estar sujetos a
  modificaciones."** (debajo de las actividades).
- Streaming: eyebrow "Desde casa" → "Streaming"; cuerpo nuevo; eliminada la nota
  "Plataforma: YouTube…"; quitado "Próxima transmisión · Viernes 2 · 18:30" del póster.
- Información práctica: textos nuevos (Cómo llegar / Cuándo / Estacionamiento);
  **eliminadas** las tarjetas "Accesibilidad" y "Comida y servicios"; "Horarios" renombrada
  a **"Cuándo"**; el grid pasó de 3 a **4 columnas** (fila pareja, sin celdas vacías;
  cae a 2×2 en tablet y 1 en mobile).
- Invitados 2026: eyebrow "Colaboradores" → "Invitados 2026"; eliminado el subtítulo
  "Colaboradores · Invitados 2026"; nueva descripción de San Pío X; eliminada la leyenda
  "Más instituciones se suman pronto."
- Footer: nota legal → "Las actividades y horarios pueden estar sujetos a modificaciones."

**Logos (`public/assets/brand/`):**
- Navbar y Footer: se agregó el isologotipo **Hölters Natur (horizontal)** junto al de
  Siembra (Siembra × Hölters). Archivos: `isologo-holters-horizontal.png`,
  `logo-siembra-horizontal.png`.
- Nota: el logo combinado único "Hölters × Siembra" todavía NO existe; se compone de los
  dos PNG por ahora.

**Assets reales de Hölters (reemplazaron placeholders en `public/assets/media/`):**
- `c-perform.jpg` → Teatro y música · `c-encuentro.jpg` → Encuentros ·
  `c-campo.jpg` → Ciencia al aire libre · `sanpio.jpg` → retrato San Pío X.
- Video del hero: `hero-loop.mp4` (desktop 16:9 1280w), `hero-loop-mobile.mp4` (4:5 720w),
  `hero-poster.jpg`. Es un **loop de 30s sin audio**, cortado con ffmpeg desde el original
  "Siembra 2025 Colegio Hölters Natur.mp4". Para regenerarlo:
  `ffmpeg -y -ss 0 -t 30 -i FUENTE.mp4 -an -vf "scale=1280:-2" -c:v libx264 -pix_fmt yuv420p -crf 23 -movflags +faststart public/assets/media/hero-loop.mp4`

**Modo claro:**
- **Modo claro fijo**: `data-theme="light"` en `index.html`. Se quitó el botón de cambiar
  tema del navbar (`Nav.tsx`). El CSS de dark mode queda en el código pero **inerte**.
  Para reactivar dark: sacar `data-theme="light"` de `index.html` y devolver el toggle en `Nav.tsx`.

### Pendiente menor (sin resolver)
- El sello decorativo chico sobre el video del hero todavía dice "La Siembra" (no es el
  título). Falta decidir si se le saca el "La".

### Notas para la otra PC (después de `git pull`)
- Corré `npm install` (las dependencias no cambiaron, pero por las dudas).
- `.claude/launch.json` es tooling local de Claude Code; NO está commiteado, ignoralo.

---

## PRÓXIMO SLICE (pendiente) — Base de datos del programa (Google Sheets)

Objetivo (PDF, sección Programa): "cronograma editable desde base de datos" + "agregar
curso y nivel por actividad (falta el curso)".

**Plan acordado (a implementar):**
- **Google Sheets como CMS** del programa (NO Supabase — sería sobreingeniería para un
  evento de una semana). El equipo edita la planilla y la web toma los cambios sin re-deploy.
- Fuente: planilla "Siembra 2026 - Cronograma interno". Se le agrega una pestaña **`WEB`**
  (o columnas) que la web consume, mostrando solo filas con `visible_web = TRUE`. El
  itinerario paralelo de Colombia queda `visible_web = FALSE` (en la planilla se distingue
  además por `NIVEL = "Colombia"`).
- El repo YA está preparado: ver el comentario **ROADMAP en `src/data/event.ts`** (hidratar
  `data.activities` desde la hoja; mantener `event.ts` como fallback). El contrato es el tipo
  `Activity` en `src/data/types.ts`.
- Ya se generó un **borrador normalizado** de la pestaña WEB (58 actividades reales,
  categorizadas, con `visible_web`, Colombia excluido) — está en manos de Valentín como CSV
  para pegar/revisar con el equipo. Ese es el punto de partida.

**Puntos a reconciliar antes de codear el loader:**
1. Enums: categoría en minúscula sin acento (`musica`, `debate`, `encuentro`…); el nivel
   "General" se mapea a **`comunidad`**.
2. **`areaId`** (importante): cada actividad linkea al Plano Vivo por zona (12 áreas fijas).
   Hay que mapear el `lugar` (texto libre: "Hölters Arena", "Playón Secundaria"…) → `areaId`.
   Algunos lugares son ambiguos (definir con el equipo).
3. Muestras "toda la semana" (sin horario): el modelo espera un día concreto; decidir cómo
   tratarlas.
4. Sábado 3/10: hoy el rango del evento es lun–vie; extender si se incluye.

**Fetch sugerido:** función serverless en Vercel (`/api/programa`) que lee la hoja, normaliza
y cachea ~60s, + snapshot de respaldo embebido en el build (fallback si Google falla).

---

## Antes de hoy
Historial en `git log`. Commits previos relevantes: recolorización a azul Hölters, primeras
correcciones del colegio, y el sitio base "La Siembra 2026" con datos placeholder.
