/**
 * The gear and its tags. Order matters: [0] is the tennis bag and racket, [1] the surfboard,
 * [2] the fishing rod. Rewrite the titles and notes to whatever you actually do.
 */
/** Small line at the foot of every tag. */
export const tagNote = 'Sample hobby note';

export type Hobby = { id: 'tennis' | 'surfing' | 'fishing'; title: string; text: string };
export const hobbies: readonly [Hobby, Hobby, Hobby] = [
  { id: 'tennis', title: 'Tennis & training', text: 'A good rally. A little discipline. A fresh start.' },
  { id: 'surfing', title: 'Surfing', text: 'Saltwater, patience, and chasing the next wave.' },
  { id: 'fishing', title: 'Fishing', text: 'Slowing down and seeing what the day brings.' },
];
