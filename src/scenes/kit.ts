import { between, seededRandom } from "../logic/rng";

/**
 * Shared pieces of the hand-written scenes. Every scene is one SVG in a 1600×1000 view
 * box, shown with `slice`: it fills any screen, and the animal stands in the middle
 * third (x 560–1040), which stays in view on an upright phone. Upright the full height
 * shows, on a wide phone only y ≈ 130–870: keep the ground line and the animal there.
 *
 * Moving parts get a class from `scenes.css`; per-element timing goes in through CSS
 * custom properties (`--d` duration, `--delay`, `--x` travel ...).
 */
export const W = 1600;
export const H = 1000;

export const f = (n: number): string => n.toFixed(1);

/** A `style` attribute from custom properties (numbers are seconds) plus optional plain CSS. */
export function vars(props: Record<string, string | number>, css = ""): string {
  const custom = Object.entries(props).map(
    ([k, v]) => `--${k}:${typeof v === "number" ? `${v.toFixed(2)}s` : v}`,
  );
  return `style="${[...custom, ...(css ? [css] : [])].join(";")}"`;
}

export function scene(
  id: string,
  label: string,
  defs: string,
  body: string,
): string {
  return `<svg class="scene scene-${id}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
<defs>${defs}</defs>
${body}
</svg>`;
}

/** A vertical gradient (horizontal with x2 = 1, y2 = 0) from [offset, colour, opacity?] stops. */
export const linear = (
  id: string,
  stops: [number, string, number?][],
  x2 = 0,
  y2 = 1,
): string =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(
      ([o, c, a]) =>
        `<stop offset="${o}" stop-color="${c}" stop-opacity="${a ?? 1}"/>`,
    )
    .join("")}</linearGradient>`;

export const radial = (
  id: string,
  stops: [number, string, number?][],
  cx = 0.5,
  cy = 0.5,
  r = 0.5,
): string =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(
      ([o, c, a]) =>
        `<stop offset="${o}" stop-color="${c}" stop-opacity="${a ?? 1}"/>`,
    )
    .join("")}</radialGradient>`;

/** Gaussian blur filter, for glows, haze and soft shadows. */
export const blur = (id: string, amount: number): string =>
  `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${amount}"/></filter>`;

/**
 * A soft cloud of overlapping ellipses that drifts across the sky, starting at `x`
 * (the drift runs from x = -300 to 1900 and wraps around).
 */
