# Website architecture

## Purpose

This repository presents Finch's marketing site and makes selected canonical
project documentation comfortable to browse. It does not own the imported
documentation prose. Keeping that boundary explicit prevents the website and
the source repository from developing contradictory copies.

## Routes

| Route | Source | Ownership |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | This repository |
| `/compare/` | `src/pages/compare.astro` | This repository |
| `/models/` | `src/pages/models.astro` | This repository |
| `/docs/` | `src/content/docs/docs/index.mdx` | This repository |
| `/docs/**` | Generated from `darwin-finch/finch` | Finch source repository |

The legacy `/docs.html` URL redirects to `/docs/` so existing links and
bookmarks continue to work.

The marketing routes share `SiteLayout`, `SiteHeader`, `SiteFooter`, and the
global stylesheet. Starlight owns documentation layout and navigation, with
small visual overrides in `src/styles/starlight.css`.

The long comparison and model-support tables intentionally live outside the
homepage. The homepage carries short summaries and stable links to their full
pages. Do not copy the complete tables back into the homepage.

## Documentation synchronization

`config/docs-manifest.json` is the publication allowlist. Each item maps one
canonical source path to a website route and supplies navigation metadata. A
document is not public merely because it exists in the Finch repository; add it
to the manifest deliberately.

`scripts/sync-docs.mjs` performs four transformations:

1. It reads from `FINCH_DOCS_ROOT` when available, or from the Finch repository's
   public `main` branch otherwise.
2. It adds Starlight frontmatter and a canonical-source notice.
3. It rewrites links between selected documents to website routes.
4. It sends other relative document and image links back to their canonical
   GitHub locations.

Generated pages are gitignored. Never edit them: a clean build recreates them.
To preview an upstream documentation branch, check that branch out locally and
set `FINCH_DOCS_ROOT` to its root.

`npm run sync-docs:check` compares existing generated pages with their sources.
This is useful after generation when diagnosing unexpected drift. Normal check
and build commands synchronize first so a clean checkout works without checked-
in generated content.

## Comparison and model claims

The comparison is an evidence document rather than a decorative feature grid.
Preserve its legend, footnotes, verification date, negative results, and links
when editing it. The models page distinguishes configured profiles from tested
end-to-end support. Do not strengthen either kind of claim merely to make the
copy shorter.

These pages remain explicit Astro markup for now. Move them into structured data
only when the schema improves reviewability; a bulk conversion that makes the
evidence harder to audit is not an improvement.

## JavaScript and styling

`public/app.js` contains the small amount of browser behavior: the mobile menu,
install-command copy button, terminal demonstration, comparison-footnote
tooltips, and intersection-observer effects. Comparison superscripts become
links at runtime, use their numbered list items as accessible descriptions, and
render one shared fixed-position tooltip outside the scrolling table. Keep the
numbered list intact as the canonical mobile and no-JavaScript fallback.

The script is deliberately framework-independent. Prefer Astro-rendered HTML
and CSS; add a hydrated UI framework only when a feature truly needs persistent
client state.

The original visual system lives in `src/styles/global.css`. Documentation uses
Starlight's layout so readers get its sidebar, navigation, and content behavior
rather than a second hand-built documentation shell.

## Deployment

`.github/workflows/deploy.yml` builds and publishes `dist/` through GitHub
Pages. It checks out both repositories, so deployment does not depend on a
network fetch for individual Markdown files. It runs on website pushes, manual
dispatches, and a daily schedule; the schedule picks up documentation-only
changes from the Finch repository without duplicating them here.

GitHub Pages must have **Source: GitHub Actions** selected in repository
settings. The workflow uses only the standard Pages permissions and does not
need a cross-repository secret while the Finch repository is public.

The npm `postbuild` hook runs `scripts/check-built-site.mjs`, which verifies that
local links and assets referenced by every generated HTML file exist in `dist/`.

If documentation freshness later needs to be immediate, add a narrowly scoped
cross-repository dispatch from Finch rather than placing a broad personal token
in this repository.

## Change checklist

1. Create or identify the required open GitHub issue.
2. Make the smallest change in the owning source described above.
3. Run `npm run check` and `npm run build`.
4. Inspect affected routes at desktop and mobile widths.
5. Record verification on the issue and close it only when all acceptance
   criteria are satisfied.
