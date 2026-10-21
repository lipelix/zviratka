import {
  blur,
  eye,
  linear,
  radial,
  scene,
  shadow,
  snow,
  stars,
  vars,
} from "./kit";
import { between, seededRandom } from "../logic/rng";

/** A wolf on a snowy rock in a winter forest under the full moon. */
export function vlk(label: string): string {
  const defs = [
    linear("w-sky", [
      [0, "#070d24"],
      [0.45, "#18295a"],
      [0.75, "#34508a"],
    ]),
    radial("w-moon-glow", [
      [0, "#f4f6ff", 0.9],
      [0.25, "#c9d6ff", 0.45],
      [1, "#c9d6ff", 0],
    ]),
    radial(
      "w-moon",
      [
        [0, "#fffef6"],
        [0.8, "#eef0e4"],
        [1, "#d9dccf"],
      ],
      0.4,
      0.4,
      0.7,
    ),
    linear(
      "w-aurora",
      [
        [0, "#5cf2b0", 0],
        [0.5, "#5cf2b0", 0.35],
        [1, "#7a8cff", 0],
      ],
      1,
      0,
    ),
    linear("w-snow", [
      [0, "#dfe9fb"],
      [0.5, "#b9c9e6"],
      [1, "#8ea3cc"],
    ]),
    linear("w-mtn", [
      [0, "#4b6194"],
      [1, "#2c3d6b"],
    ]),
    linear("w-fur", [
      [0, "#a4acb8"],
      [0.6, "#7d8593"],
      [1, "#5b6270"],
    ]),
    linear("w-rock", [
      [0, "#dbe5f7"],
      [0.25, "#9eacc6"],
      [1, "#4c5876"],
    ]),
    blur("soft", 6),
    blur("aurora-blur", 18),
  ].join("");

  return scene(
    "vlk",
    label,
    defs,
    `
<rect width="1600" height="1000" fill="url(#w-sky)"/>
${stars(5, 160, 560)}
<g filter="url(#aurora-blur)">
  <path class="shimmer" ${vars({ d: 14 })} d="M-100 250 C200 160 420 320 700 220 C960 130 1200 260 1700 170 L1700 260 C1200 350 960 230 700 320 C420 420 200 260 -100 350 Z" fill="url(#w-aurora)"/>
</g>
<circle class="pulse-glow" ${vars({ d: 6 })} cx="1010" cy="200" r="260" fill="url(#w-moon-glow)"/>
<circle cx="1010" cy="200" r="82" fill="url(#w-moon)"/>
<circle cx="986" cy="180" r="14" fill="#d6d9cb" opacity=".6"/><circle cx="1036" cy="226" r="10" fill="#d6d9cb" opacity=".55"/><circle cx="1028" cy="170" r="7" fill="#d6d9cb" opacity=".5"/>

<!-- Snowy mountains, lit from the moon's side -->
<path d="M0 560 L180 400 L300 470 L460 330 L620 480 L760 420 L900 520 L1060 380 L1240 500 L1400 410 L1600 520 L1600 700 L0 700 Z" fill="url(#w-mtn)"/>
<path d="M180 400 L230 445 L200 440 L180 430 L150 444 L135 440 Z M460 330 L520 386 L490 380 L462 372 L430 386 L410 378 Z M1060 380 L1120 436 L1090 430 L1062 420 L1030 434 L1012 428 Z M1400 410 L1450 452 L1426 450 L1402 442 L1380 452 L1366 446 Z" fill="#dfe8fa"/>

${pines(61, 0, 1600, 640, 0.75, "#1c2b52", "#c6d4ee")}
<path d="M0 650 C300 630 600 650 900 640 C1200 630 1400 650 1600 640 L1600 1000 L0 1000 Z" fill="url(#w-snow)" opacity=".6"/>
${pines(62, -30, 1640, 700, 1.15, "#142041", "#dbe5f8", 380, 1220)}

<!-- Snowfield -->
<path d="M0 720 C260 700 560 715 820 712 C1100 708 1360 720 1600 712 L1600 1000 L0 1000 Z" fill="url(#w-snow)"/>
<path d="M0 760 C400 740 800 770 1600 750" stroke="#f2f6fe" stroke-width="5" fill="none" opacity=".6"/>
${sparkles(63, 40)}

<!-- Rock and wolf -->
<g transform="translate(800 720) scale(0.92) translate(-814 -740)">
  <path d="M560 790 C570 740 660 724 800 724 C940 722 1040 740 1060 800 C1076 860 1030 900 950 906 L650 906 C580 900 548 850 560 790 Z" fill="url(#w-rock)"/>
  <path d="M572 760 C620 728 980 724 1046 770 C990 752 640 750 572 760 Z" fill="#f2f6fe"/>
  ${shadow(810, 748, 200, 12, 0.3)}
  ${WOLF}
</g>

${snow(64, 110)}
`,
  );
}

