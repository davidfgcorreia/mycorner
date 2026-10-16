/** @jsxImportSource @/lib/scene-jsx */
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { SceneOverlay } from '@/components/SceneOverlay';
import { ReadingObjects, type Motion, type Select } from '@/components/scene/ReadingObjects';
import { useSceneColors } from '@/components/scene/colors';
import { bakedMaterial, box, part, useMerged, type Part } from '@/components/scene/merge';
import { RefreshShadows, prefersReducedMotion } from '@/components/scene/frames';
import type { Corner } from '@/lib/portfolio';
import { camera as rig, cameraDuration, cameraView, defaultDetail, easeInOut, isNarrow, motionDurations, readingObjects, roomView, type CameraPose, type Vec } from '@/lib/reading-surfaces';
import { Surfboard, FishingRod, Racket, SportsBag, surfboardLean } from '@/components/scene/Gear';
import deskUrl from '@/assets/models/desk.glb?url';
import screenUrl from '@/assets/models/computerScreen.glb?url';
import keyboardUrl from '@/assets/models/computerKeyboard.glb?url';
import chairUrl from '@/assets/models/chairDesk.glb?url';
import booksUrl from '@/assets/models/books.glb?url';
import plantUrl from '@/assets/models/plantSmall1.glb?url';
import tallPlantUrl from '@/assets/models/pottedPlant.glb?url';

const CORNERS: Corner[] = ['projects', 'studies', 'achievements', 'hobbies', 'about', 'resume', 'experience'];

function pickable(onClick?: () => void) {
  return {
    onClick: (e: { stopPropagation: () => void }) => { if (onClick) { e.stopPropagation(); onClick(); } },
    onPointerOver: () => { if (onClick) document.body.style.cursor = 'pointer'; },
    onPointerOut: () => { document.body.style.cursor = 'auto'; },
  };
}

/** A downloaded model, normalised to `size` on its longest side and baked into a single mesh. */
function Prop({ url, position, size, rotation = [0, 0, 0], onClick }: { url: string; position: Vec; size: number; rotation?: Vec; onClick?: () => void }) {
  const { scene } = useLoader(GLTFLoader, url);
  const geometry = useMerged(() => {
    scene.updateMatrixWorld(true);
    const parts: Part[] = [];
    scene.traverse(o => {
      if (!(o instanceof THREE.Mesh)) return;
      const material = (Array.isArray(o.material) ? o.material[0] : o.material) as THREE.MeshStandardMaterial | undefined;
      parts.push({ geometry: o.geometry.clone(), color: `#${material?.color?.getHexString(THREE.SRGBColorSpace) ?? 'ffffff'}`, matrix: o.matrixWorld.clone() });
    });
    const bounds = new THREE.Box3();
    for (const p of parts) { p.geometry.computeBoundingBox(); const b = p.geometry.boundingBox; if (b) bounds.union(b.clone().applyMatrix4(p.matrix)); }
    const dimensions = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    const scale = size / Math.max(dimensions.x, dimensions.y, dimensions.z);
    const fit = new THREE.Matrix4().makeScale(scale, scale, scale).multiply(new THREE.Matrix4().makeTranslation(-center.x, -bounds.min.y, -center.z));
    return parts.map(p => ({ ...p, matrix: fit.clone().multiply(p.matrix) }));
  }, [scene, size]);
  return <mesh position={position} rotation={rotation} geometry={geometry} material={bakedMaterial} castShadow receiveShadow {...pickable(onClick)} />;
}

const markers: { corner: Corner; position: Vec; title: string }[] = [
  { corner: 'projects', position: [-1.2, 1.76, -1.7], title: 'Browse projects' },
  { corner: 'studies', position: [-2.4, 2.2, 1.82], title: 'My school history' },
  { corner: 'experience', position: [-1.16, 2.42, -2.12], title: 'My experience' },
  { corner: 'resume', position: [1.25, 1.12, -1.42], title: 'My résumé' },
  { corner: 'achievements', position: [.78, 2.24, -2.12], title: 'My achievements' },
  { corner: 'hobbies', position: [2.1, 1.5, -2.14], title: 'Beyond the screen' },
  { corner: 'about', position: [-.5, 1.12, -1.36], title: 'About me' },
];

