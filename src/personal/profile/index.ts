/** Who you are, everywhere your name shows up: header, footer, browser tab and link previews. */
export const profile = {
  name: "David Correia",
  firstName: "David",
  portrait: {
    src: "/david-correia-portrait.webp",
    alt: "Portrait of David Correia",
    width: 640,
    height: 800,
  },
  /** Two or three letters shown on the name badge and the notebook cover. */
  monogram: "dc",
  /** One line under your name on the header badge. */
  role: "Maker · little corner of the internet",
  siteTitle: "David Correia — Software Engineer & IST Master’s Student",
  siteDescription:
    "David Correia’s personal website: software engineer focused on cybersecurity and distributed systems; second-year master’s student at Instituto Superior Técnico (IST), Lisbon, Portugal.",
  professionalFocus: "Cybersecurity and distributed systems",
  professionalIntro:
    "I build software with a focus on cybersecurity and distributed systems. My work spans cryptographic inventory tools, Byzantine fault tolerant consensus, full-stack applications and open-source contributions to Apache Airflow.",
  academicSummary:
    "I am a second-year Computer Science and Engineering master’s student (MEIC) at Instituto Superior Técnico (IST), University of Lisbon, specializing in AI and Cybersecurity.",
  academicSummaryPt:
    "Sou aluno do Técnico (Instituto Superior Técnico, IST), no segundo ano do mestrado em Engenharia Informática e de Computadores, com especializações em Inteligência Artificial e Cibersegurança.",
  shareDescription:
    "A personal world of projects, curiosity, and everyday adventures, inside an interactive miniature cabin.",
  footerNote: "A small space, made with care",
  year: 2026,
  /** The site's public address: canonical links, the sitemap and search-engine data use it. */
  site: "https://davidfcorreia.com",
  /** Where you study, for search engines (shown as your affiliation). */
  school: { name: "Instituto Superior Técnico", url: "https://tecnico.ulisboa.pt" },
  /** Optional. Leave a field empty to hide it. */
  contact: {
    email: "davidfgcorreia@protonmail.com",
    github: "https://github.com/davidfgcorreia",
    linkedin: "https://www.linkedin.com/in/david-c0rreia",
    devpost: "https://devpost.com/davidfgcorreia",
    location: "Lisbon, Portugal",
  },
};

/** Public answers shared by the readable profile and plain-text export. */
export const profileFaq = [
  {
    question: "Who is David Correia?",
    answer: `${profile.name} is a software engineer based in ${profile.contact.location}. ${profile.professionalIntro}`,
  },
  {
    question: "Is David Correia a student at Instituto Superior Técnico (IST)?",
    answer: profile.academicSummary,
  },
  {
    question: "What areas does David Correia focus on?",
    answer: `${profile.professionalFocus}. His portfolio includes cryptographic inventory tools, distributed systems projects and open-source contributions.`,
  },
  {
    question: "How can I contact David Correia?",
    answer: `Email ${profile.contact.email}, or use the LinkedIn and GitHub links in the contact section of this profile.`,
  },
];
