import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { tag } from '@/lib/reading-surfaces';
import { achievementBoard, experience, tagNote, type Achievement, type Hobby } from '@/personal';
import { journalEntry, journalLayout } from '@/lib/journal-layout';
import type { SceneColors } from './colors';

/*
 * Room-view marks: abstract versions of each surface's real layout. Surfaces you can step
 * between up close (board cards, hobby tags) carry their real text instead, laid out with the
 * same numbers as the CSS, so the camera can move over the texture while the HTML is hidden.
 * Coordinates are in the same design pixels as the HTML that replaces them up close.
 */
type Ctx = CanvasRenderingContext2D;
type Bar = [x: number, y: number, w: number, h: number, alpha?: number];
export type Draw = (ctx: Ctx, width: number, height: number, c: SceneColors) => void;

export function canvasTexture(width: number, height: number, draw: (ctx: Ctx) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Paper faces glow slightly so the lit room marks match the brightness of the readable paper. */
export function paperMaterial(map: THREE.Texture, c: SceneColors, extra: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ map, emissive: new THREE.Color(c.paper), emissiveMap: map, emissiveIntensity: .5, roughness: .9, ...extra });
}

/** Typefaces for real text, matching the `--font-*` tokens in styles.css. */
export const faces = { sans: '"DM Sans", sans-serif', typed: '"Courier Prime", monospace', marker: 'Kalam, cursive', label: '"Patrick Hand", cursive' };
const fonts = ['400 18px "DM Sans"', '500 22px "DM Sans"', '400 15px "Courier Prime"', '700 19px "Courier Prime"', '400 17px Kalam', '700 22px Kalam', '400 26px "Patrick Hand"'];

export function useCanvasTexture(width: number, height: number, draw: Draw, colors: SceneColors) {
  const invalidate = useThree(st => st.invalidate);
  const texture = useMemo(() => canvasTexture(width, height, ctx => draw(ctx, width, height, colors)), [width, height, draw, colors]);
  useEffect(() => {
    let live = true;
    // Text drawn before the web font arrives uses a fallback face; draw again once it is ready.
    if (!fonts.every(f => document.fonts.check(f))) {
      void Promise.all(fonts.map(f => document.fonts.load(f))).then(() => {
        const ctx = (texture.image as HTMLCanvasElement).getContext('2d');
        if (!live || !ctx) return;
        ctx.clearRect(0, 0, width, height);
        draw(ctx, width, height, colors);
        texture.needsUpdate = true;
        invalidate();
      });
    }
    return () => { live = false; texture.dispose(); };
  }, [texture, width, height, draw, colors, invalidate]);
  return texture;
}

/** Breaks text into lines at word boundaries, as the browser does for the same font and width. */
function wrap(ctx: Ctx, value: string, maxWidth: number, size: number, weight: number, scale: number, face: string) {
  ctx.font = `${weight} ${size * scale}px ${face}`;
  const lines: string[] = [];
  let line = '';
  for (const word of value.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth * scale) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Writes wrapped text like a CSS block: `top` is the top of the first line box. Returns the height used. */
function text(ctx: Ctx, value: string, x: number, top: number, maxWidth: number, size: number, lineHeight: number, weight: number, color: string, scale: number, face = faces.sans) {
  ctx.save();
  const lines = wrap(ctx, value, maxWidth, size, weight, scale, face);
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, x * scale, (top + lineHeight * i + lineHeight / 2) * scale));
  ctx.restore();
  return lines.length * lineHeight;
}

