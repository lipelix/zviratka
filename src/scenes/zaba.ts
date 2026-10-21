import {
  blur,
  butterfly,
  cloud,
  grass,
  linear,
  radial,
  scene,
  vars,
} from "./kit";
import { between, seededRandom } from "../logic/rng";

/** A marsh frog on a lily pad in a summer pond, reeds and willows around. */
export function zaba(label: string): string {
  const defs = [
    linear("z-sky", [
      [0, "#4aa3dd"],
      [0.6, "#a7d8ef"],
      [1, "#e2f3f4"],
    ]),
    linear("z-water", [
      [0, "#5d9e8f"],
      [0.25, "#3f8577"],
      [1, "#1f5a55"],
    ]),
    linear("z-bank", [
      [0, "#6fa548"],
      [1, "#4a7f34"],
    ]),
    linear("z-pad", [
      [0, "#5fae4a"],
      [1, "#3c8236"],
    ]),
    radial(
      "z-skin",
      [
        [0, "#9cd060"],
        [0.6, "#6faa3f"],
        [1, "#4c8a2e"],
      ],
      0.5,
      0.35,
      0.7,
    ),
    radial("z-eye", [
      [0, "#ffe27a"],
      [0.7, "#d9a520"],
      [1, "#8a6410"],
    ]),
    radial(
      "z-sac",
      [
        [0, "#f4f6ee"],
        [0.7, "#d9dccf"],
        [1, "#b9bdb0"],
      ],
      0.4,
      0.35,
      0.7,
    ),
    radial("z-sun", [
      [0, "#fffde8", 0.9],
      [1, "#fffde8", 0],
    ]),
    blur("soft", 6),
    blur("reflect", 5),
  ].join("");

  return scene(
    "zaba",
    label,
    defs,
    `
<rect width="1600" height="1000" fill="url(#z-sky)"/>
<circle cx="1400" cy="110" r="220" fill="url(#z-sun)"/>
${cloud(200, 130, 0.8, 170)}
${cloud(900, 90, 0.6, 210, "#fff", 0.9)}
${cloud(1300, 230, 0.5, 150, "#fff", 0.85)}

<!-- Trees on the far bank -->
<g id="z-trees">
  ${treeline(51)}
</g>
${willow(180, 640)}
<path d="M0 610 C300 596 600 604 900 600 C1200 596 1400 606 1600 600 L1600 660 L0 660 Z" fill="url(#z-bank)"/>
${grass(52, 140, 0, 1600, 640, [10, 26], ["#4a7f34", "#5d9440", "#3d6f2b"], 10)}

<!-- The pond -->
<rect y="640" width="1600" height="360" fill="url(#z-water)"/>
<g opacity=".28" filter="url(#reflect)" transform="translate(0 1280) scale(1 -1)">
  ${treeline(51)}
</g>
${shimmer(53, 46)}
${ripple(420, 760, 0)}${ripple(1180, 820, -1.6)}${ripple(980, 700, -2.8)}${ripple(260, 900, -0.9)}

${pad(300, 720, 0.9, -12)}
${pad(1300, 700, 0.75, 20)}
${pad(1160, 900, 1.1, 160)}
${pad(220, 940, 1.0, 40)}
${lily(1270, 690)}
${lily(330, 712)}

<!-- The frog's pad -->
<g transform="translate(0 -20)">
  <g class="bob" style="transform-origin:800px 780px">
    <ellipse cx="800" cy="796" rx="236" ry="56" fill="#174640" opacity=".35"/>
    <path d="M800 780 L1030 760 C1040 800 940 834 800 834 C640 834 556 806 566 770 C590 736 700 722 800 724 C880 724 960 730 1010 742 Z" fill="url(#z-pad)"/>
    <path d="M800 780 L640 760 M800 780 L700 820 M800 780 L900 826 M800 780 L940 744 M800 780 L760 728" stroke="#2f6a2b" stroke-width="3" opacity=".6"/>
    ${FROG}
  </g>
</g>

${reeds(54, 0, 220, 1000)}
${reeds(55, 1390, 1600, 1000)}
<g transform="translate(1100 470)"><g class="hover" ${vars({ d: 7 })}>${dragonfly()}</g></g>
<g transform="translate(560 420)"><g class="hover" ${vars({ d: 9, delay: -4 })}>${dragonfly("#e2574c")}</g></g>
${butterfly(1350, 540, "#fff3a8", 10, 0.8)}
`,
  );
}

