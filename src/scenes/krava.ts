import {
  blur,
  butterfly,
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

/** A Czech spotted cow on an alpine meadow on a sunny summer morning. */
export function krava(label: string): string {
  const defs = [
    linear("k-sky", [
      [0, "#3f97e0"],
      [0.55, "#8cc8f2"],
      [0.75, "#d3ecf8"],
    ]),
    radial("k-sun", [
      [0, "#fffbe6"],
      [0.25, "#fff2b0", 0.9],
      [1, "#fff2b0", 0],
    ]),
    linear("k-mtn-far", [
      [0, "#9fb6d4"],
      [1, "#c2d4e6"],
    ]),
    linear("k-mtn", [
      [0, "#7c93b6"],
      [1, "#a9bfd6"],
    ]),
    linear("k-hill-far", [
      [0, "#8fc06a"],
      [1, "#6fa553"],
    ]),
    linear("k-hill", [
      [0, "#79b54d"],
      [1, "#4f8f37"],
    ]),
    linear("k-meadow", [
      [0, "#6eb043"],
      [0.5, "#5a9d36"],
      [1, "#3f7d27"],
    ]),
    linear("k-haze", [
      [0, "#eef6fc", 0],
      [0.5, "#eef6fc", 0.55],
      [1, "#eef6fc", 0],
    ]),
    linear("k-body", [
      [0, "#fffaf3"],
      [0.7, "#efe4d6"],
      [1, "#d9cab8"],
    ]),
    linear("k-patch", [
      [0, "#b4603a"],
      [1, "#8a4126"],
    ]),
    linear(
      "k-bell",
      [
        [0, "#f6d36b"],
        [1, "#b9861f"],
      ],
      1,
      0,
    ),
    blur("soft", 6),
    blur("glow", 30),
    `<clipPath id="k-body-clip"><path d="${BODY}"/></clipPath>`,
  ].join("");

  return scene(
    "krava",
    label,
    defs,
    `
<rect width="1600" height="1000" fill="url(#k-sky)"/>
<g class="spin-slow" style="transform-origin:1290px 170px">
  ${rays(1290, 170)}
</g>
<circle cx="1290" cy="170" r="230" fill="url(#k-sun)"/>
<circle cx="1290" cy="170" r="62" fill="#fffbe9"/>
${cloud(250, 150, 0.9, 140)}
${cloud(820, 110, 0.6, 180, "#fff", 0.85)}
${cloud(1500, 250, 0.75, 120)}
${cloud(560, 290, 0.45, 210, "#fff", 0.7)}

<!-- Distant Alps -->
<path d="M0 520 L120 400 L210 450 L330 300 L420 380 L520 270 L640 400 L720 360 L860 250 L980 380 L1080 320 L1200 410 L1320 290 L1450 400 L1600 330 L1600 600 L0 600 Z" fill="url(#k-mtn-far)"/>
<path d="M330 300 L372 337 L350 340 L330 330 L300 345 L290 340 Z M520 270 L570 330 L545 325 L520 315 L495 330 L480 320 Z M860 250 L915 312 L890 305 L860 300 L835 315 L815 300 Z M1320 290 L1370 340 L1345 338 L1322 330 L1300 342 L1282 330 Z" fill="#f4f8fc"/>
<path d="M0 560 L160 440 L260 490 L400 380 L520 470 L640 420 L760 500 L900 400 L1030 480 L1160 430 L1300 500 L1420 420 L1600 480 L1600 640 L0 640 Z" fill="url(#k-mtn)" opacity=".85"/>
<path d="M400 380 L440 415 L420 418 L398 410 L376 420 L366 410 Z M900 400 L945 442 L920 440 L900 432 L878 444 L862 436 Z M1420 420 L1458 452 L1438 452 L1420 446 L1400 455 L1390 448 Z" fill="#eef4fa"/>
<rect y="400" width="1600" height="280" fill="url(#k-haze)"/>

<!-- Green hills with spruce groves and a chalet -->
<path d="M0 600 C200 540 380 560 560 590 C760 620 900 560 1100 560 C1300 560 1450 600 1600 580 L1600 760 L0 760 Z" fill="url(#k-hill-far)"/>
${spruces(7, 60, 470, 590, 0.55, "#3f6e3a")}
${spruces(8, 1120, 1560, 575, 0.6, "#3c6a37")}
<g transform="translate(1210 586) scale(.55)">
  <rect x="-60" y="-40" width="120" height="60" fill="#8a5a36"/>
  <path d="M-80 -38 L0 -95 L80 -38 Z" fill="#6d3d26"/>
  <rect x="-40" y="-25" width="22" height="20" fill="#f7e3a8"/><rect x="18" y="-25" width="22" height="20" fill="#f7e3a8"/>
  <rect x="-10" y="-8" width="20" height="28" fill="#4a2c1a"/>
</g>
<path d="M0 680 C260 620 520 640 760 668 C1000 696 1250 640 1600 660 L1600 800 L0 800 Z" fill="url(#k-hill)"/>

<!-- Meadow -->
<path d="M0 742 C300 712 620 720 900 735 C1180 750 1400 726 1600 738 L1600 1000 L0 1000 Z" fill="url(#k-meadow)"/>
${grass(11, 160, 0, 1600, 760, [16, 34], ["#4e8f2e", "#5fa23a", "#3f7d27"], 12)}
${flowers(21, 70, 0, 1600, 770, 990)}

<!-- Wooden fence on the left -->
<g fill="#8b6040" stroke="#5e3e27" stroke-width="3">
  <rect x="150" y="690" width="16" height="130" rx="3"/><rect x="330" y="684" width="16" height="132" rx="3"/><rect x="505" y="690" width="16" height="126" rx="3"/>
  <path d="M120 715 L540 708 L540 726 L120 734 Z"/><path d="M120 760 L540 754 L540 772 L120 778 Z"/>
</g>
${grass(12, 50, 100, 560, 820, [18, 40], ["#4e8f2e", "#5fa23a"], 8)}

<g transform="translate(-40 -50)">
${shadow(810, 822, 230, 22)}
${COW}
</g>

${grass(13, 110, 0, 1600, 900, [26, 56], ["#3f7d27", "#4e8f2e", "#5a9d36"], 70)}
${butterfly(1180, 700, "#ffd23f", 9)}
${butterfly(400, 640, "#ffffff", 12, 0.8)}
${butterfly(1350, 820, "#ff8fb1", 11, 0.9)}
`,
  );
}

function rays(cx: number, cy: number): string {
  let out = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x1 = cx + Math.cos(a - 0.05) * 600;
    const y1 = cy + Math.sin(a - 0.05) * 600;
    const x2 = cx + Math.cos(a + 0.05) * 600;
    const y2 = cy + Math.sin(a + 0.05) * 600;
    out += `<path d="M${cx} ${cy} L${x1.toFixed(0)} ${y1.toFixed(0)} L${x2.toFixed(0)} ${y2.toFixed(0)} Z" fill="#fff8d0" opacity=".1"/>`;
  }
  return out;
}

