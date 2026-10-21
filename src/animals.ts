/**
 * The animals, in the order of the pages. Each has a real recording from Wikimedia
 * Commons (trimmed and normalised into `public/sounds/<id>.mp3`); the credits are shown
 * in the info dialog, as the licences ask.
 */
export interface Credit {
  /** The original file on Wikimedia Commons. */
  readonly source: string;
  readonly author: string;
  readonly licence: string;
  /** Licence deed, empty for public domain. */
  readonly licenceUrl: string;
}

export interface Animal {
  /** Also the file name of the sound and the scene module. */
  readonly id: AnimalId;
  /** Czech name, shown on the page. */
  readonly name: string;
  /** What the animal "says", floated up when it calls. */
  readonly call: string;
  /** Where it lives, for the screen reader label. */
  readonly home: string;
  /** Browser chrome colour while the page is shown. */
  readonly theme: string;
  readonly credit: Credit;
}

export type AnimalId = "krava" | "kohout" | "lev" | "vlk" | "zaba";

const BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/";
const BY_4 = "https://creativecommons.org/licenses/by/4.0/";

export const ANIMALS: readonly Animal[] = [
  {
    id: "krava",
    name: "Kráva",
    call: "Bůůů!",
    home: "na horské louce",
    theme: "#7cc4f0",
    credit: {
      source: "https://commons.wikimedia.org/wiki/File:Single_Cow_Moo.ogg",
      author: "MichaeltheFox8621",
      licence: "CC BY-SA 4.0",
      licenceUrl: BY_SA_4,
    },
  },
  {
    id: "kohout",
    name: "Kohout",
    call: "Kykyryký!",
    home: "na statku za svítání",
    theme: "#f6a96b",
    credit: {
      source:
        "https://commons.wikimedia.org/wiki/File:Small_rooster_crowing.ogg",
      author: "alys",
      licence: "Public domain",
      licenceUrl: "",
    },
  },
  {
    id: "lev",
    name: "Lev",
    call: "Grrraaau!",
    home: "v africké savaně",
    theme: "#f0a24a",
    credit: {
      source:
        "https://commons.wikimedia.org/wiki/File:Lion_raring-sound1TamilNadu178.ogg",
      author: "த*உழவன்",
      licence: "Public domain",
      licenceUrl: "",
    },
  },
  {
    id: "vlk",
    name: "Vlk",
    call: "Auuuuu!",
    home: "v zimním lese za úplňku",
    theme: "#16234a",
    credit: {
      source: "https://commons.wikimedia.org/wiki/File:11wolf.wav",
      author: "Data Clock",
      licence: "CC BY 4.0",
      licenceUrl: BY_4,
    },
  },
  {
    id: "zaba",
    name: "Žába",
    call: "Kvák kvák!",
    home: "u rybníka",
    theme: "#6fb8a4",
    credit: {
      source:
        "https://commons.wikimedia.org/wiki/File:Marsh_frog_(Pelophylax_ridibundus)_call.ogg",
      author: "Llivermore",
      licence: "CC BY-SA 4.0",
      licenceUrl: BY_SA_4,
    },
  },
];