const ringGeometry = new THREE.RingGeometry(.1, .115, 40);

/** An expanding ring that invites a click; position in its cycle comes from the wall clock. */
function Pulse({ phase }: { phase: number }) {
  const ring = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, depthWrite: false, opacity: 0, side: THREE.DoubleSide }), []);
  useEffect(() => () => material.dispose(), [material]);
  useFrame(() => {
    const t = (performance.now() / 1000 * .55 + phase) % 1;
    ring.current?.scale.setScalar(1 + t * 1.1);
    material.opacity = .5 * (1 - t) ** 2;
  });
  return <mesh ref={ring} geometry={ringGeometry} material={material} position={[.045, .015, .06]} rotation-y={.65} />;
}

function Markers({ onSelect }: { onSelect: Select }) {
  const c = useSceneColors();
  const invalidate = useThree(st => st.invalidate);
  const geometry = useMerged(() => [
    part(new THREE.SphereGeometry(.1, 16, 12), c.paper),
    box([.045, .015, .085], [.095, .018, .012], c.green, [0, .65, 0]),
    box([.045, .015, .085], [.018, .095, .012], c.green, [0, .65, 0]),
  ], [c]);
  // The scene renders on demand; while the room is idle the pulse keeps it drawing at display rate.
  useFrame(() => { if (!prefersReducedMotion()) invalidate(); });
  return <>{markers.map((m, i) => <group key={m.corner} position={m.position} name={m.title} {...pickable(() => onSelect(m.corner))}>
    <mesh geometry={geometry} material={bakedMaterial} />
    {!prefersReducedMotion() && <Pulse phase={i / markers.length} />}
  </group>)}</>;
}

/** Everything in the room that never moves, as one mesh. */
function roomParts(c: ReturnType<typeof useSceneColors>): Part[] {
  return [
    // A cutaway, open-front cabin: 6 × 5 meters.
    box([0, -.15, 0], [6.2, .3, 5.2], c.wood),
    box([-.1, 1.6, -2.5], [6, 3.2, .17], c.wall),
    box([-3, 1.6, 0], [.17, 3.2, 5], c.wall),
    ...([[-3, 1.65, 2.45], [-3, 1.65, -2.48], [3, 1.65, -2.5]] as Vec[]).map(p => box(p, [.2, 3.35, .2], c['wood-dark'])),
    box([.04, 3.22, -2.5], [6.26, .2, .26], c.wood),
    box([-3, 3.22, 0], [.26, .2, 5.2], c.wood),
    box([0, .2, -2.37], [6, .17, .1], c.wood),
    box([-2.88, .2, 0], [.1, .17, 5], c.wood),
    ...[.65, 1.2, 1.75, 2.3, 2.85].flatMap(y => [box([0, y, -2.405], [5.85, .012, .015], c['wood-light']), box([-2.905, y, 0], [.015, .012, 4.85], c['wood-light'])]),
    // A four-pane window on the left wall.
    box([-2.88, 2.02, -.75], [.08, 1.4, 1.8], c['wood-dark']),
    box([-2.82, 2.02, -.75], [.03, 1.17, 1.56], c.screen),
    box([-2.77, 2.02, -.75], [.1, 1.25, .06], c.paper),
    box([-2.77, 2.02, -.75], [.1, .06, 1.65], c.paper),
    box([-2.7, 1.34, -.75], [.45, .12, 2], c.wood),
    // School shelf on the left wall.
    box([-2.65, 2.18, 1.2], [.65, .12, 1.7], c.wood),
    box([-2.78, 1.98, .65], [.3, .35, .08], c['wood-dark']),
    box([-2.78, 1.98, 1.75], [.3, .35, .08], c['wood-dark']),
    // Cabinet that carries the printer.
    box([1.25, .55, -1.78], [1.1, 1.05, .8], c.wood),
    // A computer mouse beside the keyboard.
    part(new THREE.SphereGeometry(.055, 20, 14), c['wood-dark'], [-.73, 1.425, -1.26], undefined, [.8, .55, 1.3]),
    box([-.73, 1.457, -1.31], [.012, .012, .04], c.paper),
  ];
}

