# Personal content

Everything that is *about you* lives here, and nothing else does. Each folder is one
element of the cabin; edit its `index.ts` and the site updates.

| Folder | Where it shows up | What to change |
| --- | --- | --- |
| `profile/` | Header badge, footer, browser tab, link previews | Name, role line, site title/description, contact links |
| `about/` | Notebook on the desk, “About me” button | Greeting and biography |
| `resume/` | Printer sheet, “Print résumé” | Résumé sections |
| `education/` | School book on the shelf | One entry per chapter |
| `experience/` | Work journal on the wall | One entry per role |
| `achievements/` | Photo board (3 photos) | Titles, captions, and `images/` |
| `hobbies/` | Tags on the tennis bag, surfboard and rod | Titles and notes |
| `projects/` | Folders on the computer | Name, category, tags, details |

Import from the barrel, never from a subfolder: `import { profile } from '@/personal'`.

Layout, camera framing and animation are *not* personal and live in `src/components` and
`src/lib/reading-surfaces.ts`.
