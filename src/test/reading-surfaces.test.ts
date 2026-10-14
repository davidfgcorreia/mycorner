import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import type { Corner } from '@/lib/portfolio';
import { board, boardCards, boardNote, boardRect, bookPose, cameraView, defaultDetail, detailCount, frameView, notebook, notebookHinge, primaryFace, printer, readingObjects, rectCorners, schoolBook, sheet, sheetPose } from '@/lib/reading-surfaces';

const corners = Object.keys(readingObjects) as Corner[];
const v = (a: number[]) => new THREE.Vector3(...a);

describe('reading surfaces', () => {
  it('describes every readable face with matching physical and pixel proportions', () => {
    for (const corner of corners) for (const face of readingObjects[corner].faces) {
      expect(face.width / face.height).toBeCloseTo(face.pixels[0] / face.pixels[1], 2);
    }
  });

  it('frames every object, close-up and narrow layout with a finite, non-empty view', () => {
    for (const corner of corners) for (const narrow of [false, true]) {
      for (const detail of [null, ...Array.from({ length: detailCount(corner) }, (_, i) => i)]) {
        const f = frameView(corner, detail, narrow);
        expect(f.width).toBeGreaterThan(.05);
        expect(f.height).toBeGreaterThan(.05);
        expect(Number.isFinite(f.center.x + f.center.y + f.center.z)).toBe(true);
      }
    }
  });

  it('keeps reading text at a comfortable on-screen scale on a laptop and a phone', () => {
    for (const size of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
      const narrow = size.width < 700;
      for (const corner of corners) {
        const detail = defaultDetail(corner, narrow);
        const view = cameraView(corner, detail, size);
        const face = primaryFace(corner, corner === 'hobbies' ? detail ?? 0 : 0);
        const cssScale = face.width * view.zoom / face.pixels[0];
        // Desktop surfaces render near their design size; phones get larger surface type (CSS) at lower scale.
        expect(cssScale).toBeGreaterThan(narrow ? .28 : .55);
      }
    }
  });

  it('opens the résumé exactly on the sheet the camera frames', () => {
    const open = sheetPose(1), face = primaryFace('resume');
    expect(open.position).toEqual(face.position);
    expect(open.rotation).toEqual(face.rotation);
  });

  it('feeds the résumé out of the slot without passing through the printer body', () => {
    const { width, height, depth } = printer.body;
    for (let i = 0; i <= 100; i++) {
      const pose = sheetPose(i / 100);
      const up = v([0, 1, 0]).applyEuler(new THREE.Euler(...pose.rotation));
      for (let k = 0; k <= 20; k++) {
        const p = v(pose.position).addScaledVector(up, (k / 20 - .5) * sheet.height);
        const inside = Math.abs(p.x) < width / 2 && p.y > 0 && p.y < height + .04 && p.z > -depth / 2 && p.z < printer.slot[2];
        // Inside the shell the paper may only run through the output slot.
        if (inside) expect(p.y > .035 && p.y < .125).toBe(true);
      }
    }
    const rest = sheetPose(0);
    const up = v([0, 1, 0]).applyEuler(new THREE.Euler(...rest.rotation));
    const bottom = v(rest.position).addScaledVector(up, -sheet.height / 2);
    expect(bottom.y).toBeGreaterThanOrEqual(printer.trayTop);
    expect(bottom.y).toBeLessThan(printer.trayTop + .01);
    expect(bottom.z).toBeGreaterThan(.24);
    expect(bottom.z).toBeLessThan(.56);
  });

  it('starts the school book closed on the shelf and finishes open where it is read', () => {
    const start = bookPose(0), end = bookPose(1);
    expect(start.position).toEqual(schoolBook.shelf.position);
    expect(start.hinge).toBeCloseTo(Math.PI);
    expect(end.position).toEqual(readingObjects.studies.placement.position);
    expect(end.rotation).toEqual(readingObjects.studies.placement.rotation);
    expect(end.hinge).toBe(0);
    const { page, height, overhang } = schoolBook.size;
    const pagesEnd = start.position[0] - (page + overhang);
    expect(pagesEnd).toBeGreaterThan(-2.915);
    expect(start.position[1] - height / 2 - overhang).toBeGreaterThanOrEqual(1.84);
  });

  it('opens the notebook flat on the desk, clear of the keyboard and inside the desk top', () => {
    expect(notebookHinge(0)).toBeCloseTo(Math.PI);
    expect(notebookHinge(1)).toBe(0);
    for (const p of rectCorners(notebook.placement, primaryFace('about'))) {
      expect(p.x).toBeGreaterThan(-.875);
      expect(p.x).toBeLessThan(.225);
      expect(p.z).toBeGreaterThan(-1.7);
      expect(p.z).toBeLessThan(-1.019);
      expect(p.y).toBeCloseTo(.999, 2);
    }
  });

  it('keeps the pinned photos and note inside the cork board', () => {
    for (const item of [boardNote, ...boardCards]) {
      for (const p of rectCorners({ position: [0, 0, 0], rotation: [0, 0, 0] }, boardRect(item))) {
        expect(Math.abs(p.x)).toBeLessThan(board.width / 2);
        expect(Math.abs(p.y)).toBeLessThan(board.height / 2);
      }
    }
  });
});
