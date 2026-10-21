// Only the Latin and Czech (latin-ext) subsets, woff2: a small offline cache.
import "./fonts.css";
import "./style.css";
import "./scenes/scenes.css";
import { ANIMALS, type Animal } from "./animals";
import { SoundPlayer } from "./audio/player";
import { pageAt, pageFromHash } from "./logic/pager";
import { registerServiceWorker } from "./pwa/register";
import { SCENES } from "./scenes";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("#app is missing from index.html");

const soundUrl = (id: string): string =>
  new URL(`sounds/${id}.mp3`, document.baseURI).href;
const player = new SoundPlayer(soundUrl);
const theme = document.querySelector<HTMLMetaElement>(
  'meta[name="theme-color"]',
);

app.innerHTML = `
<main class="pager" aria-roledescription="carousel" aria-label="Zvířátka">
  ${ANIMALS.map(
    (a, i) => `
  <section class="page" id="${a.id}" data-index="${i}" aria-roledescription="slide" aria-label="${a.name}, ${i + 1} z ${ANIMALS.length}">
    ${SCENES[a.id](`${a.name} ${a.home}`)}
    <h1 class="name">${a.name}</h1>
    <p class="call" aria-live="polite"></p>
  </section>`,
  ).join("")}
</main>
<button class="arrow prev" type="button" aria-label="Předchozí zvířátko"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M25 8 L13 20 L25 32"/></svg></button>
<button class="arrow next" type="button" aria-label="Další zvířátko"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M15 8 L27 20 L15 32"/></svg></button>
<nav class="dots" aria-label="Zvířátka">
  ${ANIMALS.map((a, i) => `<button type="button" data-go="${i}" aria-label="${a.name}"></button>`).join("")}
</nav>
<button class="info" type="button" aria-label="O aplikaci a autorech zvuků">i</button>
<dialog class="credits">
  <h2>Zvířátka</h2>
  <p>Ťukni na zvířátko a uslyšíš, jak dělá. Mezi zvířátky přejeď prstem.</p>
  <h3>Zvuky</h3>
  <ul>
    ${ANIMALS.map(
      (a) =>
        `<li><strong>${a.name}</strong>: <a href="${a.credit.source}" target="_blank" rel="noopener">nahrávka</a>, ${a.credit.author}, ${
          a.credit.licenceUrl
            ? `<a href="${a.credit.licenceUrl}" target="_blank" rel="noopener">${a.credit.licence}</a>`
            : a.credit.licence
        }</li>`,
    ).join("")}
  </ul>
  <p class="small">Nahrávky z Wikimedia Commons, zkrácené a zesílené. Obrázky nakresleny ručně.</p>
  <form method="dialog"><button type="submit">Zavřít</button></form>
</dialog>`;

const pager = app.querySelector<HTMLElement>(".pager");
const pages = [...app.querySelectorAll<HTMLElement>(".page")];
const dots = [...app.querySelectorAll<HTMLButtonElement>(".dots button")];
const dialog = app.querySelector<HTMLDialogElement>("dialog.credits");
const prev = app.querySelector<HTMLButtonElement>(".arrow.prev");
const next = app.querySelector<HTMLButtonElement>(".arrow.next");
if (!pager || !dialog) throw new Error("The page markup is incomplete");

let current = -1;

/** Marks the page in view: only its scene animates, the others are paused. */
function setCurrent(index: number): void {
  if (index === current) return;
  const previous = pages[current];
  if (previous) quiet(previous);
  current = index;
  pages.forEach((page, i) => page.classList.toggle("is-active", i === index));
  dots.forEach((dot, i) =>
    dot.setAttribute("aria-current", String(i === index)),
  );
  if (prev) prev.disabled = index === 0;
  if (next) next.disabled = index === pages.length - 1;
  const animal = ANIMALS[index];
  if (!animal) return;
  theme?.setAttribute("content", animal.theme);
  history.replaceState(null, "", `#${animal.id}`);
  // The neighbours' sounds load while this page is looked at.
  for (const near of [index - 1, index + 1]) {
    const a = ANIMALS[near];
    if (a) void player.preload(a.id).catch(() => undefined);
  }
}