/** A row of snow-dusted spruces; `gap` leaves the middle free for the wolf. */
function pines(
  seed: number,
  x0: number,
  x1: number,
  y: number,
  scale: number,
  colour: string,
  snowColour: string,
  gapFrom = Infinity,
  gapTo = -Infinity,
): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let x = x0; x < x1; x += between(rnd, 34, 70) * scale) {
    if (x > gapFrom && x < gapTo) continue;
    const s = scale * between(rnd, 0.75, 1.25);
    const by = y + between(rnd, -12, 16);
    const tiers = [
      [0, 150, 26],
      [44, 120, 46],
      [88, 92, 66],
    ];
    out += `<g class="sway" ${vars({ d: between(rnd, 5, 8), delay: -between(rnd, 0, 6), a: "0.8deg" })}>`;
    out += `<rect x="${(x - 5 * s).toFixed(0)}" y="${(by - 20 * s).toFixed(0)}" width="${(10 * s).toFixed(0)}" height="${(22 * s).toFixed(0)}" fill="#1a1520"/>`;
    for (const [dy, top, half] of tiers) {
      const t = by - (top ?? 0) * s;
      const b = by - 14 * s - (dy ?? 0) * s * 0.4;
      const h = (half ?? 0) * s;
      out += `<path d="M${x.toFixed(0)} ${t.toFixed(0)} L${(x + h).toFixed(0)} ${b.toFixed(0)} L${(x - h).toFixed(0)} ${b.toFixed(0)} Z" fill="${colour}"/>`;
      out += `<path d="M${x.toFixed(0)} ${t.toFixed(0)} L${(x + h * 0.55).toFixed(0)} ${(t + (b - t) * 0.5).toFixed(0)} L${(x + h * 0.1).toFixed(0)} ${(t + (b - t) * 0.42).toFixed(0)} L${(x - h * 0.4).toFixed(0)} ${(t + (b - t) * 0.55).toFixed(0)} Z" fill="${snowColour}" opacity=".85"/>`;
    }
    out += `</g>`;
  }
  return out;
}

/** Moonlight glinting on the snow. */
function sparkles(seed: number, count: number): string {
  const rnd = seededRandom(seed);
  let out = "";
  for (let i = 0; i < count; i++)
    out += `<circle class="twinkle" ${vars({ d: between(rnd, 1, 2.6), delay: -between(rnd, 0, 3) })} cx="${between(rnd, 0, 1600).toFixed(0)}" cy="${between(rnd, 740, 990).toFixed(0)}" r="${between(rnd, 1.2, 2.6).toFixed(1)}" fill="#fff"/>`;
  return out;
}

