import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Vec } from '@/lib/reading-surfaces';

/*
 * Static scenery is built from many small primitives. Drawing each as its own mesh costs a
 * draw call (twice, with shadows), so parts are baked into one vertex-coloured geometry.
 */
export type Part = { geometry: THREE.BufferGeometry; color: string; matrix: THREE.Matrix4 };

const matrix = (position: Vec, rotation: Vec = [0, 0, 0], scale: Vec = [1, 1, 1]) =>
  new THREE.Matrix4().compose(new THREE.Vector3(...position), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)), new THREE.Vector3(...scale));

export const part = (geometry: THREE.BufferGeometry, color: string, position: Vec = [0, 0, 0], rotation?: Vec, scale?: Vec): Part =>
  ({ geometry, color, matrix: matrix(position, rotation, scale) });

export const box = (position: Vec, size: Vec, color: string, rotation?: Vec): Part =>
  part(new THREE.BoxGeometry(...size), color, position, rotation);

/** Moves parts into a parent frame, like wrapping them in a <group>. */
export const within = (parts: Part[], position: Vec, rotation?: Vec): Part[] => {
  const parent = matrix(position, rotation);
  return parts.map(p => ({ ...p, matrix: parent.clone().multiply(p.matrix) }));
};

export function mergeParts(parts: Part[]): THREE.BufferGeometry {
  const color = new THREE.Color();
  const baked = parts.map(p => {
    const g = p.geometry.index ? p.geometry.toNonIndexed() : p.geometry.clone();
    for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal') g.deleteAttribute(name);
    g.applyMatrix4(p.matrix);
    color.setStyle(p.color, THREE.SRGBColorSpace);
    const count = g.attributes['position']?.count ?? 0;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) colors.set([color.r, color.g, color.b], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    p.geometry.dispose();
    return g;
  });
  const merged = mergeGeometries(baked) ?? new THREE.BufferGeometry();
  baked.forEach(g => g.dispose());
  return merged;
}

/** One shared material for every baked geometry. */
export const bakedMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .7 });

export function useMerged(build: () => Part[], deps: unknown[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const geometry = useMemo(() => mergeParts(build()), deps);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}
