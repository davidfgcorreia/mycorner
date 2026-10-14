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
    qualification: '',
    description: '',
    results: [
      { label: 'Internal grade', value: '17.9 / 20' },
      { label: 'Physics and Chemistry exam', value: '19 / 20', note: 'School’s highest score that year.' },
      { label: 'Mathematics exam', value: '20 / 20' },
    ],
  },
  {
    title: 'Bachelor’s degree',
    period: 'Completed · Chapter 02',
    institution: 'Instituto Superior Técnico · Alameda',
    institutionUrl: 'https://tecnico.ulisboa.pt/pt/ensino/cursos/licenciaturas/engenharia-informatica-e-de-computadores/',
    qualification: 'Computer Science and Engineering · LEIC-A',
    description: 'A three-year degree in programming, algorithms, software engineering, networks, operating systems and AI, with a team-based final project.',
    results: [{ label: 'Final grade', value: '17 / 20' }],
  },
  {
    title: 'Master’s degree',
    period: 'In progress · Chapter 03',
    institution: 'Instituto Superior Técnico · Alameda',
    institutionUrl: 'https://tecnico.ulisboa.pt/pt/ensino/cursos/mestrados/engenharia-informatica-e-de-computadores/',
    qualification: 'Computer Science and Engineering · MEIC',
    description: 'Specializations: AI and Cybersecurity.',
    results: [{ label: 'Current average', value: '17.5 / 20' }],
    research: {
      title: 'Current thesis',
      description: 'Checkpointing LLM training using CXL on spot VMs.',
    },
  },
];