/** Spruce silhouettes along a hillside. */
function spruces(
  seed: number,
  x0: number,
  x1: number,
  y: number,
  scale: number,
  colour: string,
): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let x = x0; x < x1; x += between(rnd, 22, 46)) {
    const s = scale * between(rnd, 0.7, 1.2);
    const by = y + between(rnd, -10, 14);
    out += `<path d="M${x} ${by - 120 * s} L${x + 26 * s} ${by - 60 * s} L${x + 14 * s} ${by - 62 * s} L${x + 34 * s} ${by} L${x - 34 * s} ${by} L${x - 14 * s} ${by - 62 * s} L${x - 26 * s} ${by - 60 * s} Z" fill="${colour}"/>`;
  }
  return out;
}

/** Meadow flowers, nodding in the breeze. */
function flowers(
  seed: number,
  count: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
): string {
  const rnd = seededRandom(seed);
  const colours = ["#fff", "#ffe14d", "#c58af0", "#ff9ec0", "#fff", "#6fb6ff"];
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = between(rnd, x0, x1);
    const y = between(rnd, y0, y1);
    const s = 0.5 + ((y - y0) / (y1 - y0)) * 0.9;
    const c = colours[Math.floor(rnd() * colours.length)] ?? "#fff";
    out += `<g class="sway" ${vars({ d: between(rnd, 3, 5), delay: -between(rnd, 0, 4), a: "4deg" })}>
      <path d="M${x.toFixed(0)} ${y.toFixed(0)} L${x.toFixed(0)} ${(y - 22 * s).toFixed(0)}" stroke="#3f7d27" stroke-width="${(2 * s).toFixed(1)}"/>
      <g transform="translate(${x.toFixed(0)} ${(y - 24 * s).toFixed(0)}) scale(${s.toFixed(2)})">
        <circle cx="-5" cy="0" r="5" fill="${c}"/><circle cx="5" cy="0" r="5" fill="${c}"/><circle cx="0" cy="-5" r="5" fill="${c}"/><circle cx="0" cy="5" r="5" fill="${c}"/>
        <circle r="3.5" fill="#f2b71b"/>
      </g></g>`;
  }
  return out;
}

const BODY =
  "M640 560 C640 516 700 504 780 508 C860 503 925 508 952 545 C975 578 966 640 956 690 C946 730 900 736 860 728 L700 728 C658 731 636 700 632 650 C629 610 631 582 640 560 Z";

