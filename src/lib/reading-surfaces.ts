import * as THREE from 'three';
import type { Corner } from './portfolio';
import { journalEntry } from './journal-layout';
import { experience } from '@/personal';

/*
 * One source of truth for every readable object in the cabin.
 * Object placements are world coordinates; faces, frames and close-ups are local to
 * their placement. Physical dimensions (Three units) and HTML pixel dimensions describe
 * the same surface, so close-up content lands exactly on the paper, page or display.
 */
export type Vec = [number, number, number];
export type Placement = { position: Vec; rotation: Vec };
export type Rect = { position: Vec; rotation?: Vec; width: number; height: number };
export type Face = Rect & { pixels: [number, number] };
export type ReadingObject = {
  placement: Placement;
  faces: Face[];
  frame?: Rect[];
  narrowFrame?: Rect[];
  details?: Rect[];
  narrowDetails?: Rect[];
  defaultDetail?: 'always' | 'narrow';
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpVec = (a: Vec, b: Vec, t: number): Vec => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const smoothstep = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const easeInOut = (t: number) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* Computer: the black glass sits in the recessed display of the CC0 monitor model. */
export const monitor = { placement: { position: [-1.2, 1.3705, -1.779] as Vec, rotation: [0, 0, 0] as Vec }, glass: { width: .82, height: .501 } };

/* Printer: a slim inkjet whose output slot feeds a real sheet of paper. */
export const printer = {
  placement: { position: [1.25, .685, -1.78] as Vec, rotation: [0, 0, 0] as Vec },
  body: { width: .82, height: .23, depth: .5 },
  slot: [0, .075, .262] as Vec,
  trayTop: .0495,
};
export const sheet = { width: .44, height: .62, restOut: .27, slope: .08, standAngle: -.2, standEdge: [0, .053, .5] as Vec };
const lieAngle = -(Math.PI / 2 - Math.atan(sheet.slope));

/** Sheet pose in printer space: 0 = resting on the tray with its top still in the slot, 1 = raised for reading. */
export function sheetPose(p: number): Placement {
  const feed = easeInOut(clamp01(p / .38));
  const lift = easeInOut(clamp01((p - .38) / .62));
  const out = lerp(sheet.restOut, sheet.height, feed);
  const lying: Vec = [0, Math.cos(lieAngle), Math.sin(lieAngle)];
  const fed: Vec = [0, printer.slot[1] - lying[1] * out, printer.slot[2] - lying[2] * out];
  // The bottom edge waits in front of the slot until the top has cleared the printer body.
  const edge = lerpVec(fed, sheet.standEdge, smoothstep(.3, 1, lift));
  const theta = lerp(lieAngle, sheet.standAngle, lift);
  const up: Vec = [0, Math.cos(theta), Math.sin(theta)];
  return { position: [0, edge[1] + up[1] * sheet.height / 2, edge[2] + up[2] * sheet.height / 2], rotation: [theta, 0, 0] };
}

/* Books: page blocks hinge around the spine at local x = 0; open pages face local +z. */
export type BookSize = { page: number; height: number; block: number; cover: number; overhang: number };
export type BookPose = Placement & { hinge: number };
export const schoolBook = {
  size: { page: .17, height: .24, block: .02, cover: .006, overhang: .006 } as BookSize,
  shelf: { position: [-2.4, 1.968, 1.9] as Vec, rotation: [0, Math.PI, 0] as Vec },
  pulled: [-2.1, 1.985, 1.9] as Vec,
  held: { position: [-1.75, 1.45, .92] as Vec, rotation: [-.1, 0, 0] as Vec },
};

/** School book pose: 0 = closed on the shelf (spine out), 1 = held open in front of the viewer. */
export function bookPose(p: number): BookPose {
  const { shelf, pulled, held } = schoolBook;
  const pull = easeInOut(clamp01(p / .2));
  const travel = easeInOut(clamp01((p - .14) / .5));
  const open = easeInOut(clamp01((p - .6) / .4));
  const position = lerpVec(lerpVec(shelf.position, pulled, pull), held.position, travel);
  position[1] += .1 * Math.sin(Math.PI * travel);
  return { position, rotation: lerpVec(shelf.rotation, held.rotation, travel), hinge: lerp(Math.PI, 0, open) };
}

export const notebook = {
  size: { page: .15, height: .2, block: .008, cover: .004, overhang: .004 } as BookSize,
  placement: { position: [-.34, .999, -1.38] as Vec, rotation: [-Math.PI / 2, 0, -.1] as Vec },
};
export const notebookHinge = (p: number) => lerp(Math.PI, 0, easeInOut(clamp01(p)));

/* Achievement board: card and note layout in board pixels, shared with the HTML board. */
export const board = { placement: { position: [0, 1.76, -2.244] as Vec, rotation: [0, 0, 0] as Vec }, width: 1.5, height: .9, pixels: [1200, 720] as [number, number] };
import { boardCards, boardNote, type BoardItem } from './board-layout';
export { boardCards, boardNote, type BoardItem };
/** Card internals in card pixels, shared by the room marks and the HTML card. */
export const cardLayout = { pad: 16, photo: [288, 192] as [number, number], title: 232, description: 270, note: 404 };
export function boardRect(item: BoardItem, grow = 1, tilt = true): Rect & { rotation: Vec } {
  const s = board.width / board.pixels[0];
  return { position: [(item.x - board.pixels[0] / 2) * s, (board.pixels[1] / 2 - item.y) * s, 0], rotation: [0, 0, tilt ? -item.angle * Math.PI / 180 : 0], width: item.w * s * grow, height: item.h * s * grow };
}

/* Work journal on the back wall; the readable face stays clear of the metal clip. */
export const journal = { placement: { position: [-1.55, 2.05, -2.241] as Vec, rotation: [0, 0, 0] as Vec }, paper: { width: .61, height: .72 } };

/* Hobby tags hang beside the gear and all face the same reading direction. */
export const tagFacing: Vec = [-.119, .361, 0];
export const tag = { width: .26, height: .16, pixels: [520, 320] as [number, number], hole: [42, 160] as [number, number], holeRadius: 14 };
export const hobbyTags: { id: 'tennis' | 'surfing' | 'fishing'; position: Vec; tilt: number; anchor: Vec }[] = [
  { id: 'tennis', position: [2.68, .02, -1.3], tilt: .05, anchor: [2.4, .15, -1.65] },
  { id: 'surfing', position: [1.95, .9, -1.98], tilt: -.06, anchor: [1.86, 1.09, -2.22] },
  { id: 'fishing', position: [2.74, .62, -1.95], tilt: .04, anchor: [2.66, .83, -2.2] },
];

const at = (position: Vec, width: number, height: number, rotation?: Vec): Rect => ({ position, width, height, ...(rotation ? { rotation } : {}) });
export const readingObjects: Record<Corner, ReadingObject> = {
  projects: {
    placement: monitor.placement,
    faces: [{ position: [0, 0, .0008], width: .78, height: .46, pixels: [1000, 590] }],
    frame: [at([0, 0, 0], .87, .55)],
  },
  resume: {
    placement: printer.placement,
    faces: [{ ...sheetPose(1), width: sheet.width, height: sheet.height, pixels: [600, 845] }],
  },
  studies: {
    placement: schoolBook.held,
    faces: [{ position: [0, 0, .0006], width: .34, height: .24, pixels: [1200, 847] }],
    frame: [at([0, 0, 0], .352, .252)],
    narrowFrame: [at([.085, 0, 0], .174, .244)],
  },
  achievements: {
    placement: board.placement,
    faces: [{ position: [0, 0, .003], width: board.width, height: board.height, pixels: board.pixels }],
    details: boardCards.map(card => boardRect(card, 1.16, false)),
    defaultDetail: 'narrow',
  },
  experience: {
    placement: journal.placement,
    faces: [{ position: [0, -.04, .002], width: .61, height: .64, pixels: [610, 640] }],
    frame: [at([0, -.01, 0], .62, .72)],
    details: experience.map((_, i) => {
      const entry = journalEntry(i);
      return at([(entry.x + entry.width / 2 - 305) / 1000, -.04 + (320 - entry.y - entry.height / 2) / 1000, .002], (entry.width + 32) / 1000, (entry.height + 44) / 1000);
    }),
  },
  hobbies: {
    placement: { position: [0, 0, 0], rotation: [0, 0, 0] },
    faces: hobbyTags.map(t => ({ position: t.position, rotation: [tagFacing[0], tagFacing[1], t.tilt] as Vec, width: tag.width, height: tag.height, pixels: tag.pixels })),
    frame: hobbyTags.map(t => at(t.position, .5, .36, tagFacing)),
    details: hobbyTags.map(t => at(t.position, .72, .48, tagFacing)),
    narrowDetails: hobbyTags.map(t => at(t.position, .3, .2, tagFacing)),
    defaultDetail: 'always',
  },
  about: {
    placement: notebook.placement,
    faces: [{ position: [0, 0, .0006], width: .3, height: .2, pixels: [1050, 700] }],
    frame: [at([0, 0, 0], .31, .21)],
    narrowFrame: [at([.075, 0, 0], .154, .204)],
  },
};

/** Seconds each object takes to open; omitted objects are already in reading position. */
export const motionDurations: Partial<Record<Corner, number>> = { resume: 1.3, studies: 1.6, about: .9 };
export const cameraDuration = 1.25;
export const camera = { distance: 3, padX: 24, padY: 60, margin: 1.04, room: [8, 6.5, 10] as Vec, roomLook: [0, .85, 0] as Vec };

export const isNarrow = (width: number, height: number) => width < 700 || width / height < .8;
export const surfaceScale = (face: Face) => 400 * face.width / face.pixels[0];
export function defaultDetail(corner: Corner | null, narrow: boolean) {
  const rule = corner ? readingObjects[corner].defaultDetail : undefined;
  return rule === 'always' || (rule === 'narrow' && narrow) ? 0 : null;
}
export function primaryFace(corner: Corner, index = 0): Face {
  const face = readingObjects[corner].faces[index];
  if (!face) throw new Error(`No reading face ${index} for ${corner}`);
  return face;
}
export function detailCount(corner: Corner | null) { return corner ? readingObjects[corner].details?.length ?? 0 : 0; }

export function poseMatrix(pose: { position: Vec; rotation?: Vec }) {
  return new THREE.Matrix4().compose(new THREE.Vector3(...pose.position), new THREE.Quaternion().setFromEuler(new THREE.Euler(...(pose.rotation ?? [0, 0, 0]))), new THREE.Vector3(1, 1, 1));
}
export function rectMatrix(root: Placement, rect: Rect) { return poseMatrix(root).multiply(poseMatrix(rect)); }
export function rectCorners(root: Placement, rect: Rect) {
  const m = rectMatrix(root, rect);
  return ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).map(([x, y]) => new THREE.Vector3(x * rect.width / 2, y * rect.height / 2, 0).applyMatrix4(m));
}

