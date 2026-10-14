# Style guide

The site is a warm, hand-made miniature cabin floating on a soft green page. Everything should
feel like physical objects in a small room: paper, wood, cork, luggage tags. Nothing glossy,
nothing corporate.

All colours are CSS custom properties in `src/styles.css` (`:root`), written in `oklch`.
Never hard-code a colour in a component; add a token instead.

## Colour

### Page (DOM)

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `oklch(0.93 0.055 148)` | Soft light green page |
| `--foreground` | `oklch(0.42 0.12 135)` | Deep lime text |
| `--primary` | `oklch(0.50 0.15 130)` | Accents, icons, focus, links |
| `--muted-foreground` | `oklch(0.48 0.08 138)` | Secondary text |
| `--card` / `--reading-background` | white | Paper, pills, toolbars |
| `--border` | `oklch(0.85 0.05 148)` | Hairlines, pill outlines |

The page background adds a soft white radial glow behind the room (`.portfolio-page`).

### Scene (3D)

Scene colours are tokens too, prefixed `--scene-`, and are read into Three.js by
`src/components/scene/colors.ts`. To add one: add `--scene-<name>` to `:root`, then add `<name>`
to the `names` list in `colors.ts`.

| Token | Use |
| --- | --- |
| `wood`, `wood-light`, `wood-dark` | Floor, beams, shelves, cabinet, pillars |
| `wall` | Cabin walls |
| `cork` | Achievement board |
| `paper` | Paper, white plastic, surfboard |
| `green` | Pins, journal, accents, bag stripe |
| `orange` | Notebook cover, surfboard band |
| `red` | Racket strings, fishing lure |
| `bag` | Gym bag (light grey) |
| `metal`, `ink` | Dark details, handles, rod |
| `screen`, `screen-off` | Window glass, monitor |
| `rug` | Rug |
| `text`, `text-muted` | Real text drawn into textures (mirror `--foreground` / `--muted-foreground`) |

## Typography

- One family: **DM Sans** (Google Fonts, weights 400/500/600/700), with `sans-serif` fallback.
- Headings use weight 500; strong UI labels 500–600. No letter-spacing except small
  uppercase eyebrows (`.12em`).
- The computer screen is the one exception: a retro Linux file manager in
  `'Liberation Sans', Arial`.
- Text drawn into canvas textures uses DM Sans at the **same sizes and line heights as the CSS**
  it stands in for (see "HTML ↔ texture parity").

## Layout

- The page is exactly one screen tall (`100svh`): header, room, navigation, footer. No scroll.
- Header: the name tag on the left, the "About me" pill on the right.
- Bottom navigation: six corners in one row on desktop, a 3 × 2 grid on phones (≤ 640px).
- Side gutters: 40px desktop, 18–20px phone.
- The room keeps its page bounds in reading mode; only the camera moves.

## Components

- **Name tag** (`.name-tag`): a white luggage tag with a clipped left edge and a punched hole,
  the monogram in a green circle, name + role line. It mirrors the hobby tags in the room.
- **Pills** (`.about-pill`, `.scene-controls button`, `.detail-stepper`): fully rounded, white
  at 70–80% over the page, 1px `--border`, lift by 1–2px on hover.
- **Corner nav buttons**: transparent until hover; on hover a white card, a 2px green underline
  sweeping in from the left, and the icon tilting slightly.
- **Readable surfaces**: paper-white, generous padding, deep-lime headings, muted body text.
- **Computer**: project category navigation scrolls independently of the folder grid. Image
  previews preserve their aspect ratio and stay small; clicking opens the full-size asset.
  Reading documents may scroll inside the screen. Recorded demos use native video controls.
- **School book**: concise chapters with grades explicitly shown out of 20. Fit all content
  on each page; shorten prose rather than adding scrolling.
- **Work board**: show every role in a two-by-two grid. Small fixed type is intentional in
  the overview; clicking an entry zooms the camera for reading. Keep HTML, canvas text and
  camera rectangles aligned through the shared journal layout.
- **Biography notebook**: short paragraphs, a sketch on the left and another below the text.
  Drawings use uneven strokes, unfinished outlines and faint retracing in `--scene-ink`.
  Keep them decorative (`aria-hidden`) and leave enough room to avoid clipping or scrolling.
- **Browser icon**: the cabin SVG favicon has an ICO fallback. The computer title bar uses
  a monitor icon.

## 3D look

- Low-poly and flat-shaded, like Kenney's furniture kit (the models in `src/assets/models`).
- Hand-built objects are made from **boxes** (and the odd extruded shape), with flat colours from
  scene tokens. No textures except paper surfaces, cork and the floor.
- Static objects are baked into one vertex-coloured mesh each (`scene/merge.ts`) and share
  `bakedMaterial`.
- Readable faces (board cards, photos, the board note, hobby tags) are **unlit**
  (`meshBasicMaterial`, `toneMapped={false}`) so they match the HTML exactly.
- Hobby gear lives in the right-hand corner along the back wall: surfboard and rod leaning on the
  wall, the light-grey bag on the floor, the racket resting on the bag.

## Motion

| What | Duration | Easing |
| --- | --- | --- |
| Camera between views | 1.25s | cubic ease-in-out |
| School book lift/open | 1.6s | — |
| Résumé printing | 1.3s | — |
| Notebook opening | 0.9s | — |
| Name tag swing-in | 2.6s | `cubic-bezier(.2, .7, .2, 1)` |
| Room fade/rise on load | 0.9s | same |
| Nav buttons rise | 0.55s, staggered 70ms | ease-out |
| Hover lifts | 0.2s | default |
| Hotspot pulse | ~1.8s loop | quadratic fade |
| HTML fade-in after the camera settles | 0.2s | ease-out |

Rules:

- Animate only `transform` and `opacity` in CSS.
- **Never `scale()` the `.scene-wrap`**: the canvas measures itself with `getBoundingClientRect`
  and would size itself wrong.
- Every animation respects `prefers-reduced-motion` (CSS media query, and
  `prefersReducedMotion()` in the scene).

## HTML ↔ texture parity

Readable HTML is hidden while the camera moves; the 3D texture underneath carries the view
(see `architecture.md`). So any surface you can move between up close must look the same in
both:

- Same text, from the same data (`src/personal`).
- Same layout numbers: the draw functions in `scene/textures.ts` are commented with the CSS
  rule they mirror (`.board-card`, `.board-note`, `.journal-entry`, `.tag-surface`). Change one,
  change the other. Work entry rectangles come from `journal-layout.ts`.
- Same colours (unlit, untone-mapped materials), same pin (an 18px flat disc on the card's top edge).
