/** @jsxImportSource @/lib/scene-jsx */
import * as THREE from 'three';
import { useSceneColors, type SceneColors } from './colors';
import { bakedMaterial, box, part, useMerged, within, type Part } from './merge';
import type { Vec } from '@/lib/reading-surfaces';

/*
 * Hand-built hobby gear. Each piece stands on y = 0 in its own frame and is baked into a
 * single mesh (see merge.ts). Hobby-tag anchors in reading-surfaces are measured against
 * these shapes, so move them together.
 */
type GearProps = { position: Vec; rotation?: Vec; onClick?: () => void };

function Gear({ position, rotation = [0, 0, 0], onClick, geometry }: GearProps & { geometry: THREE.BufferGeometry }) {
  return <mesh position={position} rotation={rotation} geometry={geometry} material={bakedMaterial} castShadow receiveShadow
    onClick={e => { if (onClick) { e.stopPropagation(); onClick(); } }}
    onPointerOver={() => { if (onClick) document.body.style.cursor = 'pointer'; }}
    onPointerOut={() => { document.body.style.cursor = 'auto'; }} />;
}

/** Board outline, centred on y = 0: rounded squash tail, widest just below the middle, pointed nose. */
const boardLength = 2.3;
function boardShape(scaleX = 1, scaleY = 1) {
  const h = boardLength / 2, x = (v: number) => v * scaleX, y = (v: number) => v * scaleY;
  const shape = new THREE.Shape();
  shape.moveTo(x(-.13), y(-h));
  shape.lineTo(x(.13), y(-h));
  shape.bezierCurveTo(x(.22), y(-h + .05), x(.28), y(-.55), x(.28), y(-.15));
  shape.bezierCurveTo(x(.28), y(.45), x(.17), y(.95), x(0), y(h));
  shape.bezierCurveTo(x(-.17), y(.95), x(-.28), y(.45), x(-.28), y(-.15));
  shape.bezierCurveTo(x(-.28), y(-.55), x(-.22), y(-h + .05), x(-.13), y(-h));
  return shape;
}

function surfboard(c: SceneColors): Part[] {
  const depth = .036, bevel = .014, deck = depth / 2 + bevel;
  const body = new THREE.ExtrudeGeometry(boardShape(), { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 28 });
  body.translate(0, 0, -depth / 2);
  // Deck: an orange rail band, the white centre, a stringer and a tail pad; fin underneath.
  return within([
    part(body, c.paper),
    part(new THREE.ShapeGeometry(boardShape(.9, .95), 28), c.orange, [0, 0, deck + .001]),
    part(new THREE.ShapeGeometry(boardShape(.8, .9), 28), c.paper, [0, 0, deck + .002]),
    box([0, .02, deck + .003], [.012, boardLength * .86, .002], c['wood-dark']),
    box([0, -.82, deck + .004], [.3, .32, .004], c.ink),
    box([0, -.86, -deck - .06], [.016, .18, .12], c.metal),
  ], [0, boardLength / 2 + bevel, 0]);
}

/** Rigid board; lean it against a wall with a negative x rotation. */
export const surfboardLean = .13;
export function Surfboard(props: GearProps) {
  const c = useSceneColors();
  return <Gear {...props} geometry={useMerged(() => surfboard(c), [c])} />;
}

function fishingRod(c: SceneColors, lean: number): Part[] {
  // Square blank that steps thinner towards the tip.
  const blank: [number, number, number][] = [[.42, 1.0, .03], [1.0, 1.6, .022], [1.6, 2.2, .014]];
  return [
    box([0, .04, 0], [.05, .08, .05], c.ink),
    box([0, .25, 0], [.045, .34, .045], c.cork),
    ...blank.map(([y0, y1, w]) => box([0, (y0 + y1) / 2, 0], [w, y1 - y0, w], c.ink)),
    ...[.95, 1.35, 1.75, 2.1].map(y => box([0, y, .018], [.012, .012, .022], c.metal)),
    // Reel under the handle.
    ...within([
      box([0, 0, 0], [.1, .1, .04], c.green),
      box([0, 0, -.035], [.02, .02, .03], c.metal),
      box([.04, .03, .035], [.015, .07, .02], c.metal),
    ], [0, .48, .065]),
    // Line and lure, counter-rotated against the lean so they hang plumb.
    ...within([
      box([0, -.16, 0], [.003, .32, .003], c.ink),
      ...within([
        box([0, 0, 0], [.03, .08, .026], c.red),
        box([0, -.015, .001], [.032, .035, .026], c.paper),
        box([0, .045, 0], [.02, .014, .036], c.metal),
        box([0, -.055, 0], [.004, .03, .004], c.metal),
        box([0, -.068, .008], [.004, .004, .018], c.metal),
      ], [0, -.36, 0]),
    ], [0, 2.2, .02], [lean, 0, 0]),
  ];
}

