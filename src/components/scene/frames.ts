import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/*
 * The scene renders on demand and its shadow map is drawn only when something that casts
 * shadows changes (the room never moves; only the book, notebook and résumé sheet animate).
 */
const reducedMotion = typeof window === 'undefined' ? null : window.matchMedia('(prefers-reduced-motion: reduce)');
export const prefersReducedMotion = () => reducedMotion?.matches ?? false;

/** Mount inside a Suspense boundary: redraws shadows once its content has loaded. */
export function RefreshShadows() {
  const { gl, invalidate } = useThree();
  useEffect(() => { gl.shadowMap.needsUpdate = true; invalidate(); }, [gl, invalidate]);
  return null;
}
