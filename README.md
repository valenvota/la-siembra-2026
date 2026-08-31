# La Siembra 2026

Sitio del festival cultural de **Hölters Natur** (Los Cardales, Buenos Aires · 28 sep — 2 oct 2026).

Una sola web con dos estados desde los mismos datos: **Antes** ("qué es y por qué ir") y **Durante** ("qué pasa ahora"). Mobile-first. Stack: Vite + React + TypeScript + GSAP.

## Correr localmente

```bash
npm install
npm run dev
```

Abre en `http://localhost:5188`.

- `?modo=antes` / `?modo=durante` fuerzan el estado (por defecto se resuelve por fecha).
- Toggle de vista Antes/Durante visible en el nav (temporal, se quita al lanzar).

```bash
npm run build     # build de producción a dist/
npm run preview   # previsualiza el build
```

## Estructura

- `src/data/` — modelo de contenido (`types.ts`) y datos seed (`event.ts`). **No hardcodear programación en los componentes**: se cambia acá.
- `src/components/` — Hero, Nav, PlanoVivo (mapa↔programa), Programa, Sections, Brote (primitivas del sistema visual).
- `src/styles/` — `theme.css` (tokens) y `components.css`.
- `public/assets/` — media (temporal, Pexels) + logos (isotipo adaptado, escudo Hölters).

## Pendiente (media/datos provisionales → reemplazar por material real)

Foto/loop del hero, fotos por categoría, retrato del contingente de San Pío, plano recoloreado, plataforma de streaming, programa/sedes 2026 confirmados.
