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
First Floor Afterdark links to the public `first-floor-afterdark` repository and includes
three screenshots and a local recorded walkthrough. Its branding and media credits are
retained in `images/afterdark-credits.md`; it is a demonstration, not an official club site.

Each project has a name, category, year, description, detail, and tags. Optional fields:

- `highlights`: a list of features shown in the overview.
- `images`: `{ src, alt, caption? }` entries. Import images from this folder's `images/`.
- `websiteUrl`: an HTTPS website, shown in the monitor's Live site view.
- `demoUrl`: an HTTPS embeddable demo/video URL, or a local `/projects/` path for a recording.
- `demoType`: `"video"` for an embedded video, `"website"` for a website, or `"recording"`
  for a native video player. Video previews fit inside the monitor.
- `demoExternalUrl`: the share URL for a demo whose embed URL differs (such as YouTube).
- `sourceUrl`: an HTTPS repository link.

A YouTube demo should use `https://www.youtube-nocookie.com/embed/VIDEO_ID` for
`demoUrl` and the normal share link for `demoExternalUrl`. Only selected previews mount
an iframe or native video. Some hosts block embedding; the preview includes a new-tab fallback.
Hosted URLs are added only when a public deployment is verified. The IPM experiment
is served through GitHub Pages.

Store recorded demos in `public/projects/<project>/`. First Floor Afterdark uses
`/projects/first-floor-afterdark/demo.mp4`; the player has controls, plays inline on phones,
and stops when leaving the Demo view. Keep recordings small and retain source attribution.

Image previews are centered and sized to fit the screen, including portrait screenshots.
They open the full-size asset in a new tab on click. Category navigation has its own desktop
scrollbar; phones use the project type selector.
