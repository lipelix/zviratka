# zviratka

Animal sounds for small children: one animal per page, swipe between them, tap the
animal and it calls with a real recording while it moves. Five animals so far: cow
(alpine meadow), rooster (farmyard at sunrise), lion (savanna), wolf (winter night,
full moon), frog (pond). Vite + TypeScript, no framework, shipped as an offline PWA for
phones and tablets.

Live: https://lipelix.github.io/zviratka/ (GitHub Pages, deployed by `ci.yml` on every
push to `main` after the checks pass). The build uses relative URLs (`base: "./"`), so the
same `dist/` also serves from a host's root (Docker).

## Commands

```bash
npm run dev            # http://localhost:5173 (window.__player exposed in dev only)
npm run check          # prettier + eslint + tsc + vitest
npm run build          # dist/ with a generated sw.js (needs git or GAME_COMMIT)
npm run test:e2e       # Playwright: phone portrait/landscape, tablet, iPhone (WebKit), pwa (offline, in /zviratka/)
npm run pwa:icons      # re-render public/icons/*.png from icon.svg
docker build --build-arg GAME_COMMIT=$(git rev-parse --short HEAD) -t zviratka .
```

## Layout

- `src/animals.ts` the animals in page order: name, call text, theme colour, sound credit.
- `src/scenes/<id>.ts` one hand-written SVG per animal (1600×1000 view box, `slice`);
  `kit.ts` shared pieces (clouds, grass, stars, snow, eyes ...); `scenes.css` every
  animation, idle and calling (`.animal.is-calling[data-animal=...]`).
- `src/main.ts` pages in a CSS scroll-snap pager, tap vs swipe, arrows, dots, credits.
- `src/audio/player.ts` Web Audio playback (iOS: resume in the tap, `audioSession` playback).
- `public/sounds/<id>.mp3` recordings from Wikimedia Commons, trimmed and loudness
  normalised with ffmpeg; credits in `animals.ts`, shown in the info dialog.
- `src/pwa/` service worker generated at build time (`vite.config.ts`).

## Rules for changes

- Small children: one input (tap the animal), big targets, no text needed to play.
- The animal must stay fully in view on an upright phone and a wide phone: keep it in
  x 560–1040 and above y ≈ 760 of the view box (`game.spec.ts` checks it).
- New sounds: freely licensed recordings only (CC0, CC BY, CC BY-SA, public domain),
  credited in `animals.ts`. Not Google's animal sounds: they carry no licence.
- Only the page in view animates; keep added animations on `transform`/`opacity`.
