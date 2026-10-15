/**
 * The résumé. The printer sheet in the room shows the short lines (`summary`, each entry's
 * heading, `skills`); the PDF behind “Print résumé” shows everything. Contact details come from
 * `profile.contact`. After editing, re-export `public/david-correia-cv.pdf` from the browser's
 * own print dialog (Ctrl+P → Save as PDF, A4, headers off), which prints the full version. Facts only: no invented dates or metrics.
 */
export type ResumeEntry = { title: string; place: string; period: string; points: string[] };

export const resume = {
  heading: 'Curriculum Vitae',
  role: 'Software Engineer',
  pdf: '/david-correia-cv.pdf',
  summary:
    'Computer Science and Engineering master’s student at Instituto Superior Técnico (AI and Cybersecurity, 17.5/20) who builds full-stack products end to end. Shipped two publishing extensions at Aptoide, merged two fixes into Apache Airflow, and reached the podium at two Lisbon hackathons in 2026.',
  /** Shorter summary for the printer sheet in the room. */
  sheetSummary:
    'Master’s student at Instituto Superior Técnico (AI and Cybersecurity) building full-stack products, from backend services to the interface.',
  experience: [
    {
      title: 'Teaching Assistant, Forensic Cybersecurity',
      place: 'Instituto Superior Técnico',
      period: 'Sep 2026 – Present',
      points: ['Teach and support a group of 20 students in a 200-student course.'],
    },
    {
      title: 'Software Engineering Intern',
      place: 'Aptoide',
      period: 'Jul – Aug 2026',
      points: [
        'Built an extension that prepares apps made with AI coding tools (Replit, Lovable and similar) for submission to both the Apple App Store and Aptoide.',
        'Built a second extension that reuses existing Apple App Store submissions to speed up publication on Aptoide.',
      ],
    },
    {
      title: 'Software Development Intern',
      place: 'Clevidence',
      period: 'Jul – Aug 2025',
      points: [
        'Developed ProjecRS, a full-stack tool to extract tables from PDFs, review and edit them, and export the data.',
        'Implemented the Python / FastAPI backend and the Vue interface.',
      ],
    },
  ] as ResumeEntry[],
  education: [
    {
      title: 'MSc Computer Science and Engineering (MEIC)',
      place: 'Instituto Superior Técnico',
      period: '2025 – Present',
      points: ['Specializations in AI and Cybersecurity · current average 17.5/20.', 'Thesis: checkpointing LLM training using CXL on spot VMs.'],
    },
    {
      title: 'BSc Computer Science and Engineering (LEIC-A)',
      place: 'Instituto Superior Técnico',
      period: '2022 – 2025',
      points: ['Final grade 17/20 · algorithms, software engineering, networks, operating systems and AI.'],
    },
  ] as ResumeEntry[],
  projects: [
    {
      title: 'Cascais Micromobility',
      place: 'React · TypeScript · FastAPI · PostGIS',
      period: '2026',
      points: ['Hackathon prototype that detects abandoned shared bikes from live GBFS data, routes collection teams on real roads and ranks new station sites.'],
    },
    {
      title: 'QuantumTrace',
      place: 'Python · FastAPI · React · CycloneDX',
      period: '2026',
      points: ['Team scanner that inventories cryptography in code, cloud configs and network captures, grades post-quantum risk and exports a CycloneDX CBOM.'],
    },
    {
      title: 'DepChain',
      place: 'Java · HotStuff · BLS',
      period: '2026',
      points: ['Byzantine fault tolerant blockchain prototype with HotStuff consensus, BLS signatures and an EVM-backed runtime.'],
    },
    {
      title: 'Apache Airflow',
      place: 'TypeScript · React · open source',
      period: '2025',
      points: ['Two merged pull requests (#48185, #48392) fixing dropdown visibility in the Airflow web interface.'],
    },
  ] as ResumeEntry[],
  awards: [
    '2nd place, Junction Lisbon hackathon (2026)',
    '3rd place, Hack the City Lisbon (2026), €1,000 prize',
  ],
  skills: [
    { label: 'Languages', items: 'Python, TypeScript / JavaScript, Java, C++, Kotlin, SQL' },
    { label: 'Web & backend', items: 'React, Next.js, Vue, FastAPI, gRPC, PostgreSQL / PostGIS, Tailwind CSS, Three.js' },
    { label: 'Systems & security', items: 'Distributed systems, BFT consensus, applied cryptography, TCP/UDP networking' },
    { label: 'Tools', items: 'Git, GitHub Actions, Maven, Jupyter, Linux' },
  ],
  /** One line of skills for the printer sheet in the room. */
  sheetSkills: 'Python, TypeScript, Java, C++ · React, FastAPI, gRPC, PostgreSQL · distributed systems and security',
  spoken: 'Portuguese (native), English (C1)',
};
