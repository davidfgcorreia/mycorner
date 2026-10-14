# CLAUDE.md

David Correia's personal site: an interactive miniature cabin (TanStack Start, React 19,
React Three Fiber, Tailwind v4). Read `docs/` before larger changes:
`docs/architecture.md`, `docs/style-guide.md`, `docs/performance.md`.

## Git rules

- **Never add Claude as a co-author.** No `Co-Authored-By: Claude …` trailer, and no
  "Generated with Claude Code" line, in commit messages. Commits are authored by David only.
- Never rewrite pushed history (no force-push, no amending or rebasing pushed commits); the
  repo may be connected to Lovable, which mirrors history.
- Keep the default branch working: run the checks below before committing.

## Commands

```sh
npm run dev        # http://localhost:5173
npm test           # vitest
npx tsc --noEmit   # typecheck
npm run build      # production build (output in .output/)
```

Dependencies are locked in `bun.lock` (Lovable uses Bun). After changing `package.json`, refresh
it with `npx bun install`; don't commit a `package-lock.json`.

## Where things go

- **Personal content** (names, text, photos): only in `src/personal/<element>/`, imported via
  `@/personal`. Never hard-code personal text in components.
- **Placements, readable faces, camera frames, poses**: only in `src/lib/reading-surfaces.ts`.
- **Colours**: tokens in `src/styles.css` (`oklch`). Scene colours are `--scene-*` and must be
  listed in `src/components/scene/colors.ts`.
- **Hand-built 3D objects**: boxes baked with `src/components/scene/merge.ts` (see `Gear.tsx`).
- **DOM controls over the canvas**: `SceneOverlay.tsx` (outside the scene JSX runtime, which
  strips ARIA props). R3F files start with `/** @jsxImportSource @/lib/scene-jsx */`.
- Also follow `AGENTS.md` (architecture notes from the original Lovable build).

## Rules that are easy to break

- Readable HTML is hidden while the camera moves; the 3D textures carry the view. Board cards,
  the board note and hobby tags draw their **real text** in `scene/textures.ts` with the same
  layout numbers as their CSS. Change one, change the other.
- Shadows are static: anything new inside a `<Suspense>` in the scene needs `<RefreshShadows />`;
  anything that moves must go through the Director's motion so shadows redraw.
- The scene renders on demand; animations must `invalidate()`.
- Nothing the page shell imports may import `three` (keeps the 3D chunk lazy).
- Don't `scale()` `.scene-wrap` (the canvas would measure itself wrong).
- Animate only `transform`/`opacity`; respect `prefers-reduced-motion`.
- Hobby-tag anchors in `reading-surfaces.ts` are measured against the gear shapes in `Gear.tsx`;
  move them together.

## Verifying changes

Look at the site, not just the tests: drive it with a headless browser (Playwright + Chromium
with `--use-angle=swiftshader --enable-unsafe-swiftshader` for WebGL), screenshot the room and
every corner at 1440 × 900 and 390 × 844, and check the console for errors.
