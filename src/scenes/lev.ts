import {
  bird,
  blur,
  cloud,
  eye,
  grass,
  linear,
  radial,
  scene,
  shadow,
  vars,
} from "./kit";
import { between, seededRandom } from "../logic/rng";

/** A lion on a rock in the African savanna, late afternoon, giraffes far away. */
export function lev(label: string): string {
  const defs = [
    linear("l-sky", [
      [0, "#5ea6d6"],
      [0.4, "#a9cfe0"],
      [0.62, "#f5dca6"],
      [0.7, "#f7cf8a"],
    ]),
    radial("l-sun", [
      [0, "#fffbe8", 1],
      [0.18, "#fff1c0", 0.95],
      [0.5, "#ffe2a0", 0.3],
      [1, "#ffe2a0", 0],
    ]),
    linear("l-plain-far", [
      [0, "#c9b07a"],
      [1, "#b89a5e"],
    ]),
    linear("l-plain", [
      [0, "#d6ad5c"],
      [0.5, "#c49343"],
      [1, "#a2752f"],
    ]),
    linear("l-haze", [
      [0, "#fbe7bf", 0],
      [0.5, "#fbe7bf", 0.75],
      [1, "#fbe7bf", 0],
    ]),
    linear("l-rock", [
      [0, "#b9a48a"],
      [0.5, "#9a8468"],
      [1, "#6e5b45"],
    ]),
    linear("l-fur", [
      [0, "#e9bb6e"],
      [0.6, "#d39a4c"],
      [1, "#b07a36"],
    ]),
    radial(
      "l-mane",
      [
        [0, "#b4652a"],
        [0.6, "#93501f"],
        [1, "#6a3613"],
      ],
      0.62,
      0.55,
      0.6,
    ),
    blur("soft", 6),
    blur("haze-blur", 3),
  ].join("");

  return scene(
    "lev",
    label,
    defs,
    `
<rect width="1600" height="1000" fill="url(#l-sky)"/>
<circle class="pulse-glow" ${vars({ d: 7 })} cx="380" cy="300" r="300" fill="url(#l-sun)"/>
<circle cx="380" cy="300" r="66" fill="#fffbea"/>
${cloud(900, 140, 0.7, 220, "#fff", 0.6)}
${cloud(1450, 230, 0.5, 260, "#fff", 0.5)}
${bird(1000, 210, 1.5, 70, "#3a2a1c")}
${bird(1080, 250, 1.1, 70, "#3a2a1c")}

<!-- Mountain far away, in the haze -->
<path d="M980 600 L1180 420 C1205 400 1235 400 1260 420 L1460 600 Z" fill="#b8b6b4" opacity=".55"/>
<path d="M1150 448 L1180 420 C1205 400 1235 400 1260 420 L1290 448 C1265 440 1245 452 1220 444 C1195 452 1175 440 1150 448 Z" fill="#fbfaf6" opacity=".8"/>

<g class="heat" ${vars({ d: 2.6 })}>
  <path d="M0 600 C300 590 700 598 1000 594 C1300 590 1450 600 1600 596 L1600 700 L0 700 Z" fill="url(#l-plain-far)"/>
  ${acacia(250, 610, 1.2)}
  ${acacia(1330, 612, 0.75)}
  ${acacia(1480, 618, 0.5)}
  ${acacia(80, 618, 0.55)}
  <g class="drift" ${vars({ d: 420, delay: -150 })}>${giraffe(0, 612, 0.55)}${giraffe(90, 616, 0.42)}</g>
  <g class="drift" ${vars({ d: 520, delay: -390 })}>${zebras(0, 640)}</g>
</g>
<rect x="0" y="560" width="1600" height="110" fill="url(#l-haze)"/>

<path d="M0 660 C320 640 640 655 960 650 C1250 645 1420 660 1600 650 L1600 1000 L0 1000 Z" fill="url(#l-plain)"/>
${grass(41, 220, 0, 1600, 690, [20, 46], ["#c9a04a", "#b98d3a", "#dcb860", "#a77c2f"], 30)}

<!-- The rock and the lion -->
<g transform="translate(800 700) scale(.92) translate(-839 -728)">
  <path d="M520 780 C540 730 640 720 800 722 C960 720 1080 730 1100 790 C1120 860 1080 920 990 930 L620 930 C540 920 500 850 520 780 Z" fill="url(#l-rock)"/>
  <path d="M560 760 C640 740 900 738 1060 760" stroke="#cbb79c" stroke-width="7" fill="none" opacity=".7"/>
  <path d="M700 830 C760 820 820 840 860 830 M900 880 C950 870 1000 880 1030 870" stroke="#5e4c39" stroke-width="5" fill="none" opacity=".5"/>
  ${shadow(800, 748, 230, 14, 0.35)}
  ${LION}
</g>

${grass(42, 160, 0, 1600, 940, [50, 110], ["#c9a04a", "#b98d3a", "#dcb860", "#e3c470"], 60)}
`,
  );
}