/** World-space rectangle the camera should frame for an object, close-up or narrow layout. */
export function frameView(corner: Corner, detail: number | null, narrow: boolean) {
  const o = readingObjects[corner];
  const details = narrow && o.narrowDetails ? o.narrowDetails : o.details;
  const rects = detail !== null && details?.[detail] ? [details[detail]] : (narrow && o.narrowFrame) || o.frame || o.faces;
  const first = rects[0];
  if (!first) throw new Error(`No framing rectangle for ${corner}`);
  const quaternion = new THREE.Quaternion();
  rectMatrix(o.placement, first).decompose(new THREE.Vector3(), quaternion, new THREE.Vector3());
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, depth = 0, count = 0;
  for (const rect of rects) for (const p of rectCorners(o.placement, rect)) {
    const x = p.dot(right), y = p.dot(up);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    depth += p.dot(normal); count++;
  }
  const center = right.clone().multiplyScalar((minX + maxX) / 2).addScaledVector(up, (minY + maxY) / 2).addScaledVector(normal, depth / count);
  return { center, quaternion, right, up, normal, width: maxX - minX, height: maxY - minY };
}

export type CameraPose = { position: THREE.Vector3; look: THREE.Vector3; up: THREE.Vector3; zoom: number };
export function cameraView(corner: Corner, detail: number | null, size: { width: number; height: number }): CameraPose {
  const f = frameView(corner, detail, isNarrow(size.width, size.height));
  const zoom = Math.min((size.width - camera.padX * 2) / f.width, (size.height - camera.padY * 2) / f.height) / camera.margin;
  return { position: f.center.clone().addScaledVector(f.normal, camera.distance), look: f.center, up: f.up, zoom };
}
export function roomView(size: { width: number; height: number }, zoomFactor: number): CameraPose {
  return { position: new THREE.Vector3(...camera.room), look: new THREE.Vector3(...camera.roomLook), up: new THREE.Vector3(0, 1, 0), zoom: Math.min(size.width / 10.5, size.height / 7.5) * zoomFactor };
}
