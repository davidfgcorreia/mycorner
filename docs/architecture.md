# Architecture

A single-page personal site: an interactive miniature cabin. Each object in the room opens one
part of the portfolio (projects, school history, achievements, hobbies, résumé, experience,
about me).

## Stack

- **TanStack Start** (React 19, file-based routing) with Vite; the index route is client-only
  (`ssr: false`) because WebGL and canvas textures need the browser.
- **Three.js** via **React Three Fiber** and a few **Drei** helpers (`OrbitControls`, `Html`,
  `RoundedBox`, `useTexture`).
- **Tailwind CSS v4** for the base layer; almost all styling is hand-written CSS in
  `src/styles.css`.
- **Vitest** + Testing Library for tests. **Bun** lockfile (`bun.lock`) for Lovable; npm works locally.

## Directory map

```
public/                   favicon, robots.txt
src/
  personal/               all personal content; one folder per element (see its README)
  routes/
    __root.tsx            HTML shell, meta, fonts
    index.tsx             page shell; lazy-loads the cabin
  components/
    CabinScene.tsx        Canvas, room, props, markers, camera Director
    SceneOverlay.tsx      DOM controls over the canvas (back, print, stepper, zoom)
    ReadingContent.tsx    the readable HTML for every surface
    scene/
      ReadingObjects.tsx  interactive objects: monitor, printer, book, board, journal, tags, notebook
      Gear.tsx            hand-built hobby gear (surfboard, rod, racket, bag)
      merge.ts            bakes many primitives into one vertex-coloured mesh
      frames.ts           shadow refresh + reduced-motion helper
      textures.ts         canvas textures (room marks and real-text faces)
      colors.ts           reads --scene-* tokens for Three.js
    ui/button.tsx         the only shadcn component in use
  lib/
    portfolio.ts          corner ids and navigation labels
    reading-surfaces.ts   placements, readable faces, camera frames, animation poses
    board-layout.ts       board card layout (kept free of Three.js)
    scene-jsx/            JSX runtime for R3F files
  assets/models/          Kenney Furniture Kit GLBs (CC0)
docs/                     this documentation
```

## How a corner opens

1. One piece of state, `active: Corner | null`, lives in `routes/index.tsx`. Clicking an object,
   a hotspot marker or a nav button sets it.
2. `CabinScene` derives `detail` (which photo or tag is in focus) and passes both to the
   **Director**.
3. The Director is the single clock: every frame it eases the camera towards
   `cameraView(active, detail)` and advances each object's motion (`motion.progress`), which
   objects read in their own `useFrame` to pose themselves (book lift, sheet printing).
4. When camera and objects are at rest, the Director calls `onSettled`; only then is the
   readable HTML for that object mounted (`ready`).
5. Readable HTML is drei `<Html transform>` placed exactly on the object's face, rendered into a
   dedicated portal (`.surface-portal`), sized one CSS pixel per face pixel
   (`reading-surfaces.ts`).

Rules carried over from the original build (also in `AGENTS.md`):

- Keep DOM controls in `SceneOverlay`, outside the scene JSX runtime (it strips ARIA props).
- R3F files start with `/** @jsxImportSource @/lib/scene-jsx */`.
- Placements, faces, camera frames and poses are defined only in `reading-surfaces.ts`, so the
  open pose and the camera target cannot drift apart.

## Hiding HTML while the camera moves

Moving live, transformed HTML over WebGL every frame stutters (badly in Firefox). So:

- When a camera move starts, the Director adds `is-moving` to `.surface-portal`
  (`opacity: 0`); on settle it removes it and the HTML fades back in over 0.2s.
- During the move, the 3D textures show the same content. For surfaces you can step between
  (board cards, hobby tags) those textures contain the real text; see the parity rules in
  `style-guide.md`.

## Personal content

Everything about the owner is in `src/personal/` and imported through the barrel
(`import { profile } from '@/personal'`). Components never hard-code personal text. See
`src/personal/README.md` for which folder drives which object.

## Performance

See `performance.md`.