/** A flat-topped acacia. */
function acacia(x: number, y: number, s: number): string {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#4f4a2a">
  <path d="M-6 0 L-4 -80 L-40 -130 L-34 -134 L0 -96 L30 -140 L36 -136 L6 -84 L6 0 Z"/>
  <ellipse cx="-30" cy="-150" rx="90" ry="22"/><ellipse cx="40" cy="-146" rx="80" ry="20"/><ellipse cx="0" cy="-166" rx="70" ry="18"/>
</g>`;
}

function giraffe(x: number, y: number, s: number): string {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#6a5434">
  <path d="M0 0 L4 -70 L-2 -70 Z M30 0 L32 -70 L26 -70 Z M60 0 L58 -70 L52 -70 Z M80 0 L78 -70 L72 -70 Z"/>
  <path d="M-6 -66 C-6 -96 40 -100 86 -90 C96 -84 92 -66 84 -64 L0 -60 Z"/>
  <path d="M74 -88 L118 -190 L132 -186 L92 -80 Z"/>
  <path d="M112 -196 C120 -206 146 -204 152 -196 L148 -188 C136 -186 124 -186 114 -184 Z"/>
  <path d="M120 -200 L118 -212 M128 -202 L128 -214" stroke="#6a5434" stroke-width="3"/>
</g>`;
}

function zebras(x: number, y: number): string {
  const one = (
    dx: number,
    s: number,
  ): string => `<g transform="translate(${x + dx} ${y}) scale(${s})">
    <path d="M0 0 L2 -36 M14 0 L14 -36 M40 0 L40 -36 M52 0 L50 -36" stroke="#3a3530" stroke-width="5"/>
    <path d="M-4 -34 C-4 -54 56 -56 60 -36 C60 -28 50 -26 40 -28 L4 -28 Z" fill="#e9e3d6"/>
    <path d="M10 -52 L8 -30 M22 -54 L20 -30 M34 -54 L32 -30 M46 -50 L44 -30" stroke="#3a3530" stroke-width="4"/>
    <path d="M56 -44 L78 -66 L88 -58 L66 -36 Z" fill="#e9e3d6"/>
    <path d="M62 -50 L72 -42 M68 -56 L78 -48" stroke="#3a3530" stroke-width="3"/>
  </g>`;
  return one(0, 0.6) + one(70, 0.55) + one(150, 0.62);
}

