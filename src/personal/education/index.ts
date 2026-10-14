/** The school book on the shelf: one chapter per stage of your education. */
export type Chapter = { title: string; period: string; description: string };
export const education: Chapter[] = [
  { title: 'Secondary school', period: 'Chapter 01', description: 'School name, dates, and subjects to be added.' },
  { title: 'Further education', period: 'Chapter 02', description: 'Course, institution, and qualification to be added.' },
  { title: 'Continuing learning', period: 'Chapter 03', description: 'Courses, certificates, and independent studies to be added.' },
];