function treeline(seed: number): string {
  const rnd = seededRandom(seed);
  let out = "";
  const colours = ["#3f7a3a", "#4f8a3f", "#356b34", "#5a9447"];
  for (let x = -40; x < 1660; x += between(rnd, 60, 110)) {
    const r = between(rnd, 60, 110);
    const y = 600 - r * between(rnd, 0.6, 1.0);
    const c = colours[Math.floor(rnd() * colours.length)] ?? "#3f7a3a";
    out += `<g class="sway" ${vars({ d: between(rnd, 5, 8), delay: -between(rnd, 0, 6), a: "0.7deg" })}>
      <rect x="${(x - 6).toFixed(0)}" y="${y.toFixed(0)}" width="12" height="${(600 - y).toFixed(0)}" fill="#4a3a28"/>
      <circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${c}"/>
      <circle cx="${(x - r * 0.4).toFixed(0)}" cy="${(y + r * 0.2).toFixed(0)}" r="${(r * 0.7).toFixed(0)}" fill="${c}"/>
      <circle cx="${(x + r * 0.45).toFixed(0)}" cy="${(y + r * 0.25).toFixed(0)}" r="${(r * 0.65).toFixed(0)}" fill="${c}"/>
      <circle cx="${(x - r * 0.25).toFixed(0)}" cy="${(y - r * 0.35).toFixed(0)}" r="${(r * 0.35).toFixed(0)}" fill="#fff" opacity=".08"/>
    </g>`;
  }
  return out;
}

/** A weeping willow, its long branches swaying. */
function willow(x: number, y: number): string {
  const rnd = seededRandom(56);
  let out = `<path d="M${x - 20} ${y} C${x - 10} ${y - 120} ${x - 30} ${y - 200} ${x} ${y - 300} C${x + 20} ${y - 200} ${x + 14} ${y - 120} ${x + 24} ${y} Z" fill="#5a4630"/>`;
  out += `<ellipse cx="${x}" cy="${y - 300}" rx="200" ry="90" fill="#6b9a3e"/>`;
  for (let i = 0; i < 26; i++) {
    const bx = x + between(rnd, -210, 210);
    const by = y - 300 + between(rnd, -40, 40);
    const len = between(rnd, 160, 280);
    out += `<path class="sway" ${vars({ d: between(rnd, 3.5, 6), delay: -between(rnd, 0, 4), a: "2.5deg" }, `transform-origin:${bx.toFixed(0)}px ${by.toFixed(0)}px;transform-box:view-box`)} d="M${bx.toFixed(0)} ${by.toFixed(0)} C${(bx + 10).toFixed(0)} ${(by + len * 0.4).toFixed(0)} ${(bx - 6).toFixed(0)} ${(by + len * 0.7).toFixed(0)} ${(bx + 4).toFixed(0)} ${(by + len).toFixed(0)}" stroke="${rnd() < 0.5 ? "#7fae4a" : "#5f8e36"}" stroke-width="${between(rnd, 10, 18).toFixed(0)}" stroke-linecap="round" fill="none"/>`;
  }
  return out;
}

