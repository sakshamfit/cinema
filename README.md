# Arush Cineplex — Madhuban, Bihar

The hall's site. Built as a **static port of [`gireeshkumarreddy/pk`](https://github.com/gireeshkumarreddy/pk)** —
that site's layout, stylesheet, scroll choreography, media behaviour and copy — then re-cast as a cinema: the mark is
the house's own **AC**, the film on the screen is **Holocaust**, and after the show half the page turns into the hall
itself (what the building is, the week's board, the counter, house rules, how to get here).

No framework, no build step, no installs — five static pages sharing one stylesheet and one script.

```
index.html                   the show — 12 sections, film half then hall half
about.html                   the complex in brief: what it is, what it has, what it is not
hall.html                    the room: the stage, the two loops, the booth, the seats
shows.html                   the week: the board, the counter, how the house fills
visit.html                   coming: the walk, the door, the house rules
assets/site.css              the source site's app/globals.css, verbatim, + a shim + the hall additions
assets/site.js               app/page.tsx + cinema-media.tsx + showcase-controller.tsx + lib/* ported to plain DOM
assets/gsap.min.js           GSAP 3.15.0 — the source's pinned version, vendored from npm
assets/ScrollTrigger.min.js
media/                       all 17 stills from the source repo (every one is used)
media/video/                 all 5 MP4 loops (every one is used)
sphere.html                  the earlier build (scroll-into-the-globe archive), same branding applied
favicon.svg                  the source's red tile, retyped AC
```

```sh
python3 -m http.server 8000 --bind 0.0.0.0     # or any static host
```

Serve it rather than opening `file://` — the embedded players need an `origin` and `?showcase=1` is a query param.

## The pages

| File | What it carries |
| --- | --- |
| `index.html` | the whole thing — the scroll sequence, the film, then the hall in summary |
| `about.html` | the complex in brief: what Arush Cineplex is, what it has, what it does not offer |
| `hall.html` | the room — the two loops, the five frames, the eight specs, the booth |
| `shows.html` | the week board, the counter, the small print, how the house fills |
| `visit.html` | the walk from the station, what happens at the door, the 8 house rules |
| `sphere.html` | the earlier build, kept as an archive page (own inline script, not this CSS/JS) |

Every page carries the same chrome: the fixed header with the page nav (`.site-nav`, five links, `aria-current` on
the live one, folded away below 900px), the red index sheet (this page's chapters, then **THE OTHER PAGES**), the
film dialog, `PAUSE FILMS`, the progress line and the closing footer. There is no templating step, so that chrome
is duplicated per page deliberately and the harness below checks that no page has drifted.

## The index page, section by section

| # | Section | What it is |
| --- | --- | --- |
| 1 | `#home` `.journey` | The source's scroll sequence, unchanged: red intro flash → circular camera exit through the opening panel → the 10-tile archive mosaic rotating around the spinning mark → red crescent sweep → red field → manifesto → storm line → portrait reveal with the rising mask |
| 2 | `#about` | **Added.** What this page is: the show above, the house below, in three numbered blocks |
| 3 | `#story` `.wide-scene` | The full-screen bridge with clip-path parallax — "And then, there was Holocaust." |
| 4 | `#world` | The dark constellation of five tiles that gathers into one panel |
| 5 | `#films` | Three cascading chapters — The Feature, The Sound, The Trailer — each with its show time in the topline and the official clip in the panel |
| 6 | `#end` `.end-card` | The source's red end card: the mark, the drifting title media, trailer CTA, house credits, address and rights line |
| 7 | `#hall` | **Added.** What the hall is: two full-bleed loops (`title.mp4`, `glasses.mp4`), five frames with captions, eight spec rows |
| 8 | `#schedule` | **Added.** The week: seven day columns × three shows, house-full marks, "TODAY" on the live column |
| 9 | `#counter` | **Added.** Prices, and the small print about how tickets are actually sold here |
| 10 | `#house` | **Added.** House rules as an 8-item accordion (`<details>`, styled like the index sheet's list) |
| 11 | `#visit` | **Added.** Getting here: the walk from the station, auto rate, parking, counter hours, and a directions link |
| 12 | `#thanks` | **Added.** Closing mark, the hall in one paragraph, the site index, provisional-data disclaimer |

Everything new uses the source's own vocabulary — `--red / --paper / --ink`, the 12px `letter-spacing:.11em` micro
labels with a `1px solid #48423f` rule above them, `clamp()` display type at negative tracking, `#c1bab3` body copy,
`aspect-ratio:1.7` media tiles with a slight rotation, and `fromTo` + `scrub` reveals at the same durations and
easings. The `PAUSE FILMS` control pauses the new clip too, since it is a `.cinema-media` panel like the others.

## Footer type

The footer was the source's own 9px `letter-spacing:.07em` micro-row — unreadable at that size on `--ink`. It now
speaks the same voice as the sections above it: `.legal` and `.credits` are **12px** with `.06em`/`.10em` tracking
and `line-height:1.75`, the closing note is **15px** in the site's body grey (`#c1bab3`, the colour `.hall-note`
uses), and the footer's navigation rows are **13px** in that same face with a `→` at the end of each row. The
closing block also gained a real heading (`Arush Cineplex, in brief.` in `.hall-title`) so it reads as a section of
the site and not as fine print, and its two columns split this page's anchors from the other pages. Mobile keeps a
smaller step (11px legal, 12px rows); nothing on the page is below 10.5px. All of it is appended in the
`PAGE ADDITIONS` block at the end of `assets/site.css` — nothing earlier in that file was edited.

## Branding decisions taken

- **`OG` is gone.** No "OG", no film-title artwork, no star/director attribution anywhere in the visible copy: the
  brush `og-title-original.webp` mark was replaced by the source's own **text wordmark** (`Arial italic 950`,
  `letter-spacing:-.13em`, the `.wordmark-cut` slash) reading **AC**, and the film-name lines became the hall's.
  The `.wordmark` CSS needed one adaptation — `overflow:visible` instead of `hidden`, so the text isn't cropped the
  way the image was — and `.intro-mark` gets `color:var(--paper)` because the text mark can't inherit the artwork's
  own colours. All eight marks sit in the source's existing slots (intro, header, centre, hero, end card, car title,
  index sheet, closing).
