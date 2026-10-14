# Personal content

Everything that is *about you* lives here, and nothing else does. Each folder is one
element of the cabin; edit its `index.ts` and the site updates.

| Folder | Where it shows up | What to change |
| --- | --- | --- |
| `profile/` | Header badge, footer, browser tab, link previews | Name, role line, site title/description, contact links |
| `about/` | Notebook on the desk, “About me” button | Greeting, short biography paragraphs, cover note |
| `resume/` | Printer sheet, “Print résumé” | Résumé sections |
| `education/` | School book on the shelf | Institution/link, course summary, results and optional research per chapter |
| `experience/` | Work board on the wall | Role, period, optional organization, concise summary and optional project URL |
| `achievements/` | Photo board (3 photos) | Titles, captions, and `images/` |
| `hobbies/` | Tags on the tennis bag, surfboard and rod | Titles and notes |
| `projects/` | Folders on the computer | Name, category, tags, details, images, demo and website URLs (see its README) |

Import from the barrel, never from a subfolder: `import { profile } from '@/personal'`.

Layout, camera framing and animation are *not* personal and live in `src/components` and
`src/lib/reading-surfaces.ts`.

Keep school chapters and biography paragraphs short enough to fit their pages without
scrolling. Grades use the Portuguese 0–20 scale; distinguish completed results from a
current average. Do not invent dates or thesis outcomes.

The work board currently has four entries, newest first, in a fixed two-by-two layout.
Adding roles requires reviewing `journal-layout.ts`, the canvas texture and camera frames.
Do not switch to pagination or scrolling: each entry can be selected for camera focus.

Hobby IDs remain tied to the physical props (`tennis`, `surfing`, `fishing`); their titles and
notes currently describe gym and growth, beach and nature, and home in Maragota.
