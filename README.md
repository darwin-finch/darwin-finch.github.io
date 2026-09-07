# Finch website

The public Finch website is built with [Astro](https://astro.build/) and its
documentation uses [Starlight](https://starlight.astro.build/). The marketing
site is maintained here; documentation prose remains canonical in
[`darwin-finch/finch`](https://github.com/darwin-finch/finch).

## Develop locally

Use Node.js 22 or newer:

```sh
npm ci
npm run dev
```

`npm run dev` downloads the selected canonical documents before starting the
development server. To avoid network access and test unpublished documentation
changes, point it at a local Finch checkout:

```sh
FINCH_DOCS_ROOT=../finch npm run dev
```

Before opening a pull request, run:

```sh
npm run check
npm run build
```

See [`docs/WEBSITE_ARCHITECTURE.md`](docs/WEBSITE_ARCHITECTURE.md) for route,
content-ownership, synchronization, and deployment details. Coding agents must
also follow [`CLAUDE.md`](CLAUDE.md), including its GitHub issue requirement.