function Room({ onSelect }: { onSelect: Select }) {
  const c = useSceneColors();
  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = c['wood-light']; ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 ? c.wood : c['wood-light']; ctx.fillRect(i * 64, 0, 63, 512);
        ctx.strokeStyle = c['wood-dark']; ctx.globalAlpha = .22; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(i * 64, 0); ctx.lineTo(i * 64, 512); ctx.stroke();
        for (let n = 0; n < 9; n++) { ctx.globalAlpha = .04; ctx.beginPath(); ctx.moveTo(i * 64 + n * 7, 0); ctx.bezierCurveTo(i * 64 + n * 7 + 9, 180, i * 64 + n * 7 - 6, 320, i * 64 + n * 7, 512); ctx.stroke(); }
        ctx.globalAlpha = .2; ctx.fillRect(i * 64, (i % 3) * 170, 64, 1); ctx.globalAlpha = 1;
      }
    }
    const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [c]);
  useEffect(() => () => woodTexture.dispose(), [woodTexture]);
  const shell = useMerged(() => roomParts(c), [c]);
  return <group position={[0, -.4, 0]}>
    <mesh geometry={shell} material={bakedMaterial} castShadow receiveShadow />
    <mesh position={[0, .015, 0]} receiveShadow><boxGeometry args={[6, .04, 5]} /><meshStandardMaterial map={woodTexture} roughness={.87} /></mesh>
    <mesh position={[.35, .062, .5]} rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[2.4, 1.75]} /><meshStandardMaterial color={c.rug} roughness={1} metalness={0} /></mesh>
    {/* Hobby gear, grouped along the back wall: board and rod lean on it, the racket leans on the bag. */}
    <Surfboard position={[2.1, .05, -2.06]} rotation={[-surfboardLean, 0, 0]} onClick={() => onSelect('hobbies', 1)} />
    <FishingRod position={[2.65, .05, -2.0]} lean={.18} onClick={() => onSelect('hobbies', 2)} />
    <SportsBag position={[2.4, .05, -1.65]} onClick={() => onSelect('hobbies', 0)} />
    <Racket position={[2.25, .05, -.985]} rotation={[-.885, 0, 0]} onClick={() => onSelect('hobbies', 0)} />
    <Suspense fallback={null}>
      <Prop url={deskUrl} position={[-1.05, .05, -1.7]} size={2.55} />
      <Prop url={screenUrl} position={[-1.2, 1.4, -1.82]} size={.85} onClick={() => onSelect('projects')} />
      <Prop url={keyboardUrl} position={[-1.2, 1.41, -1.27]} size={.65} onClick={() => onSelect('projects')} />
      <Prop url={chairUrl} position={[-1.06, .05, -.5]} size={1.8} rotation={[0, Math.PI - .38, 0]} />
      <Prop url={plantUrl} position={[-2.03, 1.41, -1.85]} size={.45} />
      <Prop url={booksUrl} position={[-2.65, 2.25, 1.2]} size={.8} rotation={[0, Math.PI / 2, 0]} onClick={() => onSelect('studies')} />
      <Prop url={tallPlantUrl} position={[-2.2, .05, 1.75]} size={1.3} />
      <RefreshShadows />
    </Suspense>
  </group>;
}

