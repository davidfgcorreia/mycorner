/** The school book on the shelf: one chapter per stage of your education. */
export type Chapter = {
  title: string;
  period: string;
  institution: string;
  institutionUrl: string;
  qualification: string;
  description: string;
  results: { label: string; value: string; note?: string }[];
  research?: { title: string; description: string };
};
export const educationNote = 'All grades use the Portuguese 0–20 scale.';
export const education: Chapter[] = [
  {
    title: 'Secondary school',
    period: 'Completed · Chapter 01',
    institution: 'Escola Secundária Dr. Francisco Fernandes Lopes',
    institutionUrl: 'https://www.aeffl.pt/home/index.php/apresentacao/escola-secundaria-dr-francisco-fernandes-lopes',
    qualification: 'Secondary education',
    description: 'Completed secondary school with a strong academic record and national examination results in mathematics, physics and chemistry.',
    results: [
      { label: 'Internal grade', value: '17.9 / 20' },
      { label: 'Physics and Chemistry exam', value: '19 / 20', note: 'Highest Physics and Chemistry exam grade at the school that year.' },
      { label: 'Mathematics exam', value: '20 / 20' },
    ],
  },
  {
    title: 'Bachelor’s degree',
    period: 'Completed · Chapter 02',
    institution: 'Instituto Superior Técnico · Alameda',
    institutionUrl: 'https://tecnico.ulisboa.pt/pt/ensino/cursos/licenciaturas/engenharia-informatica-e-de-computadores/',
    qualification: 'Computer Science and Engineering · LEIC-A',
    description: 'A three-year engineering degree combining programming, algorithms and data structures, software engineering, computer networks, operating systems and artificial intelligence, supported by mathematics and a team-based integrative project.',
    results: [{ label: 'Final grade', value: '17 / 20' }],
  },
  {
    title: 'Master’s degree',
    period: 'In progress · Chapter 03',
    institution: 'Instituto Superior Técnico · Alameda',
    institutionUrl: 'https://tecnico.ulisboa.pt/pt/ensino/cursos/mestrados/engenharia-informatica-e-de-computadores/',
    qualification: 'Computer Science and Engineering · MEIC',
    description: 'Continuing my studies at Técnico, specializing in Artificial Intelligence and Cybersecurity.',
    results: [{ label: 'Current average', value: '17.5 / 20', note: 'Degree in progress.' }],
    research: {
      title: 'Checkpointing LLM training with CXL on spot VMs',
      description: 'My ongoing thesis investigates checkpointing for large language model training using Compute Express Link (CXL) on spot virtual machines, with a focus on preserving training progress when instances are interrupted.',
    },
  },
];
