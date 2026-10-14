# Performance

Goal: animations at the display's full frame rate, a light first load, and an idle page that
does almost no work.

## Budgets (desktop, idle room)

| Metric | Budget | Measured (Oct 2026) |
| --- | --- | --- |
| Draw calls per frame | ≤ 120 | ~100 |
| Meshes / materials | ≤ 90 / ≤ 70 | 75 / 57 |
| JS + CSS before the page shell paints (gzip) | ≤ 150 KB | ~125 KB |
| 3D chunk (gzip, lazy) | ≤ 300 KB | ~280 KB |
| CSS (raw) | ≤ 50 KB | ~39 KB |

## Rules

**Rendering**

- The canvas renders **on demand** (`frameloop="demand"`). Anything that animates must call
  `invalidate()`; only the idle hotspot pulse keeps the loop running, and it stops in reading
  mode and with reduced motion.
- Static geometry is **baked**: build parts with `box()` / `part()` / `within()` and
  `useMerged()` from `scene/merge.ts`, render with `bakedMaterial`. Don't add loose meshes for
  scenery.
- **Shadows are static**: `shadowMap.autoUpdate` is off. The Director redraws shadows while
  objects move; anything that loads inside a `<Suspense>` must include `<RefreshShadows />`.
- Pixel ratio is capped at 1.75.
- No drei `<Environment>` (it pulls in HDR/EXR/gain-map loaders); `StudioEnvironment` builds the
  light panel once with `PMREMGenerator`.
- Models load with plain `GLTFLoader`; keep them uncompressed and small (Kenney GLBs are 5–40 KB).

**Loading**

- `CabinScene` is `lazy()`-loaded. Nothing the page shell imports may import `three`
  (that is why `lib/board-layout.ts` exists). Check after changes:
  `npx vite build` and confirm `WebGLRenderer` appears only in the `CabinScene-*.js` chunk.
- Images: WebP, about 3× their largest on-screen CSS size (board photos: 864px wide).
- Only `ui/button.tsx` from shadcn is kept; Tailwind scans `src`, so unused components bloat CSS.

**HTML over the scene**

- Never animate readable HTML in step with the camera; it is hidden while moving (see
  `architecture.md`).
- Avoid `box-shadow`/`filter` transitions inside readable surfaces.
- Don't `scale()` `.scene-wrap` or the canvas will size itself wrong.

## Measuring

The visual checks were done with Playwright driving Chromium (headless; WebGL through
SwiftShader):

- **Screenshots** of the room and each corner, desktop (1440 × 900) and phone (390 × 844).
- **Renderer stats**: temporarily expose `gl` and `scene` from inside the Canvas, then read
  `gl.info.render.calls/triangles` and traverse the scene for meshes and materials.
- **Transitions**: Chrome tracing (`devtools.timeline`, `cc`, `gpu`) around a camera move,
  summing `RasterTask`, `Paint` and `GPUTask`.

SwiftShader renders WebGL in software, so absolute frame times are pessimistic and long
`SwapBuffers` tasks in the GPU process are an artefact. Compare before/after, and confirm the
feel on real hardware (Chrome and Firefox).
