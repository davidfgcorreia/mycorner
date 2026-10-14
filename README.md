# David's corner

A personal site: an interactive miniature cabin built with TanStack Start, React, Three.js and Tailwind.

## Run it

```sh
npm install
npm run dev      # http://localhost:5173
npx tsc --noEmit
npm test
npm run build
```

## Structure

```
public/            favicon, robots.txt (served as-is)
docs/              architecture, style guide, performance
src/
  personal/        everything about you; one folder per element (see its README)
  components/
    CabinScene.tsx   the room, camera Director, hotspots
    SceneOverlay     DOM controls over the canvas
    ReadingContent   the readable surfaces (screen, book, board, ...)
    ProjectPage      scrollable project details, media galleries and embedded demos
    NotebookDoodles  rough SVG pencil sketches in the biography notebook
    scene/           3D objects, gear, baking, textures, colour tokens
    ui/              button (the only shadcn component kept)
  lib/
    portfolio.ts       corner ids and navigation labels
    reading-surfaces   object placement, camera frames, animation poses
    board-layout.ts    board layout (no Three.js, so the page shell stays light)
    journal-layout.ts  work entry positions shared by HTML, textures and camera framing
    scene-jsx/         JSX runtime for R3F files
  assets/models/   CC0 furniture (Kenney Furniture Kit; licence alongside)
  routes/          file-based routes
  styles.css       design tokens, page shell, animations
```

## Documentation

- [Architecture](docs/architecture.md): how the cabin, camera and readable surfaces fit together
- [Style guide](docs/style-guide.md): colours, type, components, 3D look, motion
- [Performance](docs/performance.md): budgets, rules, how it was measured
- [Personal content](src/personal/README.md): what to edit to make it yours
- [Projects](src/personal/projects/README.md): project descriptions, images, demo URLs and source links
- [Deployment](docs/deployment.md): Cloudflare Workers setup and generated build configuration
- [Current status](docs/status.md): completed sections, remaining content and latest validation

## Personalizing

Edit the files in `src/personal/`. Start with `profile/`, then see `src/personal/README.md`.

## Notes

- The sports gear (surfboard, rod, racket, bag) is built from primitives in `scene/Gear.tsx`.
- The models were Lovable-hosted pointers that only resolved inside Lovable's preview;
  they are now local files, so the site runs anywhere.
- The computer supports scrolling project details, compact clickable image previews, embedded
  sites and videos, and local recorded demos. The school book and biography fit without scrolling.
- All four work roles appear together on the wall board. Select an entry to zoom the camera;
  the arrows and **Whole board** control provide accessible navigation.
- Normal pushes to the connected branch sync to Lovable. Do not rewrite published history.