function shimmer(seed: number, count: number): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const y = between(rnd, 660, 990);
    const w = 20 + ((y - 660) / 330) * 70;
    const x = between(rnd, 0, 1600);
    out += `<path class="shimmer" ${vars({ d: between(rnd, 2.5, 5), delay: -between(rnd, 0, 5) })} d="M${x.toFixed(0)} ${y.toFixed(0)} l${w.toFixed(0)} 0" stroke="#d8f3ec" stroke-width="${(1.5 + (y - 660) / 150).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return out;
}

const ripple = (x: number, y: number, delay: number): string =>
  `<ellipse class="ripple" ${vars({ d: 4, delay })} cx="${x}" cy="${y}" rx="70" ry="14" fill="none" stroke="#d8f3ec" stroke-width="3"/>`;

/** A floating lily pad with its notch. */
function pad(x: number, y: number, s: number, rotate: number): string {
  return `<g transform="translate(${x} ${y}) scale(${s} ${s * 0.32}) rotate(${rotate})">
  <path d="M0 0 L120 -20 A122 122 0 1 1 100 -70 Z" fill="url(#z-pad)"/>
  <path d="M0 0 L-80 60 M0 0 L-100 -30 M0 0 L40 100 M0 0 L-20 -110" stroke="#2f6a2b" stroke-width="6" opacity=".5"/>
</g>`;
}

/** A pink water lily. */
function lily(x: number, y: number): string {
  let petals = "";
  for (let i = 0; i < 8; i++) {
    const a = -150 + i * 17;
    petals += `<path d="M0 0 C-10 -20 -8 -44 0 -54 C8 -44 10 -20 0 0 Z" fill="${i % 2 ? "#f7b6cf" : "#fbd2e1"}" transform="rotate(${a + 60})"/>`;
  }
  return `<g transform="translate(${x} ${y})">${petals}<circle cx="0" cy="-6" r="9" fill="#ffd34d"/></g>`;
}

/** Bulrushes and reeds at the water's edge. */
function reeds(seed: number, x0: number, x1: number, y: number): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let i = 0; i < 18; i++) {
    const x = between(rnd, x0, x1);
    const h = between(rnd, 220, 420);
    const lean = between(rnd, -30, 30);
    const swayVars = vars({
      d: between(rnd, 3, 5),
      delay: -between(rnd, 0, 4),
      a: `${between(rnd, 1.5, 3).toFixed(1)}deg`,
    });
    if (rnd() < 0.45) {
      out += `<g class="sway" ${swayVars}>
        <path d="M${x.toFixed(0)} ${y} Q${(x + lean * 0.4).toFixed(0)} ${(y - h * 0.5).toFixed(0)} ${(x + lean).toFixed(0)} ${(y - h).toFixed(0)}" stroke="#4d7a2f" stroke-width="6" fill="none"/>
        <rect x="${(x + lean * 0.86 - 9).toFixed(0)}" y="${(y - h * 0.92).toFixed(0)}" width="18" height="${(h * 0.2).toFixed(0)}" rx="9" fill="#6b4226" transform="rotate(${(lean / 8).toFixed(1)} ${(x + lean).toFixed(0)} ${(y - h * 0.82).toFixed(0)})"/>
      </g>`;
    } else {
      out += `<path class="sway" ${swayVars} d="M${(x - 7).toFixed(0)} ${y} Q${(x + lean * 0.3).toFixed(0)} ${(y - h * 0.6).toFixed(0)} ${(x + lean * 1.4).toFixed(0)} ${(y - h * 1.05).toFixed(0)} Q${(x + lean * 0.5 + 4).toFixed(0)} ${(y - h * 0.55).toFixed(0)} ${(x + 7).toFixed(0)} ${y} Z" fill="${rnd() < 0.5 ? "#5f9440" : "#4d7a2f"}"/>`;
    }
  }
  return out;
}

function dragonfly(colour = "#3fa7d6"): string {
  return `<g>
  <g class="buzz"><ellipse cx="-4" cy="-14" rx="10" ry="32" fill="#e8f6ff" opacity=".6" transform="rotate(-70)"/><ellipse cx="4" cy="-14" rx="10" ry="32" fill="#e8f6ff" opacity=".6" transform="rotate(70)"/></g>
  <g class="buzz" style="animation-delay:-.03s"><ellipse cx="-4" cy="6" rx="8" ry="26" fill="#e8f6ff" opacity=".5" transform="rotate(-110)"/><ellipse cx="4" cy="6" rx="8" ry="26" fill="#e8f6ff" opacity=".5" transform="rotate(110)"/></g>
  <rect x="-4" y="-14" width="8" height="60" rx="4" fill="${colour}"/>
  <circle cx="0" cy="-18" r="7" fill="${colour}"/>
</g>`;
}

