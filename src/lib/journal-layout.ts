/** Pixel layout shared by the work board, its canvas texture and camera framing. */
export const journalLayout = { width: 610, height: 640, x: 30, top: 86, rowStep: 272, columnStep: 290, cardWidth: 260, cardHeight: 250, padding: 12 };
export const journalEntry = (index: number) => ({ x: journalLayout.x + (index % 2) * journalLayout.columnStep, y: journalLayout.top + Math.floor(index / 2) * journalLayout.rowStep, width: journalLayout.cardWidth, height: journalLayout.cardHeight });