function goTo(index: number, smooth = true): void {
  const target = Math.min(pages.length - 1, Math.max(0, index));
  pager?.scrollTo({
    left: target * pager.clientWidth,
    behavior: smooth ? "smooth" : "instant",
  });
}

/** Stops the sound and the call animation of a page that leaves the screen. */
function quiet(page: HTMLElement): void {
  player.stop();
  page.querySelector(".animal")?.classList.remove("is-calling");
  page.querySelector(".call")?.classList.remove("is-shown");
}

const timers = new WeakMap<HTMLElement, number>();

async function call(page: HTMLElement, animal: Animal): Promise<void> {
  const figure = page.querySelector<SVGGElement>(".animal");
  const bubble = page.querySelector<HTMLElement>(".call");
  if (!figure || !bubble) return;
  let seconds: number;
  try {
    seconds = await player.play(animal.id);
  } catch (error) {
    console.error(error);
    seconds = 1.5;
  }
  // Restart the animations: drop the class, force a style flush, add it again.
  figure.classList.remove("is-calling");
  bubble.classList.remove("is-shown");
  void figure.getBoundingClientRect();
  page.style.setProperty("--call", `${seconds.toFixed(2)}s`);
  figure.classList.add("is-calling");
  bubble.textContent = animal.call;
  bubble.classList.add("is-shown");
  window.clearTimeout(timers.get(page));
  timers.set(
    page,
    window.setTimeout(() => {
      figure.classList.remove("is-calling");
      bubble.classList.remove("is-shown");
    }, seconds * 1000),
  );
}

/** A tap beside the animal makes it wiggle: "here I am, tap me". */
function hint(page: HTMLElement): void {
  const figure = page.querySelector<SVGGElement>(".animal");
  if (!figure || figure.classList.contains("is-calling")) return;
  figure.classList.remove("is-hinted");
  void figure.getBoundingClientRect();
  figure.classList.add("is-hinted");
}

// A tap is a short press that did not move: a swipe must not make the animal call.
let press: { x: number; y: number; time: number } | null = null;
pager.addEventListener("pointerdown", (e) => {
  press = { x: e.clientX, y: e.clientY, time: e.timeStamp };
});
pager.addEventListener("pointerup", (e) => {
  const start = press;
  press = null;
  if (!start) return;
  const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
  if (moved > 12 || e.timeStamp - start.time > 700) return;
  const page = (e.target as Element).closest<HTMLElement>(".page");
  const animal = ANIMALS[Number(page?.dataset["index"])];
  if (!page || !animal) return;
  if ((e.target as Element).closest(".animal")) void call(page, animal);
  else hint(page);
});
pager.addEventListener("pointercancel", () => (press = null));

pager.addEventListener(
  "scroll",
  () => setCurrent(pageAt(pager.scrollLeft, pager.clientWidth, pages.length)),
  { passive: true },
);

prev?.addEventListener("click", () => goTo(current - 1));
next?.addEventListener("click", () => goTo(current + 1));
for (const dot of dots)
  dot.addEventListener("click", () => goTo(Number(dot.dataset["go"])));
app.querySelector(".info")?.addEventListener("click", () => dialog.showModal());

document.addEventListener("keydown", (e) => {
  if (dialog.open) return;
  if (e.key === "ArrowRight") goTo(current + 1);
  if (e.key === "ArrowLeft") goTo(current - 1);
  if (e.key === " " || e.key === "Enter") {
    const page = pages[current];
    const animal = ANIMALS[current];
    if (page && animal && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      void call(page, animal);
    }
  }
});

// Keep the same animal in view when the screen turns or the window resizes.
new ResizeObserver(() => goTo(current, false)).observe(pager);

// Background tab: no sound left playing.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) player.stop();
});

// Small fingers: no long-press menus, no pinch zoom.
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("gesturestart", (e) => e.preventDefault());

const start = pageFromHash(
  location.hash,
  ANIMALS.map((a) => a.id),
);
setCurrent(start);
goTo(start, false);
const first = ANIMALS[start];
if (first) void player.preload(first.id).catch(() => undefined);

if (import.meta.env.DEV) Object.assign(window, { __player: player });
registerServiceWorker();
