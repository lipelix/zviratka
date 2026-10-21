import type { AnimalId } from "../animals";
import { kohout } from "./kohout";
import { krava } from "./krava";
import { lev } from "./lev";
import { vlk } from "./vlk";
import { zaba } from "./zaba";

/** The SVG of each animal's page; the argument is the screen reader label. */
export const SCENES: Record<AnimalId, (label: string) => string> = {
  krava,
  kohout,
  lev,
  vlk,
  zaba,
};
