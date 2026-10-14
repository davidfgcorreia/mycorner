/** The seven interactive corners of the cabin. Their content lives in `src/personal`. */
export type Corner = 'projects' | 'studies' | 'achievements' | 'hobbies' | 'about' | 'resume' | 'experience';

/** Corners shown in the bottom navigation. `about` is reached from the header badge instead. */
export const corners: { id: Corner; label: string; subtitle: string }[] = [
  { id: 'projects', label: 'Projects', subtitle: 'The computer' },
  { id: 'studies', label: 'School history', subtitle: 'The bookshelf' },
  { id: 'achievements', label: 'Achievements', subtitle: 'The photo board' },
  { id: 'hobbies', label: 'Outside work', subtitle: 'The gear' },
  { id: 'resume', label: 'Résumé', subtitle: 'The printer' },
  { id: 'experience', label: 'Experience', subtitle: 'The work journal' },
];