/** Soft top light for reflections: one bright panel overhead, rendered to an environment map once. */
function StudioEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const studio = new THREE.Scene();
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 1.5, 1.5), side: THREE.DoubleSide, toneMapped: false }));
    panel.position.set(0, 5, 0); panel.rotation.x = -Math.PI / 2;
    studio.add(panel);
    const env = pmrem.fromScene(studio, 0, .1, 100).texture;
    scene.environment = env;
    invalidate();
    return () => { scene.environment = null; env.dispose(); pmrem.dispose(); panel.geometry.dispose(); panel.material.dispose(); };
  }, [gl, scene, invalidate]);
  return null;
}

type Anim = { key: string; t: number; from: CameraPose; zoomOnly: boolean };

/** Single clock for camera framing and object motion; reports when everything has come to rest. */
function Director({ active, detail, zoom, motion, portal, onSettled }: { active: Corner | null; detail: number | null; zoom: number; motion: Motion; portal: RefObject<HTMLDivElement | null>; onSettled: (corner: Corner | null) => void }) {
  const { camera, size, invalidate, gl } = useThree();
  const look = useRef(new THREE.Vector3(...rig.roomLook));
  const anim = useRef<Anim | null>(null);
  const settled = useRef<string | null>(null);
  const lastSize = useRef('');
  const key = `${active ?? 'room'}|${detail ?? 'all'}|${zoom}`;
  useEffect(() => { invalidate(); }, [key, size.width, size.height, invalidate]);
  useFrame((_, rawDelta) => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    const reduce = prefersReducedMotion();
    const dt = Math.min(rawDelta, .05);
    let moving = false;
    for (const corner of CORNERS) {
      const target = active === corner ? 1 : 0;
      const current = motion.progress[corner];
      if (current === target) continue;
      const duration = motionDurations[corner];
      motion.progress[corner] = reduce || !duration ? target : current < target ? Math.min(target, current + dt / duration) : Math.max(target, current - dt / duration);
      moving = true;
      // Objects moved this frame, so their shadows must be redrawn; the camera alone never needs it.
      gl.shadowMap.needsUpdate = true;
    }
    if (anim.current?.key !== key) {
      const previous = anim.current?.key.split('|')[0];
      const zoomOnly = !active && !!anim.current?.key.startsWith('room|');
      anim.current = { key, t: 0, zoomOnly, from: { position: camera.position.clone(), look: look.current.clone(), up: camera.up.clone(), zoom: camera.zoom } };
      settled.current = null;
      // While the camera moves, readable HTML is hidden and the matching 3D textures carry the view,
      // except when it only zooms within a still object whose pages stay readable (the books).
      const zoomWithin = !!active && previous === active && !!readingObjects[active].liveZoom;
      if (!zoomWithin) portal.current?.classList.add('is-moving');
    }
    const a = anim.current;
    const sizeKey = `${size.width}x${size.height}`;
    const resized = lastSize.current !== sizeKey;
    lastSize.current = sizeKey;
    if (a.t < 1 || resized) {
      const target = active ? cameraView(active, detail, size) : roomView(size, zoom);
      const zoomOnly = a.zoomOnly || (!active && a.t >= 1);
      const from = a.t < 1 ? a.from : { position: camera.position.clone(), look: look.current.clone(), up: camera.up.clone(), zoom: camera.zoom };
      a.t = reduce ? 1 : Math.min(1, a.t + dt / cameraDuration);
      const e = a.t >= 1 ? 1 : easeInOut(a.t);
      if (!zoomOnly) {
        camera.position.lerpVectors(from.position, target.position, e);
        look.current.lerpVectors(from.look, target.look, e);
        camera.up.lerpVectors(from.up, target.up, e).normalize();
        camera.lookAt(look.current);
      }
      camera.zoom = from.zoom * Math.pow(target.zoom / from.zoom, e);
      camera.updateProjectionMatrix();
      moving = true;
    }
    if (moving) invalidate();
    else if (settled.current !== key) { settled.current = key; portal.current?.classList.remove('is-moving'); onSettled(active); }
  });
  return null;
}

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const update = () => setNarrow(isNarrow(window.innerWidth, window.innerHeight));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return narrow;
}

