# Website development

Track every website update with a GitHub issue in this repository.

- Before changing the site, create or identify an open issue that describes the update and its acceptance criteria.
- Keep the issue open while implementation or verification is incomplete. Add a comment when useful context or a blocker should survive the current work session.
- After the update has been implemented and verified, summarize the result on the issue and close it.
- If verification fails or the work is only partially complete, leave the issue open and record what remains.

## Stack and commands

This is an Astro website with Starlight documentation. Use Node.js 22 and the
committed npm lockfile.

```sh
npm ci                 # install exactly the locked dependencies
npm run dev            # synchronize docs, then start the local server
npm run sync-docs      # refresh generated docs from darwin-finch/finch
npm run sync-docs:check
npm run check          # synchronize docs and run Astro/type checks
npm run build          # synchronize docs and build dist/
npm run preview        # serve the most recent production build
```

The documentation synchronizer reads a local Finch checkout when
`FINCH_DOCS_ROOT` is set. Otherwise it fetches the canonical files from the
public `darwin-finch/finch` repository. For example:

```sh
FINCH_DOCS_ROOT=../finch npm run sync-docs
```

## Content ownership

- Edit marketing content in `src/pages/index.astro`.
- Edit the full comparison in `src/pages/compare.astro`.
- Edit model and provider support in `src/pages/models.astro`.
- Edit shared navigation, footer, metadata, and styling in `src/components/`,
  `src/layouts/`, and `src/styles/`.
- Edit the public documentation selection and page metadata in
  `config/docs-manifest.json`.
- Edit imported documentation prose only in `darwin-finch/finch`. Never edit
  generated directories under `src/content/docs/docs/`; `npm run sync-docs`
  overwrites them.
- Edit the authored documentation landing page at
  `src/content/docs/docs/index.mdx`.

Read `docs/WEBSITE_ARCHITECTURE.md` before changing routing, documentation
synchronization, or deployment.

## Required verification

Run `npm run check` and `npm run build` for every website change. The production
build also checks links between generated files. Inspect the affected routes at
mobile and desktop widths when markup or CSS changes.
Changes to the comparison or model-support claims must retain their caveats and
source links.
