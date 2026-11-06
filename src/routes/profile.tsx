import { createFileRoute, Link } from "@tanstack/react-router";
import { about, education, profile, profileFaq, projects, resume } from "@/personal";
import { profilePageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: `About ${profile.name} — Software Engineer & IST Student` },
      { name: "description", content: profile.siteDescription },
      { property: "og:title", content: `About ${profile.name}` },
      { property: "og:url", content: `${profile.site}/profile` },
    ],
    links: [{ rel: "canonical", href: `${profile.site}/profile` }],
    scripts: [{ type: "application/ld+json", children: profilePageJsonLd() }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <main className="public-profile">
      <nav aria-label="Profile navigation">
        <Link to="/">Explore the interactive cabin</Link>
        <a href={resume.pdf}>Download CV (PDF)</a>
      </nav>
      <header className="profile-header">
        <img
          className="profile-portrait"
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={profile.portrait.width}
          height={profile.portrait.height}
          decoding="async"
        />
        <div>
          <p>Personal website · {profile.contact.location}</p>
          <h1>{profile.name}</h1>
          <p className="profile-lead">{resume.role} · Instituto Superior Técnico student</p>
          <p>
            Focus: {profile.professionalFocus}. Based in {profile.contact.location}.
          </p>
          <p>{profile.professionalIntro}</p>
          <p>{profile.academicSummary}</p>
          <p>{resume.summary}</p>
        </div>
      </header>
      <nav aria-label="Profile sections">
        {["About", "Education", "Experience", "Projects", "Skills", "FAQ", "Contact"].map(
          (label) => (
            <a key={label} href={`#${label.toLowerCase()}`}>
              {label}
            </a>
          ),
        )}
      </nav>
      <section id="about">
        <h2>About me</h2>
        {about.paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </section>
      <section id="education">
        <h2>Education at IST</h2>
        {education.map((entry) => (
          <article key={entry.title}>
            <h3>
              {entry.title}
              {entry.qualification && ` — ${entry.qualification}`}
            </h3>
            <p>
              <a href={entry.institutionUrl}>{entry.institution}</a> · {entry.period}
            </p>
            {entry.description && <p>{entry.description}</p>}
            {entry.research && (
              <p>
                {entry.research.title}: {entry.research.description}
              </p>
            )}
          </article>
        ))}
        <p lang="pt-PT">{profile.academicSummaryPt}</p>
      </section>
      <section id="experience">
        <h2>Experience</h2>
        {resume.experience.map((entry) => (
          <article key={entry.title}>
            <h3>{entry.title}</h3>
            <p>
              {entry.place} · {entry.period}
            </p>
            <ul>
              {entry.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section id="projects">
        <h2>Projects and open source</h2>
        {projects.map((project) => (
          <article key={project.name}>
            <h3>{project.name}</h3>
            <p>
              {project.category} · {project.year} · {project.tags.join(", ")}
            </p>
            <p>{project.description}</p>
            <p>{project.detail}</p>
            <nav aria-label={`${project.name} links`}>
              {project.sourceUrl && <a href={project.sourceUrl}>Source code</a>}
              {project.websiteUrl && <a href={project.websiteUrl}>Website</a>}
              {project.demoExternalUrl && <a href={project.demoExternalUrl}>Demo</a>}
            </nav>
          </article>
        ))}
      </section>
      <section id="skills">
        <h2>Skills and achievements</h2>
        <ul>
          {resume.skills.map((skill) => (
            <li key={skill.label}>
              <strong>{skill.label}:</strong> {skill.items}
            </li>
          ))}
        </ul>
        <p>{resume.spoken}</p>
        <ul>
          {resume.awards.map((award) => (
            <li key={award}>{award}</li>
          ))}
        </ul>
      </section>
      <section id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Questions about David Correia</h2>
        {profileFaq.map(({ question, answer }) => (
          <article key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </article>
        ))}
        <p>
          <a href="#projects">Explore my projects</a> or{" "}
          <a href={resume.pdf}>download my CV (PDF)</a>.
        </p>
      </section>
      <section id="contact">
        <h2>Contact and profiles</h2>
        <nav aria-label="Contact links">
          <a href={`mailto:${profile.contact.email}`}>Email David</a>
          <a href={profile.contact.github}>GitHub</a>
          <a href={profile.contact.linkedin}>LinkedIn</a>
          <a href={profile.contact.devpost}>Devpost</a>
        </nav>
      </section>
      <footer>
        <Link to="/">Return to my corner</Link> ·{" "}
        <a href="/llms.txt">Plain-text site information</a>
      </footer>
    </main>
  );
}
