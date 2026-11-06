# Search and AI visibility

## Public identity and content

Primary name: **David Correia**. Canonical domain: **https://davidfcorreia.com**.
Audience: employers and recruiters. Primary language: English.
Professional focus: cybersecurity and distributed systems. Location: Lisbon, Portugal.
Do not publish job availability. Google Search Console and Bing Webmaster Tools are already set up.
Priority: a stronger recruiter introduction. A custom 1200 × 630 social card is provided as
`public/social-card.svg` (editable source) and `public/social-card.png` (sharing asset).
A user-supplied portrait is served directly at `/david-correia-portrait.webp`, optimized to
640 × 800 pixels with embedded metadata stripped. Its URL is included in Person structured
data and it appears on `/profile`. The original download is not published. AI search should remain
accessible; the training policy is undecided, and the existing allow-all robots policy remains.
Current academic identity: second-year MEIC student at Instituto Superior Técnico (IST),
University of Lisbon; AI and Cybersecurity specializations. These facts come from
`src/personal/profile/index.ts` and the existing education and résumé data.

| Address | Purpose | Source |
| --- | --- | --- |
| `/` | Interactive portfolio and server-delivered introduction | `src/routes/index.tsx` |
| `/profile` | Readable, server-rendered biography, studies, experience, projects and contact links | `src/routes/profile.tsx`, shared personal data |
| `/llms.txt` | Public plain-text overview for tools that choose to read it | `src/lib/crawler-content.ts`, `src/server.ts` |
| `/robots.txt` | Crawl permissions and sitemap discovery | `public/robots.txt` |
| `/sitemap.xml` | Canonical HTML pages | `public/sitemap.xml` |

The profile includes a short Portuguese academic description to explain “aluno do Técnico”
accurately. No keyword stuffing or invented credentials. LinkedIn and GitHub identify David;
the university homepage identifies the institution, not a personal account.
`Person` structured data connects the public profiles; `/profile` adds `ProfilePage` metadata.

## After publishing

1. In the existing Google Search Console property, confirm verification and submit
   `https://davidfcorreia.com/sitemap.xml` and inspect `/` and `/profile` using URL Inspection.
2. In the existing Bing Webmaster Tools property, confirm verification, submit
   the sitemap and inspect the same URLs.
3. Check Cloudflare settings for bot challenges or managed robots rules that could prevent
   legitimate crawlers from reading the pages. Local robots.txt currently allows all crawlers;
   AI search and AI training policies can be decided separately.
4. Add the canonical website to GitHub, LinkedIn and any genuine university personal profile.
   Keep name, course, location and professional focus consistent.
5. Monitor actual impressions, queries, clicks and indexed pages before changing wording.
   Indexing and rankings are decided by search providers; submitting a sitemap does not guarantee them.

## Improvement options

- Publish case studies explaining the problem, David's own contribution, technical decisions,
  screenshots and outcomes, preserving team attribution and linking to evidence.
- Add useful technical writing on thesis work, CXL, distributed systems, AI or cybersecurity,
  subject to any research publication restrictions.
- Add accurate job preferences, availability and location after confirmation.
- Add a custom social sharing image and optionally a professional portrait.
- Consider full Portuguese pages with proper language links if a Portuguese audience becomes a priority.

## Sharing and mentions

The owner reports having already submitted a sitemap. Check its processing status and page
indexing in the existing webmaster accounts rather than repeatedly submitting it. Submit the
updated sitemap after publishing `/profile`; local changes are not visible to crawlers yet.

Prioritize these actions:

1. Link the canonical website from the GitHub profile website field, profile README, LinkedIn
   contact information and Featured section, and Devpost profile. Link back from the website
   using the existing verified profile URLs. The general IST homepage is an affiliation link;
   an actual personal IST or lab page would provide a more specific connection if available.
2. Add a brief author/portfolio link to relevant repository READMEs you own, especially this
   portfolio. Preserve collaborators' credit and do not edit shared projects solely to add links.
3. Share one useful project walkthrough in an appropriate Reddit community after checking
   current community rules. Explain the implementation, include screenshots, identify yourself
   as the author and invite specific technical feedback. Do not mass-post or buy links.
4. Publish an original article about a concrete problem solved in a project. Include the name
   David Correia, a short accurate author bio, source code and a link to the relevant portfolio
   content. Genuine hackathon, university or collaborator mentions can supply independent
   evidence when they accurately describe the work.

Draft Reddit/community post (review community rules and add screenshots before posting):

> I built an interactive 3D cabin for my portfolio with React Three Fiber
>
> I'm David Correia, a second-year master's student at Instituto Superior Técnico in Lisbon.
> I built a miniature cabin where the computer opens my projects, a book shows my education,
> and other objects open my experience and CV. The main implementation challenge was keeping
> camera movement, object animation and readable HTML synchronized. I also added a plain HTML
> profile for visitors who prefer reading. I'd welcome feedback on navigation and readability,
> particularly on phones.
>
> Website: https://davidfcorreia.com
> Source: https://github.com/davidfgcorreia/mycorner

Article ideas: synchronizing camera motion and HTML in React Three Fiber; lessons from the
cryptographic inventory scanner; implementing and testing Byzantine fault tolerant consensus.
Keep team attribution and describe only work actually performed.

The visible FAQ lives at `/profile#faq` and shares its answers with `/llms.txt` through
`profileFaq` in `src/personal/profile/index.ts`. It is ordinary useful page content; it does
not promise special FAQ search presentation or inclusion in AI answers. Outbound profile
links help navigation and identity consistency, but adding arbitrary links is not a ranking shortcut.

Queries combining the name and institution are more specific than “personal website” or
“IST student.” Broad queries have many relevant results; no metadata or scraper file can
guarantee a position. Avoid buying unrelated domains or artificial backlinks to chase them.

## References

- [Google: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: optimizing for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Cloudflare: Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)

Google explicitly says it does not use llms.txt for Search, including its AI features.
The file is supplied as a convenient public export, while crawlable HTML remains the foundation.
