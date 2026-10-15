/**
 * The photo board. Drop photos into ./images and import them here (3:2, WebP around 864 px wide keeps it light).
 * The board holds two photos; their places are in `src/lib/board-layout.ts`.
 */
import hackTheCity from './images/hackcity-podium.webp';
import junctionLisbon from './images/junction-lisbon.webp';

/** The pinned note above the photos. */
export const board = { title: 'Moments worth keeping.', note: 'Hackathon podiums' };

/** `note` is the small line at the foot of the card; `alt` describes the photo. */
export type Achievement = { title: string; description: string; note: string; image: string; alt: string };
export const achievements: Achievement[] = [
  {
    title: '3rd place · Hack the City',
    description: 'A team prototype for Lisbon’s bike stations: live detection, real-road routes and a field app.',
    note: 'Hack the City · 2026',
    image: hackTheCity,
    alt: 'David and his two teammates holding the Hack the City 3rd-place trophy and prize cheque',
  },
  {
    title: '2nd place · Junction Lisbon',
    description: 'Runner-up at the Lisbon edition of Junction, the international hackathon.',
    note: 'Junction Lisbon · 2026',
    image: junctionLisbon,
    alt: 'David smiling at his desk among other participants during Junction Lisbon',
  },
];
