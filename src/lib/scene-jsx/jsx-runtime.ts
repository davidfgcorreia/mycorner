import { jsx as reactJsx, jsxs as reactJsxs } from 'react/jsx-runtime';
import { sceneProps } from './props';
export { Fragment } from 'react/jsx-runtime';
export type { JSX } from 'react/jsx-runtime';

export const jsx: typeof reactJsx = (type, props, key) => reactJsx(type, sceneProps(type, props), key);
export const jsxs: typeof reactJsxs = (type, props, key) => reactJsxs(type, sceneProps(type, props), key);