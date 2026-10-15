/*
 * Achievement board layout in board pixels. Kept free of Three.js so the DOM board can use it
 * without pulling the 3D engine into the page's first load.
 */
export type BoardItem = { x: number; y: number; w: number; h: number; angle: number };
export const boardNote: BoardItem = { x: 272, y: 88, w: 440, h: 112, angle: -1 };
export const boardCards: BoardItem[] = [
  { x: 412, y: 416, w: 320, h: 440, angle: -2.5 },
  { x: 788, y: 406, w: 320, h: 440, angle: 2 },
];
