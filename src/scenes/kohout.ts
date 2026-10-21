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

/** A rooster on a crate in the farmyard, the sun rising behind misty hills. */
export function kohout(label: string): string {
  const defs = [
    linear("r-sky", [
      [0, "#3d4f8f"],
      [0.32, "#8e7fb6"],
      [0.55, "#f1a3a0"],
      [0.72, "#ffc98a"],
    ]),
    radial("r-sun-glow", [
      [0, "#fff5d6", 1],
      [0.2, "#ffd98a", 0.9],
      [0.6, "#ffb070", 0.25],
      [1, "#ffb070", 0],
    ]),
    linear("r-hill-far", [
      [0, "#9c7fa0"],
      [1, "#c49aa2"],
    ]),
    linear("r-hill", [
      [0, "#6f7a6a"],
      [1, "#8a8f6e"],
    ]),
    linear("r-mist", [
      [0, "#ffe9dc", 0],
      [0.5, "#ffe9dc", 0.7],
      [1, "#ffe9dc", 0],
    ]),
    linear("r-yard", [
      [0, "#b98b55"],
      [0.4, "#a77945"],
      [1, "#7f5a32"],
    ]),
    linear(
      "r-barn",
      [
        [0, "#c0392b"],
        [1, "#8e2a20"],
      ],
      1,
      0,
    ),
    linear("r-roof", [
      [0, "#5b3a2e"],
      [1, "#3c2620"],
    ]),
    linear("r-wood", [
      [0, "#a8794b"],
      [1, "#7c5432"],
    ]),
    linear("r-body", [
      [0, "#d9572a"],
      [0.6, "#a8331b"],
      [1, "#7a2414"],
    ]),
    linear("r-hackle", [
      [0, "#ffb347"],
      [1, "#e07a1f"],
    ]),
    linear("r-tail", [
      [0, "#2f6b52"],
      [1, "#0e231b"],
    ]),
    blur("soft", 6),
    blur("glow", 24),
    blur("mist-blur", 10),
  ].join("");

  return scene(
    "kohout",
    label,
    defs,
    `
<rect width="1600" height="1000" fill="url(#r-sky)"/>
<circle class="pulse-glow" ${vars({ d: 5 })} cx="1040" cy="575" r="330" fill="url(#r-sun-glow)"/>
<circle cx="1040" cy="575" r="70" fill="#fff3cf"/>
${cloud(300, 210, 0.8, 160, "#ffd7d0", 0.8)}
${cloud(1000, 150, 0.55, 200, "#ffe0d2", 0.7)}
${cloud(1450, 300, 0.6, 140, "#ffcfc4", 0.75)}
${bird(500, 260, 1.6, 38)}
${bird(570, 300, 1.3, 38)}
${bird(1200, 220, 1.4, 46)}

<!-- Misty hills in the morning light -->
<path d="M0 560 C180 500 360 520 520 545 C700 575 860 500 1060 515 C1260 530 1420 560 1600 520 L1600 700 L0 700 Z" fill="url(#r-hill-far)"/>
<rect class="shimmer" ${vars({ d: 9 })} x="-40" y="520" width="1680" height="90" fill="url(#r-mist)"/>
<path d="M0 620 C220 580 420 600 640 615 C860 630 1080 585 1300 600 C1450 610 1540 600 1600 595 L1600 760 L0 760 Z" fill="url(#r-hill)"/>
${poplars(3, 60, 520, 612)}
<rect class="shimmer" ${vars({ d: 12, delay: -4 })} x="-40" y="600" width="1680" height="70" fill="url(#r-mist)" opacity=".8"/>

<!-- Barn -->
<g transform="translate(1240 470)">
  <path d="M-20 -60 L170 -160 L360 -60 L360 0 L-20 0 Z" fill="url(#r-roof)"/>
  <path d="M0 -50 L170 -140 L340 -50 L340 230 L0 230 Z" fill="url(#r-barn)"/>
  <path d="M0 -50 L170 -140 L340 -50" stroke="#f3ece0" stroke-width="10" fill="none"/>
  <rect x="135" y="-80" width="70" height="56" fill="#4a2a1d" stroke="#f3ece0" stroke-width="7"/>
  <rect x="95" y="90" width="150" height="140" fill="#7c2219" stroke="#f3ece0" stroke-width="8"/>
  <path d="M95 90 L245 230 M245 90 L95 230" stroke="#f3ece0" stroke-width="7"/>
  <path d="M0 0 L340 0" stroke="#6f1d16" stroke-width="4" opacity=".5"/>
  <g transform="translate(390 -20)">
    <rect x="0" y="0" width="80" height="250" fill="#b9b7ae"/>
    <path d="M0 0 C0 -60 80 -60 80 0 Z" fill="#8d8b84"/>
    <path d="M0 50 L80 50 M0 110 L80 110 M0 170 L80 170" stroke="#9a988f" stroke-width="4"/>
  </g>
</g>

<!-- Fence along the yard -->
${fence(640)}

<!-- The yard -->
<path d="M0 700 C300 680 600 690 900 700 C1200 710 1400 690 1600 696 L1600 1000 L0 1000 Z" fill="url(#r-yard)"/>
${straw(5, 140)}
${grass(31, 60, 0, 1600, 708, [10, 26], ["#7f8b3e", "#96a04a", "#6a7633"], 8)}

<!-- Round hay bales -->
<g transform="translate(260 720)">
  <ellipse cx="0" cy="0" rx="120" ry="90" fill="#d9b25c"/>
  <ellipse cx="-30" cy="-6" rx="70" ry="80" fill="#e8c56f"/>
  <path d="M-80 -30 C-50 -50 -10 -40 10 -20 M-90 20 C-50 0 -10 10 20 30 M-60 -60 C-30 -70 0 -60 20 -50" stroke="#b98d3c" stroke-width="5" fill="none"/>
  <ellipse cx="190" cy="40" rx="95" ry="72" fill="#cfa651"/>
  <ellipse cx="165" cy="36" rx="55" ry="64" fill="#e2bd66"/>
</g>

<!-- Crate and rooster -->
<g transform="translate(800 702) scale(0.86) translate(-800 -730)">
${shadow(800, 830, 190, 18, 0.3)}
<g transform="translate(800 730)">
  <rect x="-130" y="0" width="260" height="96" fill="url(#r-wood)"/>
  <path d="M-130 30 L130 30 M-130 62 L130 62" stroke="#6a4528" stroke-width="5"/>
  <path d="M-130 0 L130 96 M130 0 L-130 96" stroke="#8c6038" stroke-width="10" opacity=".6"/>
  <rect x="-136" y="-6" width="272" height="14" rx="4" fill="#b98756"/>
</g>
${ROOSTER}
</g>

${chick(420, 880, 1.0, 0)}
${chick(500, 905, 0.85, -1.3)}
${chick(1170, 890, 0.95, -0.7)}
${grass(32, 50, 0, 1600, 960, [20, 44], ["#7f8b3e", "#96a04a"], 30)}
`,
  );
}