/** The shaggy mane around the head: scalloped tufts in two layers, darker inside. */
function mane(cx: number, cy: number, r: number): string {
  const rnd = seededRandom(77);
  const ring = (radius: number, tufts: number, fill: string): string => {
    const at = (a: number, rr: number): string =>
      `${(cx + Math.cos(a) * rr * 1.08).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    let d = `M${at(0, radius * 0.86)}`;
    for (let i = 0; i < tufts; i++) {
      const a0 = (i / tufts) * Math.PI * 2;
      const a1 = ((i + 1) / tufts) * Math.PI * 2;
      const tip = (a0 + a1) / 2 + between(rnd, -0.04, 0.08);
      d += ` Q${at(tip, radius * between(rnd, 1.12, 1.3))} ${at(a1, radius * between(rnd, 0.84, 0.92))}`;
    }
    return `<path d="${d} Z" fill="${fill}"/>`;
  };
  return (
    ring(r, 26, "#7a3f17") +
    ring(r * 0.9, 22, "url(#l-mane)") +
    ring(r * 0.72, 18, "#a85a24")
  );
}

const leg = (x: number, top: number, fill: string, toe = "#b07a36"): string => `
  <path d="M${x} ${top} C${x + 8} ${top - 6} ${x + 40} ${top - 6} ${x + 46} ${top} L${x + 42} 724 L${x + 4} 724 Z" fill="${fill}"/>
  <ellipse cx="${x + 26}" cy="728" rx="28" ry="14" fill="${fill}"/>
  <path d="M${x + 16} 734 l0 -8 M${x + 26} 736 l0 -9 M${x + 36} 734 l0 -8" stroke="${toe}" stroke-width="3" stroke-linecap="round"/>`;

const LION = `
<g class="animal" data-animal="lev">
  <ellipse class="hit" cx="820" cy="560" rx="290" ry="230" fill="transparent"/>
  ${leg(668, 600, "#c48a42")}
  ${leg(900, 600, "#c48a42")}
  <g class="tail" style="transform-origin:640px 560px">
    <path d="M640 560 C600 590 586 650 600 700 C610 730 600 750 588 760" stroke="#d39a4c" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M590 748 C570 750 566 780 580 790 C600 796 612 774 600 754 Z" fill="#5b2f12"/>
  </g>
  <g class="breathe" style="transform-origin:800px 660px">
    <path d="M640 566 C636 520 700 496 800 500 C880 498 940 516 950 560 C960 612 936 648 904 656 L704 658 C664 658 642 626 640 566 Z" fill="url(#l-fur)"/>
    <path d="M690 640 C760 660 860 660 920 640" stroke="#f3d9a8" stroke-width="16" fill="none" opacity=".55" stroke-linecap="round"/>
    <path d="M720 540 C760 530 820 532 860 548" stroke="#b07a36" stroke-width="5" fill="none" opacity=".35"/>
  </g>
  ${leg(628, 604, "#d8a456")}
  ${leg(860, 604, "#d8a456")}
  <g class="head" style="transform-origin:930px 560px">
    <g class="mane" style="transform-origin:950px 520px">
      ${mane(950, 520, 118)}
      <path d="M870 600 C880 640 910 660 940 650 C920 630 900 610 890 590 Z" fill="#7a4018"/>
    </g>
    <circle cx="952" cy="440" r="20" fill="#c48a42"/><circle cx="952" cy="442" r="11" fill="#7a4a24"/>
    <circle cx="1040" cy="452" r="18" fill="#c48a42"/><circle cx="1040" cy="454" r="10" fill="#7a4a24"/>
    <!-- open mouth, hidden behind the jaw until it drops -->
    <path d="M990 588 C1000 610 1046 612 1060 590 L1056 586 L994 584 Z" fill="#5a1a14"/>
    <g class="jaw" style="transform-origin:992px 586px">
      <path d="M990 584 C996 616 1050 620 1060 590 C1050 600 1000 600 990 584 Z" fill="#e8c890"/>
      <path d="M1002 600 l4 -10 l4 10 M1042 600 l4 -10 l4 10" fill="#fffaf0"/>
    </g>
    <path d="M948 470 C980 446 1050 452 1070 494 C1084 524 1082 560 1064 588 C1046 610 1000 612 984 590 C960 560 940 510 948 470 Z" fill="url(#l-fur)"/>
    <path d="M1002 560 C1012 540 1062 540 1070 562 C1072 584 1052 598 1034 598 C1014 598 998 584 1002 560 Z" fill="#f3dcae"/>
    <path d="M1022 540 C1032 532 1054 534 1060 544 L1046 560 Z" fill="#3a2016"/>
    <path d="M1046 560 L1044 574 M1044 574 C1036 584 1024 584 1018 578 M1044 574 C1052 584 1062 582 1066 576" stroke="#3a2016" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M1016 572 l-30 -4 M1016 578 l-30 6 M1066 570 l26 -6 M1066 576 l26 4" stroke="#fffaf0" stroke-width="1.6" opacity=".7"/>
    ${eye(1000, 506, 9, "#d39a4c", 0.6, "#c98a1c")}
    ${eye(1050, 508, 8, "#d39a4c", 0.6, "#c98a1c")}
    <path d="M988 492 C996 486 1008 486 1014 492 M1040 494 C1046 488 1058 488 1062 494" stroke="#7a4a24" stroke-width="3" fill="none"/>
  </g>
</g>`;
