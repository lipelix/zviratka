import type { SoundPlayer } from "../../src/audio/player";

declare global {
  interface Window {
    /** The sound player, exposed in development builds only (see src/main.ts). */
    __player: SoundPlayer;
  }
}
