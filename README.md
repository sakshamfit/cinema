# Cinema — Concept Studio

A curated collection of six interactive landing-page concepts and the original Ethan Vale wildlife archive. The concept hub is the default page; the existing Cinema page is preserved as `public/cinema.html` and linked from the hub header.

## Run locally

```bash
npm ci
npm run dev
```

Vite starts at <http://localhost:5173>. To expose it in a hosted preview, run `npm run dev -- --host 0.0.0.0`.

## Pages

| Route | Concept | Interactive demo |
| --- | --- | --- |
| `/` | Concept Studio | Index of all six studies |
| `/sagewell` | AI reasoning model | Prompt composer, reasoning trace, API playground and cost estimator |
| `/vantline` | Decision-intelligence copilot | Insight deck, chart controls and plans toggle |
| `/tidings` | WhatsApp commerce | Clickable phone, campaign builder and wizard |
| `/emberpost` | People-first email | Interactive inbox, replies and keyboard shortcuts |
| `/creative-portfolio` | Ines Morrow, film editor | Scrubbable timeline and colour-grade comparison |
| `/maren-holt` | Maren Holt, book editor | Essay filters, search palette and reader |
| `cinema.html` | Original Cinema experience | Ethan Vale wildlife archive |

Each concept also loads directly and survives refresh. The original Cinema page is kept as a standalone static document so its existing interactions remain intact.

## Build

```bash
npm run build
npm run preview
```

For GitHub Pages under this repository's `/cinema/` base path:

```bash
BASE_PATH=/cinema/ npm run build:pages
```

The Vercel and Netlify rewrite files are retained for direct loading of client-side routes.

## Project structure

- `src/hub/` — index for the six concepts, with a link back to Cinema
- `src/sites/` — six independently styled React sites
- `src/shared/` — accessibility, route, and motion infrastructure
- `public/hub/` — concept thumbnails
- `public/cinema.html` — preserved original Cinema page
- `docs/briefs/` — design briefs
- `scripts/` — build, audit and interaction QA helpers

The shared motion system uses Lenis and GSAP/ScrollTrigger, with reduced-motion support. Product forms show validation and success states but do not send or store data; people, brands and metrics in the concepts are fictional sample content.
