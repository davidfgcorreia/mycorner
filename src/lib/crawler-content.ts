import { profile, profileFaq, resume } from "@/personal";

/** A public reading aid, generated from the same facts as the portfolio. */
export function crawlerContent() {
  return [
    `# ${profile.name}`,
    "",
    `> ${profile.siteDescription}`,
    "",
    "## Website",
    `- [Interactive personal website](${profile.site}/)`,
    `- [Readable profile, education, projects and experience](${profile.site}/profile)`,
    `- [CV PDF](${new URL(resume.pdf, profile.site)})`,
    "",
    "## Profile",
    profile.academicSummary,
    `Professional focus: ${profile.professionalFocus}.`,
    profile.professionalIntro,
    resume.summary,
    `Location: ${profile.contact.location}.`,
    "",
    "## Education",
    ...resume.education.flatMap((entry) => [
      `### ${entry.title}`,
      `${entry.place} | ${entry.period}`,
      ...entry.points.map((point) => `- ${point}`),
      "",
    ]),
    "## Experience",
    ...resume.experience.flatMap((entry) => [
      `### ${entry.title}`,
      `${entry.place} | ${entry.period}`,
      ...entry.points.map((point) => `- ${point}`),
      "",
    ]),
    "## Selected projects",
    ...resume.projects.flatMap((entry) => [
      `### ${entry.title}`,
      `${entry.place} | ${entry.period}`,
      ...entry.points.map((point) => `- ${point}`),
      "",
    ]),
    "## Questions about David Correia",
    ...profileFaq.flatMap(({ question, answer }) => [`### ${question}`, answer, ""]),
    "## Public profiles",
    ...(["github", "linkedin", "devpost"] as const).map(
      (key) => `- [${key}](${profile.contact[key]})`,
    ),
    "",
    "## Portuguese academic description",
    profile.academicSummaryPt,
    "",
  ].join("\n");
}
