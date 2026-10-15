# Forest Cinema — Madhuban, Bihar

Single-file site for the hall. `index.html` carries all markup, styles and animation; the stills and clips live in `media/`.

The presentation is unchanged from the previous build: splash → intro film → the archive arranged as a rotating
globe you scroll into (on scroll the camera moves through the sphere and the caption floats at its centre), drag to
rotate, tap a card for the lightbox, and a grid view for the full set. All CSS and motion code are byte-identical to
that build — only the copy and the media changed.

## Run it

Serve it over HTTP (a plain `file://` open works too, but the browser then refuses the canvas downscale step):

```sh
cd <repo>
python3 -m http.server 8000 --bind 0.0.0.0
# http://localhost:8000/
```

No build step, no dependencies, no framework.

## Where the content comes from

Every image, line of copy, chapter label and credit was cloned from
[`gireeshkumarreddy/pk`](https://github.com/gireeshkumarreddy/pk) — the "They Call Him OG" presentation site — and
re-skinned for the hall:

- **`media/` — all 17 images** the source site ships: `OG002.jpg`, `OG007.webp`, `OG008.webp`, `OG009.webp`,
  `OG011.webp`, `OG013.webp`, `OG015.webp`, `OG016.jpg`, `og-dual-guns.jpg`, `og-portrait.jpg`,
  `og-title-original.webp`, `og-truck.jpg`, `omi.jpg`, `poster-4.jpg`, `poster-6.jpg`, `poster-9.jpg`, `yt-0.jpg`.
  They drive the globe, the grid and the lightbox — one entry each in the `SHOTS` array, in the order the source
  site shows them (orbit set first, portrait and title artwork last).
- **`media/video/` — all 5 MP4 loops** (`katana.mp4` is the entrance film, as in the source site; `entrance.mp4`,
  `firestorm.mp4`, `glasses.mp4`, `title.mp4` are kept as drop-in alternates — point `#film > src` at another to
  change the intro).
- **Copy** — the `SHOTS` titles, place labels and notes are the source site's own lines: the hero
  ("Some names become legends"), the manifesto ("A name buried in silence. A storm that never died."), the portrait
  scene ("The man. The myth. The storm."), the world bridge ("Silence has an expiry date"), the three chapter
  captions (Hungry Cheetah / Firestorm / official trailer) and the credits (`A FILM BY SUJEETH`,
  `MUSIC BY THAMAN S`, `DVV ENTERTAINMENT`). Frame descriptions come from the source repo's
  `docs/assets.json` / `docs/assets-update.json`.
- **Image handling** — the source PNGs are re-encoded to WebP (`OG009`, `og-title-original`) and every file is
  capped at 1400 px on its longest side, quality 82 (2.1 MB total instead of 7.0 MB). Nothing is upscaled and no
  crop was changed: the globe only ever displays ≤ 760 px and the lightbox plate ≤ 860 px, so the framing is the same.

## Site chrome copy (the hall)

Wordmark, splash tag, bio, colophon, menu and `<title>` are the venue's own: **Forest Cinema**, Madhuban, Bihar,
with *Holocaust* as the film now showing.

> The address pincode, the three show times and `bookings@forestcinema.in` are placeholders — they are not public
> record. Replace them in two places only: the `.bio` paragraph (show times) and `#menu .addr` (address, times,
> box-office contact).

## Editing

| Change | Where |
| --- | --- |
| Add / remove a still | `SHOTS` array in the `<script>` block (`id`, `title`, `place`, `note`, optional `tall:true`) |
| Swap an image | drop a file in `media/`, update its `id` |
| Venue name | `.wordmark`, `#splash .mark`, `<title>` |
| Current film | `#headline`, `#splash .tag`, `#intro > video` |
| Hall details | `.bio p`, `.colophon`, `#menu .addr` |

The sphere layout, count and card sizes are derived from `SHOTS.length` at runtime, so the archive can grow or
shrink without touching geometry code.

## Rights

Film imagery, title marks and music belong to their respective owners; the promotional material is republished here
from the source repo, whose `docs/` record the original source pages. This is an independent promotional page, not
an official release.
