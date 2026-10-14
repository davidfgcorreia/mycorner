import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { applyProps } from '@react-three/fiber';
import { sceneProps } from '@/lib/scene-jsx/props';

describe('Scene preview metadata isolation', () => {
  it('removes tracking metadata from every Three intrinsic, including update props', () => {
    for (const type of ['group', 'mesh', 'primitive', 'boxGeometry', 'meshStandardMaterial', 'ambientLight']) {
      expect(sceneProps(type, { 'data-tsd-source': 'source:1', 'aria-label': 'label', visible: true })).toEqual({ visible: true });
    }
    const mesh = new THREE.Mesh();
    expect(() => applyProps(mesh, sceneProps('mesh', { 'data-tsd-source': 'source:2', 'rotation-y': 1 }) as Record<string, unknown>)).not.toThrow();
    expect(mesh.rotation.y).toBe(1);
  });
  it('keeps DOM metadata and legitimate dashed scene properties', () => {
    const props = { 'data-tsd-source': 'source:1', 'aria-label': 'Cabin' };
    expect(sceneProps('div', props)).toBe(props);
    expect(sceneProps(() => null, props)).toEqual({});
    expect(sceneProps('directionalLight', { 'shadow-camera-left': -6, 'data-tsd-source': 'source:3' })).toEqual({ 'shadow-camera-left': -6 });
  });
  it('protects props forwarded by Drei components during updates', () => {
    const ForwardingComponent = () => null;
    const group = new THREE.Group();
    for (const source of ['first:1', 'updated:2']) {
      const props = sceneProps(ForwardingComponent, { 'data-tsd-source': source, 'position-x': 2 });
      expect(() => applyProps(group, props as Record<string, unknown>)).not.toThrow();
      expect(group.position.x).toBe(2);
    }
  });
});