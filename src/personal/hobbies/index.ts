/**
 * The gear and its tags. Order matters: [0] is the tennis bag and racket, [1] the surfboard,
 * [2] the fishing rod. Rewrite the titles and notes to whatever you actually do.
 */
/** Small line at the foot of every tag. */
export const tagNote = 'Life beyond the screen.';

export type Hobby = { id: 'tennis' | 'surfing' | 'fishing'; title: string; text: string };
export const hobbies: readonly [Hobby, Hobby, Hobby] = [
  { id: 'tennis', title: 'Gym & growth', text: 'One session at a time. Building strength, better habits, and a little more patience with myself.' },
  { id: 'surfing', title: 'Beach & nature', text: 'Sea air, open skies, and a walk without checking the time.' },
  { id: 'fishing', title: 'Home in Maragota', text: 'Leaving Lisbon’s rush behind. Familiar places, good company, and space to slow down.' },
];