const FROG = `
<g class="animal" data-animal="zaba">
  <ellipse class="hit" cx="800" cy="650" rx="230" ry="180" fill="transparent"/>
  <!-- folded back legs and webbed feet -->
  <ellipse cx="672" cy="728" rx="72" ry="44" fill="#5c9a34"/>
  <ellipse cx="928" cy="728" rx="72" ry="44" fill="#5c9a34"/>
  <path d="M610 768 l-30 6 l26 4 l-24 14 l32 -6 l-4 18 l26 -26 Z M990 768 l30 6 l-26 4 l24 14 l-32 -6 l4 18 l-26 -26 Z" fill="#5c9a34"/>
  <g class="breathe" style="transform-origin:800px 770px">
    <path d="M690 760 C672 664 716 590 800 584 C884 590 928 664 910 760 C870 780 730 780 690 760 Z" fill="url(#z-skin)"/>
    <ellipse cx="800" cy="716" rx="76" ry="50" fill="#e9e6b4"/>
    <circle cx="730" cy="680" r="11" fill="#3e7426" opacity=".6"/><circle cx="878" cy="664" r="9" fill="#3e7426" opacity=".6"/><circle cx="862" cy="712" r="7" fill="#3e7426" opacity=".5"/>
  </g>
  <!-- front feet -->
  <path d="M748 730 C744 752 744 766 748 778 l-18 6 l20 2 l-8 10 l18 -8 l8 10 l2 -14 l6 -2 C762 760 762 744 758 730 Z" fill="#6faa3f"/>
  <path d="M852 730 C856 752 856 766 852 778 l18 6 l-20 2 l8 10 l-18 -8 l-8 10 l-2 -14 l-6 -2 C838 760 838 744 842 730 Z" fill="#6faa3f"/>
  <g class="head" style="transform-origin:800px 640px">
    <ellipse class="throat" cx="800" cy="652" rx="56" ry="18" fill="#dcdba4"/>
    <path d="M688 610 C680 560 730 534 800 534 C870 534 920 560 912 610 C904 646 860 660 800 660 C740 660 696 646 688 610 Z" fill="url(#z-skin)"/>
    <!-- vocal sacs, blown up from the corners of the mouth when it croaks -->
    <ellipse class="sac sac-left" cx="668" cy="620" rx="40" ry="34" fill="url(#z-sac)"/>
    <ellipse class="sac sac-right" cx="932" cy="620" rx="40" ry="34" fill="url(#z-sac)"/>
    <path d="M700 618 C740 642 860 642 900 618" stroke="#2f5a1d" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="784" cy="590" r="3.5" fill="#2f5a1d"/><circle cx="816" cy="590" r="3.5" fill="#2f5a1d"/>
    <path d="M760 566 C780 556 820 556 840 566" stroke="#a6d76a" stroke-width="6" fill="none" opacity=".7" stroke-linecap="round"/>
    ${frogEye(736, 540)}
    ${frogEye(864, 540)}
  </g>
</g>`;

function frogEye(x: number, y: number): string {
  return `<circle cx="${x}" cy="${y}" r="40" fill="#6faa3f"/>
  <circle cx="${x}" cy="${y - 2}" r="29" fill="url(#z-eye)"/>
  <ellipse cx="${x}" cy="${y - 2}" rx="17" ry="9" fill="#111"/>
  <circle cx="${x - 9}" cy="${y - 12}" r="6" fill="#fff" opacity=".9"/>
  <ellipse class="blink" ${vars({ delay: 0.4 })} cx="${x}" cy="${y - 4}" rx="34" ry="32" fill="#6faa3f"/>`;
}