const leg = (x: number, top: number, fill: string): string => `
  <path d="M${x} ${top} L${x + 38} ${top} L${x + 35} ${top + 92} L${x + 37} 806 L${x + 2} 806 L${x + 4} ${top + 92} Z" fill="${fill}"/>
  <path d="M${x + 1} 800 L${x + 38} 800 L${x + 40} 818 L${x - 1} 818 Z" fill="#3b2b22"/>`;

const COW = `
<g class="animal" data-animal="krava">
  <ellipse class="hit" cx="830" cy="640" rx="280" ry="200" fill="transparent"/>
  <!-- far legs -->
  ${leg(700, 690, "#d8c9b6")}
  ${leg(918, 680, "#d8c9b6")}
  <g class="tail" style="transform-origin:636px 566px">
    <path d="M636 566 C612 600 606 660 612 712" stroke="#e8dccd" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M612 700 C598 716 600 742 612 750 C626 742 628 716 612 700 Z" fill="#8a4126"/>
  </g>
  <g class="breathe" style="transform-origin:800px 730px">
    <path d="${BODY}" fill="url(#k-body)"/>
    <g clip-path="url(#k-body-clip)" fill="url(#k-patch)">
      <path d="M690 500 C740 520 790 540 800 590 C808 640 760 660 720 650 C680 640 650 600 640 560 Z"/>
      <path d="M830 505 C880 520 930 530 960 560 L960 610 C920 620 880 600 860 570 C845 548 835 525 830 505 Z"/>
      <path d="M760 690 C790 670 830 675 845 700 C850 720 830 740 800 735 C775 732 755 712 760 690 Z"/>
    </g>
    <path d="M660 700 C700 720 860 724 940 700" stroke="#c9b8a3" stroke-width="5" fill="none" opacity=".6"/>
    <ellipse cx="728" cy="734" rx="30" ry="18" fill="#efb2a8"/>
    <path d="M714 748 l0 12 M728 750 l0 13 M742 748 l0 12" stroke="#d98f86" stroke-width="5" stroke-linecap="round"/>
  </g>
  <!-- near legs -->
  ${leg(662, 694, "#f2e9dd")}
  ${leg(882, 684, "#f2e9dd")}
  <!-- neck -->
  <path d="M900 534 C935 515 980 522 1000 556 L1004 640 C985 662 940 652 922 628 Z" fill="url(#k-body)"/>
  <path d="M905 534 C935 516 965 520 985 536 C960 545 930 556 912 580 Z" fill="url(#k-patch)"/>
  <g class="head" style="transform-origin:960px 570px">
    <path class="ear" style="transform-origin:985px 560px" d="M985 560 C960 548 935 552 928 566 C945 578 970 576 990 570 Z" fill="#9c4a2b"/>
    <path d="M992 536 C996 520 1006 506 1020 500 C1014 512 1008 526 1006 540 Z" fill="#efe2c4"/>
    <path d="M972 548 C995 526 1036 530 1050 560 L1066 640 C1070 670 1050 688 1022 688 C996 688 984 670 982 640 Z" fill="#fffaf3"/>
    <path d="M972 548 C990 530 1012 528 1028 534 C1010 560 1000 590 1004 612 C990 600 978 576 972 548 Z" fill="url(#k-patch)"/>
    ${eye(1022, 590, 9, "#fffaf3", 1.3)}
    <path class="mouth-open" d="M1008 676 C1018 702 1058 706 1068 680 Z" fill="#6b2e2a"/>
    <g class="jaw" style="transform-origin:1000px 676px">
      <ellipse cx="1036" cy="684" rx="26" ry="10" fill="#d48b84"/>
    </g>
    <ellipse cx="1038" cy="664" rx="32" ry="24" fill="#efb2a8"/>
    <ellipse cx="1030" cy="660" rx="5" ry="3.5" fill="#7a3f39"/><ellipse cx="1052" cy="660" rx="5" ry="3.5" fill="#7a3f39"/>
    <path class="ear" style="transform-origin:1000px 552px" d="M1000 552 C1020 532 1048 528 1058 536 C1048 552 1026 560 1006 562 Z" fill="#b4603a"/>
  </g>
  <!-- collar and bell -->
  <path d="M982 600 C995 606 1004 620 1006 634" stroke="#5a3a24" stroke-width="10" fill="none" stroke-linecap="round"/>
  <g class="bell" style="transform-origin:1004px 636px">
    <path d="M992 636 L1016 636 L1024 676 L984 676 Z" fill="url(#k-bell)"/>
    <circle cx="1004" cy="680" r="5" fill="#7a5a16"/>
  </g>
</g>`;