export function CabinScene({ active, onSelect, onClose }: { active: Corner | null; onSelect: (corner: Corner) => void; onClose: () => void }) {
  const [reset, setReset] = useState(0);
  const [zoom, setZoom] = useState(1.12);
  const narrow = useNarrow();
  const [view, setView] = useState<{ corner: Corner | null; detail: number | null }>({ corner: null, detail: null });
  const [readyCorner, setReadyCorner] = useState<Corner | null>(null);
  const [orbitReady, setOrbitReady] = useState(false);
  const [shownActive, setShownActive] = useState(active);
  // School book chapter, chosen in the reading controls; the book opens on the first one.
  const [chapter, setChapter] = useState(0);
  if (shownActive !== active) {
    // Selection changed: content waits for the new motion to settle, orbiting waits for the room.
    setShownActive(active);
    setChapter(0);
    setReadyCorner(null);
    if (active) setOrbitReady(false);
    if (view.corner !== active) setView({ corner: null, detail: null });
  }
  const detail = view.corner === active ? view.detail : defaultDetail(active, narrow);
  const ready = active !== null && readyCorner === active;
  const motion = useRef<Motion>({ progress: Object.fromEntries(CORNERS.map(c => [c, 0])) as Record<Corner, number> }).current;
  const container = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const select = useCallback<Select>((corner, d) => { setView({ corner, detail: d ?? defaultDetail(corner, narrow) }); onSelect(corner); }, [narrow, onSelect]);
  const setDetail = useCallback((d: number | null) => setView({ corner: active, detail: d }), [active]);
  const settle = useCallback((corner: Corner | null) => { if (corner) setReadyCorner(corner); else setOrbitReady(true); }, []);

  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [onClose]);
  useEffect(() => {
    document.body.style.cursor = 'auto';
    if (active) {
      if (!opener.current) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const html = document.documentElement, previous = html.style.overflow;
      html.style.overflow = 'hidden';
      return () => { html.style.overflow = previous; };
    }
    const el = opener.current;
    opener.current = null;
    if (el && document.contains(el)) el.focus({ preventScroll: true });
    return undefined;
  }, [active]);

  return <div className={`scene-wrap ${active ? 'scene-reading' : ''}`} ref={container} role="group" aria-label="David’s interactive miniature cabin">
    <Canvas key={reset} orthographic shadows="percentage" frameloop="demand" dpr={[1, 1.75]} camera={{ position: rig.room, zoom: 65, near: .1, far: 80 }} gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.shadowMap.autoUpdate = false; gl.shadowMap.needsUpdate = true; }}>
      <Director active={active} detail={detail} zoom={zoom} motion={motion} portal={portal} onSettled={settle} />
      <ambientLight intensity={.75} />
      <directionalLight position={[-3, 8, 5]} intensity={2.3} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-.001} />
      <StudioEnvironment />
      <Room onSelect={select} />
      <ReadingObjects active={active} ready={ready} detail={detail} chapter={chapter} motion={motion} portal={portal} onSelect={select} onDetail={setDetail} />
      {!active && <Markers onSelect={select} />}
      {!active && orbitReady && <OrbitControls makeDefault target={rig.roomLook} enablePan={false} enableDamping minPolarAngle={.55} maxPolarAngle={1.3} minAzimuthAngle={-.25} maxAzimuthAngle={1.25} minZoom={35} maxZoom={160} />}
    </Canvas>
    <div className="surface-portal" ref={portal} />
    <SceneOverlay active={active} ready={ready} narrow={narrow} detail={detail} chapter={chapter} onChapter={setChapter} onDetail={setDetail} onClose={onClose}
      onZoom={step => setZoom(v => Math.min(1.6, Math.max(.7, v + step * .15)))}
      onReset={() => { setZoom(1.12); setOrbitReady(false); setReset(v => v + 1); }}
      onFullscreen={() => { if (document.fullscreenElement) void document.exitFullscreen(); else void container.current?.requestFullscreen(); }} />
  </div>;
}