function poplars(seed: number, x0: number, x1: number, y: number): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let x = x0; x < x1; x += between(rnd, 50, 110)) {
    const h = between(rnd, 70, 130);
    out += `<ellipse class="sway" ${vars({ d: between(rnd, 4, 7), delay: -between(rnd, 0, 5), a: "1.5deg" })} cx="${x.toFixed(0)}" cy="${(y - h / 2).toFixed(0)}" rx="${(h / 5).toFixed(0)}" ry="${(h / 2).toFixed(0)}" fill="#5a6b55"/>`;
  }
  return out;
}

function fence(y: number): string {
  let out = `<g fill="#9b744c" stroke="#6b4a2c" stroke-width="3">`;
  for (let x = -20; x < 1240; x += 90)
    out += `<rect x="${x}" y="${y}" width="14" height="70" rx="2"/>`;
  out += `<rect x="-20" y="${y + 14}" width="1260" height="10"/><rect x="-20" y="${y + 42}" width="1260" height="10"/></g>`;
  return out;
}

/** Straw strewn over the yard. */
function straw(seed: number, count: number): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = between(rnd, 0, 1600);
    const y = between(rnd, 720, 1000);
    const a = between(rnd, -0.6, 0.6);
    const l = 8 + ((y - 720) / 280) * 18;
    out += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}" stroke="${rnd() < 0.5 ? "#e6c66e" : "#c9a24f"}" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  return out;
}

