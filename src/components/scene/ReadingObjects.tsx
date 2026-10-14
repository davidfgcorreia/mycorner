/** @jsxImportSource @/lib/scene-jsx */
import { Suspense, useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Corner } from '@/lib/portfolio';
import { achievements, hobbies } from '@/personal';
import { board, boardCards, boardNote, boardRect, bookPose, cardLayout, hobbyTags, journal, monitor, notebook, notebookHinge, primaryFace, printer, readingObjects, rectMatrix, schoolBook, sheet, sheetPose, surfaceScale, tag, type BookSize, type Face, type Vec } from '@/lib/reading-surfaces';
import { BoardContent, BookSpread, JournalContent, NotebookSpread, ResumeContent, ScreenContent, TagContent } from '@/components/ReadingContent';
import { useSceneColors } from './colors';
import { RefreshShadows } from './frames';
import { drawBookIndex, drawBookText, drawAchievementCard, drawCork, drawCoverLabel, drawJournal, drawBoardNote, drawNotebookLeft, drawNotebookRight, drawResume, drawHobbyTag, paperMaterial, useCanvasTexture } from './textures';

export type Motion = { progress: Record<Corner, number> };
export type Select = (corner: Corner, detail?: number) => void;
type Shared = { ready: boolean; portal: RefObject<HTMLDivElement | null>; onSelect: Select };

function pick(action: () => void) {
  return {
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); action(); },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; },
    onPointerOut: () => { document.body.style.cursor = 'auto'; },
  };
}

function Box({ position, size, color }: { position: Vec; size: Vec; color: string }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={.87} /></mesh>;
}

/** Transformed HTML sized to its physical face: one CSS pixel per face pixel, scaled into Three units. */
function SurfaceHtml({ face, portal, className, children }: { face: Face; portal: RefObject<HTMLDivElement | null>; className: string; children: ReactNode }) {
  const invalidate = useThree(s => s.invalidate);
  // The scene renders on demand: request frames so Drei places the HTML on the face right away.
  useEffect(() => {
    invalidate();
    const frame = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(frame);
  }, [invalidate]);
  const target = portal.current;
  if (!target) return null;
  return <Html portal={{ current: target }} transform center position={face.position} rotation={face.rotation ?? [0, 0, 0]} scale={surfaceScale(face)} distanceFactor={1} zIndexRange={[20, 10]}>
    <div className={`reading-surface ${className}`} style={{ width: face.pixels[0], height: face.pixels[1] }}>{children}</div>
  </Html>;
}

export function Monitor({ ready, portal, onSelect }: Shared) {
  return <group position={monitor.placement.position} rotation={monitor.placement.rotation} {...pick(() => onSelect('projects'))}>
    {/* The overview uses only the monitor model; readable content mounts after zoom settles. */}
    {ready && <SurfaceHtml face={primaryFace('projects')} portal={portal} className="surface-screen"><ScreenContent /></SurfaceHtml>}
  </group>;
}

export function PrinterWithSheet({ ready, portal, onSelect, motion }: Shared & { motion: Motion }) {
  const c = useSceneColors();
  const sheetRef = useRef<THREE.Group>(null);
  const rest = useMemo(() => sheetPose(0), []);
  const marks = useCanvasTexture(600, 845, drawResume, c);
  const printed = useMemo(() => paperMaterial(marks, c), [marks, c]);
  useEffect(() => () => printed.dispose(), [printed]);
  useFrame(() => {
    const g = sheetRef.current;
    if (!g) return;
    const pose = sheetPose(motion.progress.resume);
    g.position.set(...pose.position); g.rotation.set(...pose.rotation);
  });
  const face: Face = { position: [0, 0, .0008], width: sheet.width, height: sheet.height, pixels: primaryFace('resume').pixels };
  const { width, height, depth } = printer.body;
  return <group position={printer.placement.position} rotation={printer.placement.rotation} {...pick(() => onSelect('resume'))}>
    {/* Slim home inkjet shell facing the visitor. */}
    <RoundedBox args={[width, height, depth]} radius={.055} smoothness={3} position={[0, height / 2, 0]} castShadow receiveShadow><meshStandardMaterial color={c.paper} roughness={.65} /></RoundedBox>
    <RoundedBox args={[.75, .025, .44]} radius={.01} smoothness={2} position={[0, .245, -.02]} castShadow><meshStandardMaterial color={c.wall} roughness={.7} /></RoundedBox>
    <Box position={[0, .08, .251]} size={[.53, .075, .012]} color={c.metal} />
    <Box position={[0, .037, .4]} size={[.55, .025, .32]} color={c.wall} />
    <group position={[0, .25, -.22]} rotation={[-.2, 0, 0]}><Box position={[0, .11, 0]} size={[.4, .22, .02]} color={c.paper} /></group>
    <Box position={[-.3, .261, .08]} size={[.035, .005, .025]} color={c.green} />
    {/* The résumé itself: printed marks at room scale, the same sheet becomes readable up close. */}
    <group ref={sheetRef} position={rest.position} rotation={rest.rotation}>
      <mesh material={printed} castShadow receiveShadow><planeGeometry args={[sheet.width, sheet.height]} /></mesh>
      <mesh rotation-y={Math.PI} receiveShadow><planeGeometry args={[sheet.width, sheet.height]} /><meshStandardMaterial color={c.paper} roughness={.92} /></mesh>
      {ready && <SurfaceHtml face={face} portal={portal} className="surface-resume"><ResumeContent /></SurfaceHtml>}
    </group>
  </group>;
}

