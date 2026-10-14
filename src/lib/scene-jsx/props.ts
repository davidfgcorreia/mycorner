import type { ElementType } from 'react';
import * as THREE from 'three';

// Preview tracking attributes are DOM metadata, not Three.js dashed property paths.
export function sceneProps(type: ElementType | string, props: unknown): unknown {
  if (!props || typeof props !== 'object') return props;
  if (typeof type === 'string') {
    const constructorName = type.charAt(0).toUpperCase() + type.slice(1);
    if (type !== 'primitive' && !(constructorName in THREE)) return props;
  }
  // Drei components such as Html forward remaining props to an internal group.
  // Clean component boundaries too: their descendants use their own JSX runtime.
  return Object.fromEntries(Object.entries(props).filter(([name]) => !name.startsWith('data-') && !name.startsWith('aria-')));
}