/** Rod leaning by `lean` (radians about x); the line and lure hang straight down from the tip. */
export function FishingRod({ lean = 0, ...props }: GearProps & { lean?: number }) {
  const c = useSceneColors();
  return <Gear {...props} rotation={[-lean, 0, 0]} geometry={useMerged(() => fishingRod(c, lean), [c, lean])} />;
}

function racket(c: SceneColors): Part[] {
  const w = .34, h = .42, bar = .028, cut = .07, cy = .67;
  const inner = (n: number, span: number) => Array.from({ length: n }, (_, i) => (i - (n - 1) / 2) * (span / n));
  const corners: [number, number][] = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
  return [
    // Handle, grip collar and the two throat arms.
    box([0, .14, 0], [.04, .28, .032], c.ink),
    box([0, .3, 0], [.032, .06, .026], c.paper),
    ...[-1, 1].map(side => box([side * .055, .38, 0], [.024, .17, .024], c.paper, [0, 0, -side * .6])),
    // Head: four straight sides with chamfered corners, strung in red.
    ...within([
      box([0, h / 2, 0], [w - cut * 2, bar, bar], c.paper),
      box([0, -h / 2, 0], [w - cut * 2, bar, bar], c.paper),
      box([w / 2, 0, 0], [bar, h - cut * 2, bar], c.paper),
      box([-w / 2, 0, 0], [bar, h - cut * 2, bar], c.paper),
      ...corners.map(([sx, sy]) => box([sx * (w / 2 - cut / 2), sy * (h / 2 - cut / 2), 0], [cut * 1.42, bar, bar], c.paper, [0, 0, sx * sy * -Math.PI / 4])),
      ...inner(7, w - bar).map(x => box([x, 0, 0], [.006, h - bar - (Math.abs(x) > w / 2 - cut ? cut : 0), .006], c.red)),
      ...inner(8, h - bar).map(y => box([0, y, 0], [w - bar - (Math.abs(y) > h / 2 - cut ? cut : 0), .006, .006], c.red)),
    ], [0, cy, 0]),
  ];
}

/** White boxy frame strung in red. */
export function Racket(props: GearProps) {
  const c = useSceneColors();
  return <Gear {...props} geometry={useMerged(() => racket(c), [c])} />;
}

function sportsBag(c: SceneColors): Part[] {
  return [
    box([0, .025, 0], [.82, .05, .42], c.ink),
    box([0, .21, 0], [.8, .34, .4], c.bag),
    box([0, .385, 0], [.82, .02, .07], c.ink),
    ...[-1, 1].map(side => box([side * .405, .2, 0], [.02, .26, .3], c.ink)),
    // Front pocket and a green side stripe.
    box([0, .15, .205], [.42, .17, .02], c.ink),
    box([0, .3, .201], [.8, .035, .004], c.green),
    box([0, .3, -.201], [.8, .035, .004], c.green),
    // Carry handle.
    ...[-1, 1].map(side => box([side * .12, .435, 0], [.024, .1, .024], c.ink)),
    box([0, .488, 0], [.264, .024, .024], c.ink),
  ];
}

/** Boxy duffel bag; the handle top sits at y = .5 for the tennis tag string. */
export function SportsBag(props: GearProps) {
  const c = useSceneColors();
  return <Gear {...props} geometry={useMerged(() => sportsBag(c), [c])} />;
}