function BookBody({ size, coverColor, left, right, label, hinge, spine }: { size: BookSize; coverColor: string; left: THREE.Texture; right: THREE.Texture; label: THREE.Texture; hinge: RefObject<THREE.Group | null>; spine: RefObject<THREE.Group | null> }) {
  const c = useSceneColors();
  const { page: W, height: H, block: T, cover: C, overhang: E } = size;
  const coverW = W + E, coverH = H + 2 * E;
  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: c.paper, roughness: .95 });
    const face = (map: THREE.Texture) => paperMaterial(map, c);
    return { edge, left: [edge, edge, edge, edge, face(left), edge], right: [edge, edge, edge, edge, face(right), edge] };
  }, [c, left, right]);
  useEffect(() => () => { new Set([...materials.left, ...materials.right]).forEach(m => m.dispose()); }, [materials]);
  return <>
    <mesh position={[W / 2, 0, -T / 2]} material={materials.right} castShadow receiveShadow><boxGeometry args={[W, H, T]} /></mesh>
    <mesh position={[coverW / 2, 0, -T - C / 2]} castShadow receiveShadow><boxGeometry args={[coverW, coverH, C]} /><meshStandardMaterial color={coverColor} roughness={.75} /></mesh>
    {/* Front half hinges around the spine: closed at π, open flat at 0. */}
    <group ref={hinge} rotation-y={Math.PI}>
      <mesh position={[-W / 2, 0, -T / 2]} material={materials.left} castShadow receiveShadow><boxGeometry args={[W, H, T]} /></mesh>
      <mesh position={[-coverW / 2, 0, -T - C / 2]} castShadow receiveShadow><boxGeometry args={[coverW, coverH, C]} /><meshStandardMaterial color={coverColor} roughness={.75} /></mesh>
      <mesh position={[-coverW / 2, H * .14, -T - C - .0008]} rotation-y={Math.PI}><planeGeometry args={[W * .64, H * .28]} /><meshStandardMaterial map={label} transparent roughness={.85} /></mesh>
    </group>
    <group ref={spine}>
      <mesh position={[-C / 2, 0, 0]} castShadow><boxGeometry args={[C, coverH, 2 * (T + C)]} /><meshStandardMaterial color={coverColor} roughness={.75} /></mesh>
      <mesh position={[-C - .0008, H * .22, 0]} rotation-y={-Math.PI / 2}><planeGeometry args={[2 * (T + C) * .72, H * .2]} /><meshStandardMaterial color={c.paper} roughness={.85} /></mesh>
    </group>
  </>;
}

function applyHinge(hinge: THREE.Group | null, spine: THREE.Group | null, angle: number) {
  if (hinge) hinge.rotation.y = angle;
  if (spine) spine.scale.z = Math.max(.001, -Math.cos(angle));
}

export function SchoolBook({ ready, portal, onSelect, motion }: Shared & { motion: Motion }) {
  const c = useSceneColors();
  const root = useRef<THREE.Group>(null), hinge = useRef<THREE.Group>(null), spine = useRef<THREE.Group>(null);
  const rest = useMemo(() => bookPose(0), []);
  const left = useCanvasTexture(300, 424, drawBookIndex, c);
  const right = useCanvasTexture(300, 424, drawBookText, c);
  const label = useCanvasTexture(256, 128, drawCoverLabel, c);
  useFrame(() => {
    if (!root.current) return;
    const pose = bookPose(motion.progress.studies);
    root.current.position.set(...pose.position); root.current.rotation.set(...pose.rotation);
    applyHinge(hinge.current, spine.current, pose.hinge);
  });
  return <group ref={root} position={rest.position} rotation={rest.rotation} {...pick(() => onSelect('studies'))}>
    <BookBody size={schoolBook.size} coverColor={c.green} left={left} right={right} label={label} hinge={hinge} spine={spine} />
    {ready && <SurfaceHtml face={primaryFace('studies')} portal={portal} className="surface-book"><BookSpread /></SurfaceHtml>}
  </group>;
}

