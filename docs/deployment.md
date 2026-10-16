# Deployment

## Current target

The Vite configuration supplied by `@lovable.dev/vite-tanstack-config` builds TanStack Start
with Nitro's `cloudflare-module` preset. Cloudflare Workers is the recommended host for this
existing output. Production is deployed from a local checkout (below).

`npm run build` generates:

- `.output/server/index.mjs`: the Worker entry point.
- `.output/public/`: browser assets, models, images and project recordings.
- `.output/server/wrangler.json`: Worker configuration and the static asset binding.
- `.wrangler/deploy/config.json`: a pointer to the generated Wrangler configuration.

The Worker name (`davidcorreia`), a pinned compatibility date and the custom domain routes are
set in `wrangler.jsonc` at the project root; Nitro merges that file into the generated
configuration. The site is served at `https://davidfcorreia.com` (registered on Cloudflare);
deploying creates the DNS records and certificate. `www.davidfcorreia.com` is attached too and
`src/server.ts` redirects it to the bare domain. Because routes are set, Wrangler disables the
`workers.dev` address, so search engines only ever see one URL.

## Search engines

The home page renders the cabin only in the browser, so the index route's `pendingComponent`
(`Intro` in `routes/index.tsx`) is what the server sends: name, role, résumé summary and profile
links, all from `src/personal`. The root route adds the canonical URL, `og:url` and a schema.org
`Person` (`src/lib/seo.ts`) linking GitHub, LinkedIn and Devpost. `public/sitemap.xml` and
`robots.txt` point at the domain; `profile.site` must match it. Cloudflare rejects a
compatibility date later than its own clock, so bump the pinned date deliberately rather than
using today's. Inspect the generated configuration after building; do not edit or commit build
output as persistent configuration.

## Deploy from a local checkout

With dependencies installed and a Cloudflare account:

```sh
npx tsc --noEmit
npm test
npm run build
npx wrangler login
npx wrangler deploy --config .output/server/wrangler.json
```

The login and deploy commands authenticate with Cloudflare and publish the site. Wrangler
reports the deployment URL; verify it before adding it to portfolio links or documentation.

Check the room, project images and demo playback, all school chapters, work entry focus,
and the biography on desktop and phone. Local recorded demo URLs must serve video rather
than an HTML fallback.

## Deploy from GitHub

Connect `davidfgcorreia/mycorner` and its `main` branch to Cloudflare Workers Builds.
Use `npm run build` as the build command and
`npx wrangler deploy --config .output/server/wrangler.json` as the deploy command.
Keep dependency installation compatible with the repository's `bun.lock`; there is no
committed npm lockfile, so do not use `npm ci` without changing the dependency workflow.

Configure a custom domain after verifying the deployed `workers.dev` site. Check the current
Cloudflare plan and limits before enabling automatic production deployments.

## References

- [Nitro on Cloudflare](https://nitro.build/deploy/providers/cloudflare)
- [Wrangler Worker commands](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
- [Static asset billing and limits](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)

The repository remains connected to Lovable. Normal pushes sync back to its editor;
preserve published history when configuring another host.