- **The footage is still the source's.** Three official YouTube ids (`7Y5q41D8_hs`, `FbXOsVByKmk`, `_8J8LwoVH_0`)
  and five bundled loops, all from the cloned repo — `katana`/`entrance`/`firestorm` on the film panels,
  `title` and `glasses` on the hall panels. All 5 loops and 16 of the 17 stills are used by this page; the one
  the page drops is `og-title-original.webp` — the artwork spells the old film's name, so it survives only in
  `sphere.html`, where it is still one of the archive cards.

## Hall data — placeholders to confirm

**None of this is public record for this hall; it is realistic filler, and the page says so** (`SHOW TIMES, PRICES
AND SEATS ON THIS PAGE ARE PROVISIONAL — THE COUNTER DECIDES.`). Replace it in these spots:

| Value | Where |
| --- | --- |
| 620 seats / 380 stall / 240 balcony, 9.1 m × 4.7 m screen, 4K laser, Dolby 7.1, 12-min interval, out by 10:00 PM | `hallFacts` in `assets/site.js` |
| ₹60 balcony, ₹100 stall, ₹40 Tuesday, ₹50 group, student half rate | `priceFacts` |
| Show times 10:00 / 2:30 / 7:00 and which shows are full | `weekShows`, plus `.wide-bottom`, `.film-section-label`, `films[].show` |
| Address, 400 m from the station, ₹20 auto, 40 two-wheeler parking | `visitFacts` + `#visit` copy |
| House rules and answers | `houseFaq` |
| Everything else in prose | `index.html` (`.hall-note`, `.credits`, `.legal`, `#thanks`) |

