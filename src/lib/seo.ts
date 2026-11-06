import { profile, resume } from "@/personal";

/** Schema.org Person for search engines: ties the site to the same person's other profiles. */
export function personJsonLd() {
  const { contact, school } = profile;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profile.site}/#person`,
    name: profile.name,
    alternateName: ["davidfcorreia", "davidfgcorreia"],
    url: `${profile.site}/`,
    image: new URL(profile.portrait.src, profile.site).href,
    jobTitle: resume.role,
    description: profile.siteDescription,
    ...(contact.email ? { email: `mailto:${contact.email}` } : {}),
    ...(contact.location
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: contact.location.split(",")[0]?.trim(),
            addressCountry: contact.location.split(",").at(-1)?.trim(),
          },
        }
      : {}),
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: school.name,
      alternateName: ["IST", "Técnico", "Técnico Lisboa"],
      url: school.url,
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: school.name, url: school.url },
    sameAs: [contact.github, contact.linkedin, contact.devpost].filter(Boolean),
  }).replace(/</g, "\\u003c");
}

export function profilePageJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${profile.site}/profile#page`,
    url: `${profile.site}/profile`,
    name: profile.siteTitle,
    inLanguage: "en",
    mainEntity: { "@id": `${profile.site}/#person` },
  }).replace(/</g, "\\u003c");
}
