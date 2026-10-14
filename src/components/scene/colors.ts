import { useMemo } from 'react';

const names = ['wood', 'wood-light', 'wood-dark', 'wall', 'cork', 'paper', 'green', 'orange', 'red', 'bag', 'metal', 'screen', 'screen-off', 'ink', 'rug', 'text', 'text-muted'] as const;
export type SceneColors = Record<(typeof names)[number], string>;

let cache: SceneColors | null = null;

/** Resolves the --scene-* design tokens to sRGB strings Three.js and canvas textures understand. */
export function sceneColors(): SceneColors {
  if (cache) return cache;
  const css = getComputedStyle(document.documentElement);
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const read = (name: string) => {
    if (!ctx) return 'gray';
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = 'gray';
    ctx.fillStyle = css.getPropertyValue(`--scene-${name}`).trim();
    ctx.fillRect(0, 0, 1, 1);
    const p = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${p[0]},${p[1]},${p[2]})`;
  };
  cache = Object.fromEntries(names.map(name => [name, read(name)])) as SceneColors;
  return cache;
}

export const useSceneColors = () => useMemo(sceneColors, []);