Add a `tel:` link to the counter when there is one — deliberately absent for now.

## Fidelity checks (mechanical, not by eye)

1. **Copied CSS** — every rule of `app/globals.css` is present in `assets/site.css` (0 source rules missing); the
   only removals are the 4 Tailwind at-rules, and everything after the `static-port shim` / `HALL ADDITIONS` markers
   is new, appended, never edited in place.
2. **Cloned timeline** — of the source animation block's **259 numeric values, none are missing or changed** in the
   port; the only extra values are three `75`s from the two header-tone lines extended for the new dark sections
   (so the header stays legible over `#about` and after the end card). The one structural change is that the whole
   journey sequence now sits inside `if (document.getElementById('home')) { … }`, so the secondary pages can load the
   same script without the scroll sequence — and `host()` returns a detached node when a page has no `#scheduleGrid`
   or `#hallTiles`, which is what keeps one script shared by five pages. All 39 classes the animation targets
   resolve, and every ScrollTrigger `start`/`end`/`scrub` pair matches.
3. **Runtime** — a jsdom harness (fake YouTube API, IO/RO stubs) loads the built page with no script errors:
   10 mosaic tiles, 5 constellation tiles, 3 chapters, 7 media panels all reaching `data-playing`, the hall's
   local-only clip correctly reporting `data-media-state="local"` with no iframe mounted, 5 tiles + 8 + 5 + 6 fact
   rows, 7 schedule columns × 3 shows with `TODAY` on the live column, 8 accordion items, 8 index-sheet entries;
   sheet opens and closes on nav select with the scroll lock released, dialog opens on the right embed URL and
   pauses background clips, Escape closes both, skip-link target exists.
4. **Reduced motion** — same harness with `prefers-reduced-motion` on: nothing is left at `opacity:0`, the intro is
   dropped immediately, all 8 panels still render their posters, no errors.
5. **Every page** — the five pages are loaded one at a time in the same harness: zero script errors, the index sheet
   builds this page's chapters from its `data-sheet` sections plus four page links, the JS-filled hosts land (19
   fact rows / 5 tiles / 7×3 schedule / 8 rules on the index, and only the right subset on each page), local-only
   panels reach `data-media-state="local"` with a `<video>` and no iframe, nothing is left stuck hidden, and every
   relative `href` in every page resolves to a file that exists.
6. **Copy** — a scan for `OG`, the film's title, the star/director/composer names and the old venue name across
   `index.html`, `sphere.html`, `assets/*` and `favicon.svg` returns nothing but asset filenames.

## Editing

| Change | Where |
| --- | --- |
| Hall name / mark letters | `index.html` (8 `.wordmark` spans + text slots) and `favicon.svg` |
| The film being shown | `films[]` at the top of `assets/site.js`, plus the hero eyebrow and `#about` copy |
| Show times, prices, specs, rules | the placeholder table above |
| New fact row or schedule cell | the arrays at the top of `assets/site.js` — they render into the existing markup |
| Another local-only panel | `<div class="cinema-media hall-clip" data-image="…" data-clip="glasses">` — no `data-id` means no YouTube mount |
| Motion | the timeline in `assets/site.js`. The film half is 1:1 with the source — diff against `app/page.tsx` before changing it |
| Footer / nav type | the `PAGE ADDITIONS` block at the end of `assets/site.css` (`.legal`, `.credits`, `.closing-*`, `.site-nav`) |
| Add a page | copy the chrome from `hall.html`, put `data-sheet="Label"` on each `<section>` that should appear in the index sheet, then add the file to `PAGES` (top of `assets/site.js`) and to the `.site-nav` + `THE OTHER PAGES` lists in all six pages |

## Rights

Film imagery, music and trailers belong to their respective owners; the stills, loops and YouTube ids are
republished from the source repo, whose `docs/` record the original source pages. This is the hall's own promotional
page, not an official release of any film.
