/** Pixel layout shared by the work board, its canvas texture and camera framing: one column, newest first. */
export const journalLayout = { width: 610, height: 640, x: 62, top: 82, rowStep: 138, cardWidth: 518, cardHeight: 128, padding: [10, 12] as const, dotX: 47 };
export const journalEntry = (index: number) => ({ x: journalLayout.x, y: journalLayout.top + index * journalLayout.rowStep, width: journalLayout.cardWidth, height: journalLayout.cardHeight });