function tagOutline(ctx: Ctx, w: number, h: number, c: SceneColors) {
  const s = w / tag.pixels[0];
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.moveTo(.14 * w, 0); ctx.lineTo(w, 0); ctx.lineTo(w, h); ctx.lineTo(.14 * w, h); ctx.lineTo(0, .72 * h); ctx.lineTo(0, .28 * h); ctx.closePath();
  ctx.fillStyle = c.paper; ctx.fill();
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.arc(tag.hole[0] * s, tag.hole[1] * s, tag.holeRadius * s, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/** Mirrors `.tag-surface` in Patrick Hand: padding 46/40/28/96, title 40/1.1, note 26/1.4, foot 18px at the bottom. */
export const drawHobbyTag = (hobby: Hobby): Draw => (ctx, w, h, c) => {
  const s = w / tag.pixels[0];
  tagOutline(ctx, w, h, c);
  const width = tag.pixels[0] - 96 - 40;
  const title = text(ctx, hobby.title, 96, 46, width, 40, 44, 400, c.text, s, faces.label);
  text(ctx, hobby.text, 96, 46 + title + 12, width, 26, 36.4, 400, c['text-muted'], s, faces.label);
  text(ctx, tagNote, 96, tag.pixels[1] - 28 - 22, width, 18, 22, 400, c['text-muted'], s, faces.label);
};

/** Mirrors `.board-card` in Kalam: 320 × 440, padding 16, photo 288 × 192, title 22/28 bold, caption 17/24, foot 14px. */
export const drawAchievementCard = (a: Achievement): Draw => (ctx, w, h, c) => {
  const s = w / 320;
  paper(ctx, w, h, c);
  const title = text(ctx, a.title, 16, 16 + 192 + 18, 288, 22, 28, 700, c.text, s, faces.marker);
  text(ctx, a.description, 16, 16 + 192 + 18 + title + 10, 288, 17, 24, 400, c['text-muted'], s, faces.marker);
  text(ctx, a.note, 16, 440 - 26 - 17, 288, 14, 17, 400, c['text-muted'], s, faces.marker);
};

/** Mirrors `.board-note` in Kalam: 440 × 112, padding 18/26, centred column of a bold 34/1.1 title and a 16px note. */
export const drawBoardNote: Draw = (ctx, w, h, c) => {
  const s = w / 440;
  paper(ctx, w, h, c);
  const titleLines = wrap(ctx, achievementBoard.title, 388, 34, 700, s, faces.marker).length;
  const top = (112 - (titleLines * 37.4 + 6 + 19)) / 2;
  const title = text(ctx, achievementBoard.title, 26, top, 388, 34, 37.4, 700, c.text, s, faces.marker);
  text(ctx, achievementBoard.note, 26, top + title + 6, 388, 16, 19, 400, c['text-muted'], s, faces.marker);
};

function bars(ctx: Ctx, color: string, marks: Bar[], scale: number) {
  ctx.save();
  ctx.fillStyle = color;
  for (const [x, y, w, h, alpha = 1] of marks) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.roundRect(x * scale, y * scale, w * scale, h * scale, (h * scale) / 2);
    ctx.fill();
  }
  ctx.restore();
}
function rules(ctx: Ctx, color: string, x: number, from: number, to: number, step: number, width: number, scale: number) {
  const lines: Bar[] = [];
  for (let y = from; y <= to; y += step) lines.push([x, y, width, 1.5, .12]);
  bars(ctx, color, lines, scale);
}
function paper(ctx: Ctx, w: number, h: number, c: SceneColors) { ctx.fillStyle = c.paper; ctx.fillRect(0, 0, w, h); }

/** Abstract print marks laid out like `.resume-sheet`: heading block, then five sections with their lines. */
export const drawResume: Draw = (ctx, w, h, c) => {
  const s = w / 600;
  paper(ctx, w, h, c);
  bars(ctx, c.ink, [[48, 50, 130, 8, .4], [48, 76, 280, 30, .85], [48, 122, 440, 7, .3], [48, 141, 300, 7, .3]], s);
  // [heading y, body lines, rule above]
  const sections: [number, number[], number][] = [[186, [500, 470], 166], [288, [460, 380, 400], 268], [433, [480, 470, 220], 413], [577, [330, 360], 557], [681, [470, 260], 661]];
  for (const [y, lines, rule] of sections) {
    bars(ctx, c.ink, [[48, rule, 504, 1.5, .16]], s);
    bars(ctx, c.green, [[48, y, 110, 13, .8]], s);
    bars(ctx, c.ink, lines.map((width, i): Bar => [48, y + 30 + i * 22, width, 9, .35]), s);
  }
  bars(ctx, c.ink, [[48, 796, 240, 8, .3]], s);
};

/** Mirrors `.journal-surface` in Courier Prime: a timeline rule with one dot per entry, meta 14/19, title 19/25, summary 15/20. */
export const drawJournal: Draw = (ctx, w, h, c) => {
  const s = w / 610;
  paper(ctx, w, h, c);
  // The readable face begins 80 pixels below the full paper's top, clear of its clip.
  const offset = 80;
  const [padY, padX] = journalLayout.padding;
  text(ctx, 'WORK JOURNAL', 30, offset + 22, 550, 12, 16, 400, c['text-muted'], s, faces.typed);
  text(ctx, 'Experience', 30, offset + 42, 550, 28, 32, 700, c.text, s, faces.typed);
  ctx.fillStyle = c['text-muted'];
  ctx.globalAlpha = .25;
  ctx.fillRect((journalLayout.dotX - 1) * s, (offset + 86) * s, 2 * s, (journalLayout.height - 86 - 26) * s);
  ctx.globalAlpha = 1;
  experience.forEach((job, i) => {
    const card = journalEntry(i);
    const x = card.x + padX + 1;
    const y = card.y + offset + padY + 1;
    const width = card.width - 2 * padX - 2;
    ctx.fillStyle = c.paper;
    ctx.fillRect(card.x * s, (card.y + offset) * s, card.width * s, card.height * s);
    ctx.strokeStyle = c['text-muted'];
    ctx.globalAlpha = .2;
    ctx.strokeRect(card.x * s, (card.y + offset) * s, card.width * s, card.height * s);
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.green;
    ctx.beginPath(); ctx.arc(journalLayout.dotX * s, (card.y + offset + 22) * s, 6 * s, 0, Math.PI * 2); ctx.fill();
    text(ctx, `${job.period}${job.organization ? ` · ${job.organization}` : ''}`, x, y, width, 14, 19, 400, c.green, s, faces.typed);
    const titleHeight = text(ctx, job.title, x, y + 21, width, 19, 25, 700, c.text, s, faces.typed);
    text(ctx, job.summary, x, y + 24 + titleHeight, width, 15, 20, 400, c['text-muted'], s, faces.typed);
  });
};

export const drawBookIndex: Draw = (ctx, w, h, c) => {
  const s = w / 600;
  paper(ctx, w, h, c);
  bars(ctx, c.green, [[52, 56, 30, 30, .7]], s);
  bars(ctx, c.ink, [[52, 118, 150, 10, .45], [52, 156, 180, 42, .85], [52, 212, 200, 42, .85]], s);
  for (let i = 0; i < 3; i++) {
    const y = 318 + i * 64;
    bars(ctx, c.ink, [[52, y - 20, 496, 2, .14], [100, y, 230 - i * 20, 14, .45]], s);
    bars(ctx, c.green, [[62, y + 2, 24, 10, .7]], s);
  }
  bars(ctx, c.ink, [[52, 790, 140, 10, .35]], s);
};

export const drawBookText: Draw = (ctx, w, h, c) => {
  const s = w / 600;
  paper(ctx, w, h, c);
  bars(ctx, c.green, [[52, 62, 120, 10, .6]], s);
  bars(ctx, c.ink, [[52, 100, 340, 42, .85], [52, 182, 470, 15, .4], [52, 224, 300, 15, .4]], s);
  rules(ctx, c.ink, 52, 300, 780, 42, 496, s);
};

export const drawNotebookLeft: Draw = (ctx, w, h, c) => {
  const s = w / 525;
  paper(ctx, w, h, c);
  bars(ctx, c.green, [[46, 50, 84, 40, .9]], s);
  bars(ctx, c.ink, [[46, 124, 230, 42, .85], [46, 630, 150, 10, .3]], s);
};

export const drawNotebookRight: Draw = (ctx, w, h, c) => {
  const s = w / 525;
  paper(ctx, w, h, c);
  bars(ctx, c.ink, [[46, 56, 300, 36, .85], [46, 124, 410, 14, .4], [46, 164, 340, 14, .4], [46, 204, 200, 14, .4]], s);
  rules(ctx, c.ink, 46, 280, 600, 40, 433, s);
  bars(ctx, c.ink, [[46, 630, 300, 10, .3]], s);
};

export const drawCoverLabel: Draw = (ctx, w, h, c) => {
  const s = w / 256;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = c.paper;
  ctx.beginPath(); ctx.roundRect(0, 0, w, h, 10 * s); ctx.fill();
  bars(ctx, c.ink, [[26, 36, 170, 22, .8], [26, 76, 110, 12, .45]], s);
};

export const drawCork: Draw = (ctx, w, h, c) => {
  ctx.fillStyle = c.cork; ctx.fillRect(0, 0, w, h);
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 1400; i++) {
    ctx.globalAlpha = .1 + rand() * .16;
    ctx.fillStyle = rand() > .5 ? c['wood-dark'] : c['wood-light'];
    const size = 1 + rand() * 3;
    ctx.fillRect(rand() * w, rand() * h, size, size);
  }
  ctx.globalAlpha = 1;
};
