# Forest Cinema — Madhuban, Bihar

A cinema-hall site built as a **static port of [`gireeshkumarreddy/pk`](https://github.com/gireeshkumarreddy/pk)**
(the "They Call Him OG" presentation site). Every section, animation and line of that site is here — then the chrome
was re-skinned into the hall: Forest Cinema, Station Road, Madhuban, with *Holocaust* as the show now playing.

No framework, no build step, no dependencies to install.

```
index.html            the site (all sections, in the source's order)
assets/site.css       the source site's app/globals.css, verbatim + a small shim (below)
assets/site.js        the source app/page.tsx timeline + cinema-media + showcase, React -> plain DOM
assets/gsap.min.js    GSAP 3.15.0 (the source's pinned version), vendored from npm
assets/ScrollTrigger.min.js
media/                all 17 stills from the source repo
media/video/          all 5 MP4 loops from the source repo
sphere.html           the previous build (scroll-into-the-globe archive), kept as-is
favicon.svg           the source's red title tile, retyped FC for the hall
```

## Run

```sh
python3 -m http.server 8000 --bind 0.0.0.0    # or any static host
```

Serve it (not `file://`): the embedded players need an `origin`, and `?showcase=1` is a query param.

## What is a 1:1 copy of the source site

Verified mechanically, not by eye — see [Fidelity checks](#fidelity-checks):

- **Layout & motion.** All CSS rules are copied unchanged (`app/globals.css`). Intro red flash → circular camera
  exit through the opening panel → the 10-tile rotating archive mosaic around the spinning title mark → red crescent
  sweep → red field → manifesto → storm line → portrait-frame reveal with the rising mask → wide story bridge with
  clip-path parallax → the dark constellation that gathers into one panel → three cascading film chapters →
  end card with the drifting title media → scroll progress line and the tone-flipping header. Same selectors,
  same scrub values, same stagger, same easing, same 133/248 numbers.
- **Sections & copy**, in the source's order: hero ("Some names become legends."), manifesto ("A name buried in
  silence. A storm that never died."), storm line, portrait scene ("The man. The myth. The storm."), the world
  bridge ("Silence has an expiry date"), "A world in fragments", the three chapters (Hungry Cheetah / Firestorm /
  They Call Him OG) with their captions, the end card, credits and the rights line.
- **Media behaviour.** Poster image → bundled muted MP4 loop while the official YouTube excerpt loads → swap only
  after playback is *proven to be advancing* (3 samples), pause when off-screen/hidden/globally paused or when a
  film dialog opens, `--film-width/--film-height` cinema crop, start/end loop points, `onAutoplayBlocked`,
  poster fallback, `prefers-reduced-motion` static layout.
- **Overlays.** The chapter index sheet and the film dialog (Radix in the source) with the same classes,
  `data-slot` hooks, scroll lock, Escape-to-close and focus return.
- **`?showcase=1`.** The 55-second guided tour (monotone-cubic cue interpolation, waits for real moving footage)
  plus the optional `getDisplayMedia` recorder with MP4/WebM download.

### The one deliberate difference

The source is a Next.js app whose dialog/sheet are Radix primitives styled with Tailwind utilities. This port has no
React and no Tailwind, so `assets/site.css` ends with a small `static-port shim` block that re-declares exactly those
utilities (fixed positioning, the `-50%/-50%` centering, grid gap, sheet slide-in, dialog zoom, `.sr-only`, close
button) so the overlays compute the same way. Nothing else in the stylesheet was touched; the Tailwind
`@import`/`@theme`/`@custom-variant` lines are the only ones dropped.

## What makes it a cinema hall site

Venue copy in the hall's own slots, film copy left intact:

| Slot | Now reads |
| --- | --- |
| `header-film` | `FOREST CINEMA · MADHUBAN, BIHAR` |
| intro caption | `FOREST CINEMA · MADHUBAN` |
| hero eyebrow | `HOLOCAUST · NOW SHOWING AT FOREST CINEMA` |
| `wide-bottom` | show times + `SINGLE SCREEN · STATION ROAD, MADHUBAN` |
| films label | `FOREST CINEMA · SHOW TIMES` / `THREE SHOWS DAILY · ONE SCREEN` |
| chapter toplines | `FIRST SHOW · 10:00 AM` / `SECOND SHOW · 2:30 PM` / `FULL HOUSE · 7:00 PM` |
| end-card eyebrow | `FOREST CINEMA PRESENTS` |
| credits | the source's three credits + `TICKETS ₹60 · ₹100 — COUNTER ONLY` |
| legal | `FOREST CINEMA · STATION ROAD, MADHUBAN, BIHAR 848202` |
| index sheet | `THE FOREST CINEMA INDEX`, nav `The return / His world / Show times / Box office` |

> **Placeholders to confirm** — the pincode, the three show times and the ₹60/₹100 counter prices are not public
> record for this hall. They live in `index.html` (`.wide-bottom`, `.film-section-label`, `#menuRoot`, `.credits`,
> `.legal`) and in `films[].show` at the top of `assets/site.js`.

To make the marquee say the film's own title instead of *Holocaust*, edit those same lines: the film name appears
only as text, the mark itself is the source's title artwork (`media/og-title-original.webp`).

## Editing

| Change | Where |
| --- | --- |
| Show times / prices / address | table above + `films[].show` in `assets/site.js` |
| The three chapters (title, subtitle, poster, YouTube id, show) | `films` array at the top of `assets/site.js` |
| Rotating archive (10 tiles) | `orbitImages` in `assets/site.js` |
| Constellation tiles | `constellationImages` in `assets/site.js` |
| Intro clip per chapter | automatic (`katana` / `entrance` / `firestorm` by video id, as in the source) |
| Colours | `:root` at the top of `assets/site.css` (`--red`, `--paper`, `--ink`) |
| Motion | the timeline in `assets/site.js` — 1:1 with the source, so diff before changing |

`media/omi.jpg`, `poster-4.jpg`, `poster-6.jpg`, `poster-9.jpg` and `yt-0.jpg` ship in the source repo but are not
used by its page, so this port does not use them either — `sphere.html` does, in case you want that page kept.

## Fidelity checks

Commands used to verify the port (all from the repo root, with the source repo cloned beside it):

1. **CSS** — `assets/site.css` = `app/globals.css` minus 4 Tailwind at-rules, plus the shim block.
2. **Animation** — every class the source animates resolves in the port (39/39); the numeric values across the whole
   animation block match as a multiset (248/248); all ScrollTrigger `start`/`end`/`scrub` pairs match; the only
   literal differences are four `document.querySelector(".x")` → `getElementById` lookups for the same elements.
3. **Assets** — every `/media/…` reference in the source page resolves to a file in `media/` (12 of them; 17 kept).
4. **Runtime** — a jsdom harness (fake YouTube player, IntersectionObserver/ResizeObserver stubs) loads the built
   page with no script errors: 10 tiles positioned with `data-x/data-y` and the GSAP `scale: 2.1` pre-state,
   5 constellation tiles, 3 chapters, 6 media panels all reaching `data-playing="true"`, menu open/close,
   dialog open with the right embed URL and background media paused, resume on close, global pause label toggling
   to `PLAY MOTION`, and `?showcase=1` starting the tour.

Images are the source repo's files re-encoded for the web (≤1400 px, quality 82; the two PNGs → WebP), so the logo's
crop stays mathematically identical: `og-title-original.webp` keeps its 2375×1619 aspect ratio (1399×954) and alpha.
To swap in untouched originals, drop the file in `media/` and update its name in `index.html` / `assets/site.js`.

## Rights

Film imagery, title marks and music belong to their respective owners; the promotional material is republished here
from the source repo, whose `docs/` record the original source pages. This is an independent promotional page for the
hall, not an official release.