/** A yellow chick pecking at the ground. */
function chick(x: number, y: number, s: number, delay: number): string {
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="6" rx="34" ry="7" fill="#3a2a14" opacity=".25"/>
  <path d="M-6 0 L-8 8 M6 0 L4 8" stroke="#e08a1e" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="0" cy="-22" rx="26" ry="22" fill="#ffd84a"/>
  <path d="M-8 -28 C-2 -18 10 -18 14 -26" stroke="#f2bf2a" stroke-width="4" fill="none"/>
  <g class="peck" ${vars({ delay }, "transform-box:fill-box;transform-origin:15% 85%")}>
    <circle cx="20" cy="-42" r="16" fill="#ffe066"/>
    <circle cx="25" cy="-46" r="3.2" fill="#2a1a10"/>
    <circle cx="26" cy="-47" r="1" fill="#fff"/>
    <path d="M34 -42 L46 -38 L34 -35 Z" fill="#f08c1c"/>
  </g>
</g>`;
}

const ROOSTER = `
<g class="animal" data-animal="kohout">
  <ellipse class="hit" cx="800" cy="520" rx="210" ry="240" fill="transparent"/>
  <!-- legs -->
  <g stroke="#e9a62a" stroke-width="11" stroke-linecap="round" fill="none">
    <path d="M780 620 L776 722"/><path d="M826 616 L834 722"/>
    <path d="M776 722 L748 730 M776 722 L800 732 M776 722 L770 732" stroke-width="7"/>
    <path d="M834 722 L860 732 M834 722 L812 730 M834 722 L842 733" stroke-width="7"/>
  </g>
  <path d="M770 612 L790 612 L786 640 L774 640 Z M816 608 L838 608 L836 636 L822 636 Z" fill="#b8431f"/>
  <g class="torso" style="transform-origin:800px 640px">
    <g class="tail" style="transform-origin:720px 520px">
      <path d="M720 520 C650 470 610 380 650 300 C672 360 705 420 760 470 Z" fill="url(#r-tail)"/>
      <path d="M716 528 C620 510 560 430 570 350 C600 420 650 470 740 500 Z" fill="#1d4a3a"/>
      <path d="M724 540 C640 560 580 520 560 460 C610 490 670 505 730 512 Z" fill="#0f2a20"/>
      <path d="M730 500 C690 430 700 360 740 320 C735 380 745 430 770 470 Z" fill="#3c7a60"/>
      <path d="M716 520 C690 540 660 590 640 610 C690 600 720 570 740 540 Z" fill="#1b3f31"/>
      <path d="M650 300 C630 340 640 380 660 410" stroke="#7fc3a6" stroke-width="3" fill="none" opacity=".5"/>
    </g>
    <path d="M700 520 C700 462 760 432 832 444 C892 454 902 522 882 572 C862 622 782 642 742 622 C712 604 700 562 700 520 Z" fill="url(#r-body)"/>
    <path d="M716 586 C750 630 830 632 870 590 C840 640 760 650 716 586 Z" fill="#2a1a12" opacity=".5"/>
    <g class="wing" style="transform-origin:800px 500px">
      <path d="M770 490 C820 470 870 492 868 540 C866 584 820 604 770 590 C740 580 730 560 742 530 C750 510 758 498 770 490 Z" fill="#8e2a18"/>
      <path d="M748 552 C780 560 830 562 864 548 M752 572 C790 584 830 584 858 570" stroke="#5a170c" stroke-width="5" fill="none"/>
      <path d="M760 586 C800 600 840 596 862 580 L850 600 C820 612 784 610 760 586 Z" fill="#1d4a3a"/>
    </g>
    <path d="M824 356 C870 352 908 396 906 466 C904 500 882 512 860 502 C838 512 812 500 806 478 C818 440 810 396 824 356 Z" fill="url(#r-hackle)"/>
    <path d="M846 470 l-6 30 M862 466 l0 34 M878 470 l6 28" stroke="#d96a15" stroke-width="5" stroke-linecap="round"/>
    <g class="head" style="transform-origin:850px 430px">
      <g class="comb" style="transform-origin:860px 316px">
        <path d="M830 330 C820 300 838 290 846 310 C846 284 868 280 868 306 C874 282 896 286 890 312 C904 296 920 308 906 330 Z" fill="#e3242b"/>
      </g>
      <path d="M832 330 C838 310 880 306 900 330 C916 350 910 380 890 392 C866 404 840 396 830 376 C824 360 826 344 832 330 Z" fill="#e88a2e"/>
      <g class="beak">
        <path d="M904 346 L940 358 L906 366 Z" fill="#f3c242"/>
        <g class="jaw" style="transform-origin:906px 364px"><path d="M906 364 L934 362 L904 374 Z" fill="#d8a02a"/></g>
      </g>
      <path d="M884 378 C900 382 906 404 896 418 C884 426 872 414 874 398 Z" fill="#e3242b"/>
      <ellipse cx="868" cy="364" rx="10" ry="8" fill="#f4f0e6"/>
      ${eye(884, 344, 7.5, "#e88a2e", 2.1, "#e97c12")}
    </g>
  </g>
</g>`;