export function AboutNotebook({ ready, portal, onSelect, motion }: Shared & { motion: Motion }) {
  const c = useSceneColors();
  const hinge = useRef<THREE.Group>(null), spine = useRef<THREE.Group>(null);
  const left = useCanvasTexture(262, 350, drawNotebookLeft, c);
  const right = useCanvasTexture(262, 350, drawNotebookRight, c);
  const label = useCanvasTexture(256, 128, drawCoverLabel, c);
  useFrame(() => applyHinge(hinge.current, spine.current, notebookHinge(motion.progress.about)));
  return <group position={notebook.placement.position} rotation={notebook.placement.rotation} {...pick(() => onSelect('about'))}>
    <BookBody size={notebook.size} coverColor={c.orange} left={left} right={right} label={label} hinge={hinge} spine={spine} />
    {ready && <SurfaceHtml face={primaryFace('about')} portal={portal} className="surface-notebook"><NotebookSpread /></SurfaceHtml>}
  </group>;
}

/** One pinned card: paper, the photo, its real title and caption, and a pin. Drawn at 2× for close-ups. */
function BoardCard({ index, map }: { index: number; map: THREE.Texture }) {
  const c = useSceneColors();
  const achievement = achievements[index];
  const draw = useMemo(() => (achievement ? drawAchievementCard(achievement) : () => {}), [achievement]);
  const marks = useCanvasTexture(640, 880, draw, c);
  const card = boardCards[index];
  if (!card) return null;
  const s = board.width / board.pixels[0];
  const r = boardRect(card);
  const photoY = (card.h / 2 - cardLayout.pad - cardLayout.photo[1] / 2) * s;
  return <group position={[r.position[0], r.position[1], .002]} rotation={r.rotation}>
    <mesh castShadow receiveShadow><boxGeometry args={[r.width, r.height, .004]} /><meshStandardMaterial color={c.paper} roughness={.9} /></mesh>
    {/* Unlit and untone-mapped, so the face matches the HTML that replaces it pixel for pixel. */}
    <mesh position={[0, 0, .0021]}><planeGeometry args={[r.width, r.height]} /><meshBasicMaterial map={marks} toneMapped={false} /></mesh>
    <mesh position={[0, photoY, .0024]}><planeGeometry args={[cardLayout.photo[0] * s, cardLayout.photo[1] * s]} /><meshBasicMaterial map={map} toneMapped={false} /></mesh>
    {/* Pin: an 18 px flat disc centred on the top edge, exactly like `.board-pin`, so the swap to HTML is invisible. */}
    <mesh position={[0, r.height / 2, .008]}><circleGeometry args={[9 * s, 24]} /><meshBasicMaterial color={c.green} toneMapped={false} /></mesh>
  </group>;
}

function BoardCards() {
  const maps = useTexture(achievements.map(a => a.image));
  useEffect(() => { maps.forEach(m => { m.colorSpace = THREE.SRGBColorSpace; m.needsUpdate = true; }); }, [maps]);
  return <>{boardCards.map((_, i) => { const map = maps[i]; return map && <BoardCard key={i} index={i} map={map} />; })}</>;
}

export function AchievementBoard({ ready, portal, onSelect, detail, onDetail }: Shared & { detail: number | null; onDetail: (detail: number | null) => void }) {
  const c = useSceneColors();
  const cork = useCanvasTexture(600, 360, drawCork, c);
  const note = useCanvasTexture(880, 224, drawBoardNote, c);
  const n = boardRect(boardNote);
  return <group position={board.placement.position} rotation={board.placement.rotation} {...pick(() => onSelect('achievements'))}>
    <Box position={[0, 0, -.106]} size={[1.65, 1.05, .13]} color={c['wood-dark']} />
    <mesh position={[0, 0, -.021]} receiveShadow><boxGeometry args={[board.width, board.height, .04]} /><meshStandardMaterial map={cork} roughness={1} /></mesh>
    <mesh position={[n.position[0], n.position[1], .0015]} rotation={n.rotation} castShadow><planeGeometry args={[n.width, n.height]} /><meshBasicMaterial map={note} toneMapped={false} /></mesh>
    <Suspense fallback={null}><BoardCards /><RefreshShadows /></Suspense>
    {ready && <SurfaceHtml face={primaryFace('achievements')} portal={portal} className="surface-board"><BoardContent detail={detail} onDetail={onDetail} /></SurfaceHtml>}
  </group>;
}