export function cloud(
  x: number,
  y: number,
  scale: number,
  duration: number,
  fill = "#fff",
  opacity = 0.95,
): string {
  const puffs = [
    [0, 0, 90, 46],
    [-80, 14, 70, 36],
    [85, 12, 76, 38],
    [-30, -30, 62, 46],
    [40, -26, 66, 44],
    [0, 26, 130, 30],
  ];
  return `<g class="drift" ${vars({ d: duration, delay: -duration * ((x + 300) / (W + 600)) })}>
  <g transform="translate(0 ${f(y)}) scale(${scale})" opacity="${opacity}">
    ${puffs.map(([dx, dy, rx, ry]) => `<ellipse cx="${dx}" cy="${dy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`).join("")}
    <ellipse cx="0" cy="34" rx="150" ry="16" fill="#000" opacity="0.05"/>
  </g></g>`;
}

/** Blades of grass along a line, each swaying at its own pace. */
export function grass(
  seed: number,
  count: number,
  x0: number,
  x1: number,
  y: number,
  height: [number, number],
  colours: readonly string[],
  spread = 18,
): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = between(rnd, x0, x1);
    const by = y + between(rnd, -spread, spread);
    const h = between(rnd, height[0], height[1]);
    const lean = between(rnd, -0.35, 0.35) * h;
    const w = between(rnd, 3, 7);
    const colour = colours[Math.floor(rnd() * colours.length)] ?? "#5a3";
    out += `<path class="sway" ${vars({ d: between(rnd, 2.6, 4.8), delay: -between(rnd, 0, 4), a: `${between(rnd, 2, 5).toFixed(1)}deg` })} d="M${f(x - w)} ${f(by)} Q${f(x + lean * 0.3)} ${f(by - h * 0.6)} ${f(x + lean)} ${f(by - h)} Q${f(x + lean * 0.4 + w * 0.4)} ${f(by - h * 0.55)} ${f(x + w)} ${f(by)} Z" fill="${colour}"/>`;
  }
  return out;
}

/** Twinkling stars in a band of the sky. */
export function stars(seed: number, count: number, y1: number): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const r = between(rnd, 0.8, 2.6);
    out += `<circle class="twinkle" ${vars({ d: between(rnd, 2, 5), delay: -between(rnd, 0, 5) })} cx="${f(between(rnd, 0, W))}" cy="${f(between(rnd, 0, y1))}" r="${f(r)}" fill="#fff"/>`;
  }
  return out;
}

/** Snow falling over the whole scene, in two depths. */
export function snow(seed: number, count: number): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const near = rnd() < 0.3;
    const r = near ? between(rnd, 3.5, 6) : between(rnd, 1.4, 3);
    const d = near ? between(rnd, 6, 9) : between(rnd, 11, 18);
    out += `<circle class="fall" ${vars({ d, delay: -between(rnd, 0, d), x: `${f(between(rnd, -60, 60))}px` })} cx="${f(between(rnd, 0, W))}" cy="-20" r="${f(r)}" fill="#fff" opacity="${near ? 0.9 : 0.65}"/>`;
  }
  return out;
}

/** A butterfly (or moth) fluttering along a loop. */
export function butterfly(
  x: number,
  y: number,
  colour: string,
  duration: number,
  scale = 1,
): string {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><g class="flutter-path" ${vars({ d: duration })}>
  <g class="wings-flap">
    <path d="M0 0 C-14 -22 -30 -14 -24 2 C-30 12 -14 20 0 4 Z" fill="${colour}"/>
    <path d="M0 0 C14 -22 30 -14 24 2 C30 12 14 20 0 4 Z" fill="${colour}"/>
    <circle cx="-14" cy="-6" r="3" fill="#fff" opacity=".8"/><circle cx="14" cy="-6" r="3" fill="#fff" opacity=".8"/>
  </g>
  <rect x="-1.6" y="-8" width="3.2" height="16" rx="1.6" fill="#3b2a20"/>
</g></g>`;
}

/** A bird flying across the sky from `x`, flapping. */
export function bird(
  x: number,
  y: number,
  scale: number,
  duration: number,
  colour = "#2b2420",
): string {
  return `<g class="drift" ${vars({ d: duration, delay: -duration * ((x + 300) / (W + 600)) })}><g transform="translate(0 ${y}) scale(${scale})"><path class="bird-flap" d="M-22 0 Q-11 -12 0 0 Q11 -12 22 0 Q11 -5 0 4 Q-11 -5 -22 0 Z" fill="${colour}"/></g></g>`;
}

/** An eye with a lid that blinks now and then. */
export function eye(
  x: number,
  y: number,
  r: number,
  lid: string,
  delay = 0,
  iris = "#2a1a10",
): string {
  return `<g>
  <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.05}" fill="#fff"/>
  <circle cx="${x + r * 0.12}" cy="${y + r * 0.08}" r="${r * 0.72}" fill="${iris}"/>
  <circle cx="${x + r * 0.12}" cy="${y + r * 0.08}" r="${r * 0.4}" fill="#000"/>
  <circle cx="${x - r * 0.18}" cy="${y - r * 0.3}" r="${r * 0.26}" fill="#fff"/>
  <ellipse class="blink" ${vars({ delay })} cx="${x}" cy="${y}" rx="${r * 1.12}" ry="${r * 1.15}" fill="${lid}"/>
</g>`;
}

/** The shadow an animal casts on the ground. */
export const shadow = (
  x: number,
  y: number,
  rx: number,
  ry: number,
  opacity = 0.25,
): string =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#1b1a10" opacity="${opacity}" filter="url(#soft)"/>`;
