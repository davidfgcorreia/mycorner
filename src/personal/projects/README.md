# Projects on the computer

Edit `index.ts` to add or update a folder. Descriptions were checked against the linked
public GitHub repositories, including team repositories David contributed to.
QuantumTrace links to David's attributed public fork and the team's YouTube demo.
Airflow is presented as two merged contributions to Apache's project. DepChain,
TupleSpaces, and Networked Mastermind link to public snapshots with source attribution.
Systems Modelling and IPM link to David's public forks. Systems Modelling includes a
simplified SVG preview derived from the original Archi model. IPM uses a public static
target-selection demo with anonymous participant prompts and recording disabled;
the original team's Figma prototype still requires login.
Private source repositories are not linked from the public portfolio.
The local WebP images come from the Hack the City screenshot
gallery and the Captain Sonar map asset; they are real repository media.

Each project has a name, category, year, description, detail, and tags. Optional fields:

- `highlights`: a list of features shown in the overview.
- `images`: `{ src, alt, caption? }` entries. Import images from this folder's `images/`.
- `websiteUrl`: an HTTPS website, shown in the monitor's Live site view.
- `demoUrl`: an HTTPS embeddable demo or video URL, shown in the Demo view.
- `demoType`: use `"video"` to fit the video player and its controls inside the monitor.
- `demoExternalUrl`: the share URL for a demo whose embed URL differs (such as YouTube).
- `sourceUrl`: an HTTPS repository link.

A YouTube demo should use `https://www.youtube-nocookie.com/embed/VIDEO_ID` for
`demoUrl` and the normal share link for `demoExternalUrl`. Only selected previews mount
an iframe. Some hosts block embedding; the preview always includes a new-tab fallback.
Hosted URLs are added only when a public deployment is verified. The IPM experiment
is served through GitHub Pages.
