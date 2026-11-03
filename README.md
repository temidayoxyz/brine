# Brine

A quiet, editorial journal about attention, design, and the texture of digital life. Built with Astro, TypeScript, and hand-written CSS.

Brine is a static-first publication: every story is pre-rendered at build time, the only client-side JavaScript powers progressive enhancements (theme, search, filtering, reading progress, and sharing), and the site remains fully readable without it.

- **Live site:** [https://temidayoxyz.github.io/brine/](https://temidayoxyz.github.io/brine/)
- **Repository:** [https://github.com/temidayoxyz/brine](https://github.com/temidayoxyz/brine)
- **Stack:** Astro 7, TypeScript, Content Collections, Fontsource variable fonts
- **Output:** static HTML, one JSON search index, RSS, sitemap, and robots.txt
- **No framework runtime:** no React, Vue, or Svelte

The site is served from a GitHub Pages project path, so every internal URL is prefixed with `/brine/`. The origin and base path are defined in `src/config.ts`.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

The project was built and verified with Node 25 and npm 11. The GitHub Actions workflow uses Node 22.

## Quick start

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321/brine/`.

To inspect the production build locally:

```bash
npm run build
npm run preview
```

`astro preview` serves the build at `http://localhost:4321/brine/`. If the port is occupied, pass one explicitly:

```bash
npm run preview -- --port 4324
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro dev server with hot reload |
| `npm run build` | Generate the static site into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Run `astro check` for TypeScript and Astro diagnostics |

## Project structure

```text
.github/workflows/
  deploy.yml           Build, check, and deploy to GitHub Pages
src/
  assets/
    covers/            Article cover images (optimized by Astro)
    editorial/         About-page and editorial imagery
  components/          Header, footer, cards, search, theme, share, progress
  content/
    articles/          Markdown essays with typed frontmatter
  data/
    site.ts            Site name, issue metadata, navigation, colophon
    topics.ts          Five topic definitions and slugs
    authors.ts         House byline metadata
  layouts/
    BaseLayout.astro   Document shell, SEO, fonts, theme boot, reveal motion
  lib/
    articles.ts        Sorting, reading time, dates, related stories
    paths.ts           Base-path and absolute-URL helpers
    rehype-base-links.ts
                       Prefixes root-relative Markdown links with the base
    search.ts          Shared search scoring and snippets
  pages/
    index.astro        Homepage
    journal/           Journal index and article template
    topics/            Topic index and per-topic pages
    archive.astro      Chronological archive
    about.astro        About and colophon
    404.astro          Custom not-found page
    rss.xml.ts         RSS feed
    robots.txt.ts      Crawler policy and sitemap pointer
    search.json.ts     Static search index
  styles/
    global.css         Tokens, base styles, prose, motion, print
  config.ts            Production origin, base path, repository URL
public/
  og/brine-og.png      Default 1200 × 630 social card
  favicon.svg          Wave mark
  icon-192.png         Web app icon
  icon-512.png         Web app icon
  apple-touch-icon.png
  site.webmanifest
```

## Authoring a story

Add a Markdown file to `src/content/articles/`. The filename becomes the URL slug:

```text
src/content/articles/a-walk-without-a-podcast.md
→ /brine/journal/a-walk-without-a-podcast/
```

Frontmatter is validated by `src/content.config.ts`:

```yaml
---
title: "A Walk Without a Podcast"
description: "A short, specific description used in cards, search, and social metadata."
category: "attention" # attention | design | digital-life | culture | living
publishedAt: 2026-10-28
author: "Brine Editorial"
cover: "../../assets/covers/attention.jpg"
coverAlt: "A quiet path through coastal grass"
coverCaption: "The path is the point."
coverCredit: "Photograph via Unsplash"
coverPosition: "center"
featured: false
tags: ["walking", "attention", "rituals"]
keywords: ["walking without headphones", "boredom", "attention"]
draft: false
---

The essay begins here.
```

Notes:

- `title`, `description`, `category`, `publishedAt`, `cover`, and `coverAlt` are required.
- `draft: true` removes a story from every listing, feed, sitemap, and search result.
- `featured: true` promotes a story in the header announcement and homepage feature slot. The newest published story is used as a fallback.
- Reading time is estimated at 220 words per minute from the Markdown body.
- Internal links in Markdown may stay root-relative (`/journal/another-story/`); a small rehype plugin adds the `/brine` base during the build.
- Images are imported through Astro's image pipeline, so local covers are resized and converted to modern formats at build time.

### Topics

Topics live in `src/data/topics.ts`. Each topic has a name, slug, number, short description, and longer introduction. Adding a new topic also requires adding its slug to the content schema enum and to the `getTopicCounts` initializer in `src/lib/articles.ts`.

## Design system

The visual language is defined as CSS custom properties in `src/styles/global.css`:

- **Light:** warm ivory paper, ink-green text, sea-glass accent.
- **Dark:** deep blue-green ground, softened ivory text, brighter sea-glass accent.
- **Type:** Fraunces for display, Newsreader for long-form reading, Inter for interface text. All three are self-hosted variable fonts from Fontsource.
- **Surfaces:** paper, raised paper, and a dark band for the announcement and selected editorial blocks.
- **Motion:** short, eased reveals and hover transitions; all decorative motion is disabled under `prefers-reduced-motion: reduce`.

Theme selection supports **System**, **Light**, and **Dark**. The preference is stored in `localStorage` under `brine-theme`; an inline boot script applies it before first paint to avoid a flash. When the preference is System, the site follows live `prefers-color-scheme` changes.

## Search, filtering, and interactions

- **Search** is a native `<dialog>` with a combobox-style input. The index is generated at `/brine/search.json`; scoring and snippet logic are shared in `src/lib/search.ts`. Results support arrow keys, Enter, Escape, and focus restoration. Open it with `/`, `Ctrl/Cmd + K`, the header button, or the footer link.
- **Journal filtering** is progressive enhancement. Topic links work without JavaScript via `?topic=`; with JavaScript, filtering updates in place and keeps the URL in sync without a reload.
- **Reading progress** appears on article pages after the reader begins scrolling and respects reduced motion.
- **Copy link** uses the Clipboard API with a `document.execCommand` fallback for older or restricted contexts. Success is announced through a polite live region.
- **Mobile navigation** uses a native `<details>` element, closes on outside click, Escape, link activation, and viewport changes, and restores focus to the summary on Escape.

## Routes and endpoints

Paths below are relative to the deployed base path, `/brine/`.

| Route | Description |
| --- | --- |
| `/` | Homepage, featured story, latest stories, topics |
| `/journal/` | Full journal with topic filtering |
| `/journal/[slug]/` | Article template with metadata, cover, prose, share, related stories |
| `/topics/` | Topic directory |
| `/topics/[topic]/` | Stories for one topic |
| `/archive/` | Chronological archive grouped by year and month |
| `/about/` | Publication point of view and colophon |
| `/404.html` | Custom not-found page |
| `/rss.xml` | RSS 2.0 feed of published stories |
| `/sitemap-index.xml` | Sitemap index |
| `/sitemap-0.xml` | Sitemap of indexable pages |
| `/robots.txt` | Crawler policy and sitemap pointer |
| `/search.json` | Static search index |

The build produces 19 pages, including eight articles, five topic pages, the topic index, journal index, archive, about, homepage, and a standalone `404.html` for GitHub Pages.

## SEO and metadata

`src/layouts/BaseLayout.astro` renders:

- canonical URLs derived from the configured site origin and base path
- page-specific titles and descriptions
- Open Graph and Twitter card metadata
- `WebSite`, `CollectionPage`, `Article`, and `BreadcrumbList` JSON-LD
- article published/updated times, author, section, and keywords
- a default 1200 × 630 social card at `/brine/og/brine-og.png`
- `noindex, nofollow` on the 404 page

The canonical origin and base path live in `src/config.ts`:

```ts
export const siteUrl = 'https://temidayoxyz.github.io';
export const basePath = '/brine';
export const repositoryUrl = 'https://github.com/temidayoxyz/brine';
```

Both `astro.config.ts` and the URL helpers in `src/lib/paths.ts` read from this file. To move to a custom domain, change `siteUrl` to the domain, set `basePath` to an empty string, update `public/og/brine-og.png`, and rebuild.

## Deployment

Deployment is automatic. Every push to `main` runs `.github/workflows/deploy.yml`, which:

1. installs dependencies with `npm ci`
2. runs `npm run check`
3. builds the site
4. uploads `dist/` as a Pages artifact
5. deploys it with GitHub's official Pages actions

The workflow requires **Settings → Pages → Build and deployment → Source** to be set to **GitHub Actions**. The site is published at:

```text
https://temidayoxyz.github.io/brine/
```

The base path is baked into the build, so no server rewrites are required. GitHub Pages serves `404.html` for unknown paths and preserves the directory-style trailing slashes used by Astro.

### Deploying from a local machine

```bash
npm ci
npm run check
npm run build
```

Then publish the contents of `dist/` to any static host that can serve the site from `/brine/`. If the host serves from the domain root instead, set `basePath` to an empty string before building.

## Verification

Checks are run against the production build served by `astro preview` and against the live GitHub Pages deployment.

- `npm run check`: 0 errors, 0 warnings, 1 TypeScript hint about the deprecated `document.execCommand` fallback.
- `npm run build`: successful; 19 pages and 88 optimized image variants.
- Route scan: all public routes and endpoints return HTTP 200; an unknown path returns the custom 404 page.
- Link scan: every internal link resolves under `/brine/`; no broken images after scrolling.
- Responsive scan: no horizontal overflow at 320, 375, 768, 900, 1024, or 1440 px.
- Browser checks: theme menu, light/dark/system switching, persistence, system preference changes, journal filtering and URL sync, search suggestions/results/keyboard selection/Enter navigation/Escape/focus restoration, copy-link and clipboard contents, reading progress, mobile menu, and the custom 404.
- Metadata checks: canonical, description, Open Graph, Twitter card, robots, JSON-LD, RSS item count and absolute links, sitemap contents (18 indexable URLs, no 404), robots sitemap pointer, search JSON record count, and the 1200 × 630 PNG dimensions.
- Console: no console errors or page errors on normal routes.

These checks do not replace testing on real devices or with screen readers.

## Accessibility and performance notes

- Semantic landmarks, a skip link, visible focus styles, and a logical heading order.
- Native dialog, details/summary, buttons, and links are used where possible.
- The mobile menu and theme menu support Escape and restore focus.
- Search results expose listbox/option semantics and an active descendant.
- Decorative marks are hidden from assistive technology; meaningful images have alt text.
- Motion is disabled or reduced under `prefers-reduced-motion`.
- Fonts are self-hosted and preloaded; images use Astro's responsive image pipeline.
- JavaScript is limited to small bundled modules for theme, search, filtering, progress, share, and menu behavior.

## Licensing and credits

- **Editorial content and brand:** © 2026 Brine. All articles are original writing created for this project. The “Brine Editorial” byline is a house name.
- **Photography:** sourced from Unsplash and Pexels and used under their respective licences. Individual credits are stored in each article's `coverCredit` frontmatter and shown with the cover caption.
- **Typefaces:** Fraunces, Newsreader, and Inter are distributed under the SIL Open Font License via Fontsource.
- **Code:** the application code in this repository is provided for the Brine project. No separate open-source licence is granted unless one is added.

Brine is a demonstration publication. Any resemblance to an existing magazine, its staff, or its issue numbering is coincidental.
