/**
 * The photo board. Drop photos into ./images and import them here (3:2 works best; WebP around 864 px wide keeps it light).
 * The board holds three photos.
 */
import projectPhoto from './images/milestone-project.webp';
import studyPhoto from './images/milestone-study.webp';
import teamPhoto from './images/milestone-team.webp';

/** The pinned note above the photos, and the small line at the foot of each card. */
export const board = { title: 'Moments worth keeping.', note: 'Sample photos & milestones', cardNote: 'Sample milestone' };

export type Achievement = { title: string; description: string; image: string };
export const achievements: Achievement[] = [
  { title: 'First project shipped', description: 'From a blank page to a working idea.', image: projectPhoto },
  { title: 'A new chapter', description: 'Taking the time to learn something unfamiliar.', image: studyPhoto },
  { title: 'Made something together', description: 'Learning from people, in and out of the studio.', image: teamPhoto },
];
