# Rahma & Kamel — Engagement Invitation

A mobile-first digital invitation. Plain HTML5, CSS3 and vanilla JavaScript,
ready to drop straight onto GitHub Pages.

## Everything you need to edit

Open `js/script.js`. The first block is the only thing you normally touch:

```js
const invitationData = {
  brideName: "Rahma",
  groomName: "Kamel",
  initials:  "R & K",

  date:        "2026-10-07T19:00:00",   // countdown target
  displayDate: "October 7, 2026",
  time:        "7:00 PM",

  hallName: "[HALL NAME]",
  location: "[LOCATION]",
  mapsUrl:  "https://maps.google.com/?q=Cairo",

  envelopeImage: "images/envelope.jpg",
  coupleImage:   "images/couple.jpg",
  secondImage:   "images/photo2.jpg",
  music:         "audio/music.mp3"
};
```

## Swapping the photos

Replace `images/couple.jpg` and `images/photo2.jpg` with your own.
Portrait orientation works best — they are cropped to a 4:5 arch.
Around 1200 x 1500 px is plenty; anything larger just slows the page down.

`images/envelope.jpg` is the embossed burgundy paper. Every envelope layer
(body, front pocket, flap) uses this one image, so if you swap it, use a
seamless all-over texture with no text and no initials — the monogram is
HTML on top and stays editable.

## Music

Drop an mp3 at `audio/music.mp3`. It never autoplays; the floating button
starts it. If the file is missing the button does nothing rather than erroring.
Set `music: ""` to hide the button.

## Publishing on GitHub Pages

1. Push this folder to a repository.
2. Settings → Pages → Source: `main` branch, `/root`.
3. Your invitation is live at `https://<username>.github.io/<repo>/`.

Image paths are **relative** (`images/...`, not `/images/...`) on purpose.
A leading slash looks at the domain root and breaks on project pages.

## How the envelope works

Four stacked layers share the same texture at the same size and position, so
the pattern runs continuously across the folds:

| Layer | Role |
|---|---|
| `.env-body` | the sheet; a dark gradient reads as the inside |
| `.env-card` | the ivory card, parked below the pocket's V so it is invisible |
| `.env-pocket` | the front, clipped so two diagonal seams meet in the middle |
| `.env-flap` | the triangle that opens, `transform-origin: top center` |

The seams are visible only through lighting — the flap is fractionally lit and
casts a shadow, the pocket sits fractionally in shade. On tap: hint fades,
the monogram seal scales away, the flap swings to `rotateX(177deg)`, the card
rises through the opening, the envelope floats off and the invitation fades in.
Roughly 3 seconds, cut to under 1 second for anyone who has reduced motion on.