const WOLF = `
<g class="animal" data-animal="vlk">
  <ellipse class="hit" cx="820" cy="560" rx="250" ry="250" fill="transparent"/>
  <g class="tail" style="transform-origin:700px 700px">
    <path d="M704 700 C650 720 600 724 572 712 C556 704 560 688 580 690 C620 694 660 690 700 676 Z" fill="#6b7381"/>
    <path d="M590 692 C570 690 560 702 572 712 C584 718 600 714 608 708 Z" fill="#e7e3da"/>
  </g>
  <g class="breathe" style="transform-origin:800px 740px">
    <path d="M680 726 C650 640 690 560 770 520 C820 494 880 470 918 492 C946 540 936 640 916 726 Z" fill="url(#w-fur)"/>
    <path d="M760 530 C800 500 860 480 900 486 C870 520 820 540 780 560 Z" fill="#4e5562" opacity=".35"/>
    <ellipse cx="740" cy="680" rx="80" ry="68" fill="#7d8593"/>
    <path d="M680 700 C700 660 760 640 800 660" stroke="#5b6270" stroke-width="6" fill="none" opacity=".6"/>
    <path d="M708 744 C700 728 712 716 740 716 L790 718 C802 730 796 744 780 746 Z" fill="#8f97a4"/>
    <path d="M880 520 C910 540 924 600 916 660 C904 640 890 600 872 580 Z" fill="#e7e3da"/>
  </g>
  <path d="M858 600 C866 594 884 594 892 600 L890 700 C888 716 892 728 894 736 L858 736 C860 724 862 712 860 700 Z" fill="#9aa2ae"/>
  <path d="M892 596 C900 590 918 590 926 596 L924 700 C922 716 926 728 928 736 L892 736 C894 724 896 712 894 700 Z" fill="#b3bac4"/>
  <ellipse cx="878" cy="738" rx="24" ry="10" fill="#9aa2ae"/><ellipse cx="914" cy="738" rx="24" ry="10" fill="#b3bac4"/>
  <path d="M870 744 l0 -8 M880 745 l0 -9 M906 745 l0 -9 M916 745 l0 -9" stroke="#6b7381" stroke-width="2.5" stroke-linecap="round"/>
  <g class="head" style="transform-origin:900px 500px">
    <path d="M860 440 C850 400 860 360 870 340 C886 360 896 384 900 404 Z" fill="#6b7381"/>
    <path d="M866 420 C866 396 872 372 876 360 C884 380 888 396 890 412 Z" fill="#3a3f4a"/>
    <path d="M846 470 C840 420 880 392 930 396 C966 398 988 418 1000 440 L1060 458 C1072 466 1070 482 1058 486 L1000 494 C980 512 940 522 900 516 C870 512 850 494 846 470 Z" fill="url(#w-fur)"/>
    <path d="M920 404 C916 380 924 352 932 338 C946 360 952 384 952 406 Z" fill="#7d8593"/>
    <path d="M928 400 C928 382 932 364 936 354 C942 372 944 388 944 402 Z" fill="#3a3f4a"/>
    <g class="mouth-open">
      <path d="M996 488 L1058 484 C1056 500 1036 514 1000 514 Z" fill="#5a1a1e"/>
      <path d="M1040 486 l3 8 l3 -8 Z" fill="#f4f1ea"/>
    </g>
    <g class="jaw" style="transform-origin:1000px 494px">
      <path d="M1000 490 L1052 488 C1050 500 1030 510 1000 510 Z" fill="#d9d4ca"/>
    </g>
    <path d="M990 470 L1056 474 C1064 478 1062 488 1054 488 L1000 492 C990 492 984 480 990 470 Z" fill="#e7e3da"/>
    <ellipse cx="1060" cy="466" rx="12" ry="9" fill="#1f2228"/>
    <path d="M860 486 C880 512 930 524 970 512 C940 534 880 530 856 506 Z" fill="#b3bac4"/>
    ${eye(968, 440, 7.5, "#7d8593", 3.4, "#e0a526")}
    <path d="M956 430 L982 436" stroke="#3a3f4a" stroke-width="3" stroke-linecap="round"/>
    <g class="breath" style="transform-origin:1070px 490px">
      <circle cx="1090" cy="486" r="14" fill="#fff"/><circle cx="1118" cy="470" r="18" fill="#fff"/><circle cx="1150" cy="450" r="22" fill="#fff"/>
    </g>
  </g>
</g>`;