export function WorkJournal({ ready, portal, onSelect, detail, onDetail }: Shared & { detail: number | null; onDetail: (detail: number | null) => void }) {
  const c = useSceneColors();
  const page = useCanvasTexture(610, 720, drawJournal, c);
  return <group position={journal.placement.position} rotation={journal.placement.rotation} {...pick(() => onSelect('experience'))}>
    <Box position={[0, 0, -.069]} size={[.72, .85, .09]} color={c.green} />
    <Box position={[0, 0, -.009]} size={[journal.paper.width, journal.paper.height, .018]} color={c.paper} />
    <mesh position={[0, 0, .0004]}><planeGeometry args={[journal.paper.width, journal.paper.height]} /><meshStandardMaterial map={page} emissive={c.paper} emissiveMap={page} emissiveIntensity={.5} roughness={.9} /></mesh>
    <Box position={[0, .36, .021]} size={[.23, .07, .03]} color={c.metal} />
    {ready && <SurfaceHtml face={primaryFace('experience')} portal={portal} className="surface-journal"><JournalContent detail={detail} onDetail={onDetail} /></SurfaceHtml>}
  </group>;
}

function HobbyTagMesh({ index, ready, portal, onSelect, focused, onFocus, face, rotation, string }: Shared & { index: number; focused: boolean; onFocus: () => void; face: Face; rotation: Vec; string: { mid: THREE.Vector3; length: number; quaternion: THREE.Quaternion } }) {
  const c = useSceneColors();
  const hobby = hobbies[index];
  const draw = useMemo(() => (hobby ? drawHobbyTag(hobby) : () => {}), [hobby]);
  const marks = useCanvasTexture(1040, 640, draw, c);
  return <group>
    <group position={face.position} rotation={rotation} {...pick(() => onSelect('hobbies', index))}>
      <mesh castShadow><planeGeometry args={[tag.width, tag.height]} /><meshBasicMaterial map={marks} alphaTest={.5} side={THREE.DoubleSide} toneMapped={false} /></mesh>
      {ready && <SurfaceHtml face={{ ...face, position: [0, 0, .0008], rotation: [0, 0, 0] }} portal={portal} className="surface-tag"><TagContent index={index} focused={focused} onFocus={onFocus} /></SurfaceHtml>}
    </group>
    <mesh position={string.mid} quaternion={string.quaternion}><cylinderGeometry args={[.0032, .0032, string.length, 6]} /><meshStandardMaterial color={c['wood-dark']} roughness={.9} /></mesh>
  </group>;
}

export function HobbyTags({ ready, portal, onSelect, detail, onDetail }: Shared & { detail: number | null; onDetail: (detail: number | null) => void }) {
  const placement = readingObjects.hobbies.placement;
  const tags = useMemo(() => hobbyTags.map((t, i) => {
    const face = primaryFace('hobbies', i);
    const hole = new THREE.Vector3((tag.hole[0] / tag.pixels[0] - .5) * tag.width, (.5 - tag.hole[1] / tag.pixels[1]) * tag.height, 0).applyMatrix4(rectMatrix(placement, face));
    const anchor = new THREE.Vector3(...t.anchor);
    const direction = anchor.clone().sub(hole);
    const string = { mid: hole.clone().add(anchor).multiplyScalar(.5), length: direction.length(), quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()) };
    return { id: t.id, face, rotation: face.rotation ?? [0, 0, 0] as Vec, string };
  }), [placement]);
  return <>{tags.map(({ id, face, rotation, string }, i) => <HobbyTagMesh key={id} index={i} face={face} rotation={rotation} string={string} ready={ready} portal={portal} onSelect={onSelect} focused={detail === i} onFocus={() => onDetail(i)} />)}</>;
}

export function ReadingObjects({ active, ready, detail, motion, portal, onSelect, onDetail }: { active: Corner | null; ready: boolean; detail: number | null; motion: Motion; portal: RefObject<HTMLDivElement | null>; onSelect: Select; onDetail: (detail: number | null) => void }) {
  const live = (corner: Corner) => ready && active === corner;
  const shared = { portal, onSelect };
  return <>
    <Monitor ready={live('projects')} {...shared} />
    <PrinterWithSheet ready={live('resume')} motion={motion} {...shared} />
    <SchoolBook ready={live('studies')} motion={motion} {...shared} />
    <AchievementBoard ready={live('achievements')} detail={detail} onDetail={onDetail} {...shared} />
    <WorkJournal ready={live('experience')} detail={detail} onDetail={onDetail} {...shared} />
    <HobbyTags ready={live('hobbies')} detail={detail} onDetail={onDetail} {...shared} />
    <AboutNotebook ready={live('about')} motion={motion} {...shared} />
  </>;
}
