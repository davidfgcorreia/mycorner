# Deployment

## Current target

The Vite configuration supplied by `@lovable.dev/vite-tanstack-config` builds TanStack Start
with Nitro's `cloudflare-module` preset. Cloudflare Workers is the recommended host for this
existing output. No production deployment was performed during the October 15 update;
`localhost:5173` is a local development address.

`npm run build` generates:

- `.output/server/index.mjs`: the Worker entry point.
- `.output/public/`: browser assets, models, images and project recordings.
- `.output/server/wrangler.json`: Worker configuration and the static asset binding.
- `.wrangler/deploy/config.json`: a pointer to the generated Wrangler configuration.

The current generated Worker name is `davidfgcorreia-mycorner`. Inspect the generated
configuration after building; do not edit or commit build output as persistent configuration.

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
