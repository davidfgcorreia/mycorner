/** The work journal pinned to the wall: newest first. */
export type Job = {
  title: string;
  period: string;
  organization?: string;
  summary: string;
  projectUrl?: string;
};
export const experience: Job[] = [
  {
    title: 'Teaching assistant',
    period: '2026 · Current term',
    summary: 'Teaching assistant for Forensic Cybersecurity.',
  },
  {
    title: 'Software engineering intern',
    period: '2026',
    organization: 'Aptoide',
    summary: 'Built two extensions: AI-coded projects (Replit, Lovable…) → Apple and Aptoide submissions; Apple submissions → faster Aptoide publication.',
  },
  {
    title: 'Software development intern',
    period: '2025',
    organization: 'Clevidence',
    summary: 'Built ProjecRS for PDF table extraction and review, with a Python / FastAPI backend, Vue interface and data exports.',
    projectUrl: 'https://github.com/davidfgcorreia/ProjecRS',
  },
  {
    title: 'Summer replenishment assistant',
    period: '2021 · Summer',
    organization: 'Pingo Doce',
    summary: 'Summer stock replenishment. Received the regional Best Performance award.',
  },
];
