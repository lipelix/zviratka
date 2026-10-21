/**
 * Plays the animal recordings through Web Audio: decoded once, started at once on a tap
 * (an <audio> element lags on phones and cannot overlap a restart cleanly).
 *
 * Browsers start the context suspended until a user gesture: `play` is only called from
 * a tap, and resumes it there. iOS mutes Web Audio with the silent switch unless the
 * page asks for the "playback" audio session (Safari 16.4+).
 */
interface AudioSessionNavigator {
  audioSession?: { type: string };
}

export class SoundPlayer {
  private readonly context: AudioContext;
  private readonly buffers = new Map<string, Promise<AudioBuffer>>();
  private current: { id: string; source: AudioBufferSourceNode } | null = null;

  constructor(private readonly url: (id: string) => string) {
    const session = (navigator as AudioSessionNavigator).audioSession;
    if (session) session.type = "playback";
    this.context = new AudioContext({ latencyHint: "interactive" });
  }

  /** Starts loading a sound; `play` waits for it if it is not ready yet. */
  preload(id: string): Promise<AudioBuffer> {
    let buffer = this.buffers.get(id);
    if (!buffer) {
      buffer = fetch(this.url(id))
        .then((response) => {
          if (!response.ok)
            throw new Error(`Sound ${id}: HTTP ${response.status}`);
          return response.arrayBuffer();
        })
        .then((data) => this.context.decodeAudioData(data));
      // A failed load may succeed later (back online): do not keep the rejection.
      buffer.catch(() => this.buffers.delete(id));
      this.buffers.set(id, buffer);
    }
    return buffer;
  }

  /**
   * Plays a sound from the start, cutting off whatever plays now. Resolves with its
   * length in seconds once it has started.
   */
  async play(id: string): Promise<number> {
    // Resume inside the tap handler, before any await: iOS only allows it there.
    const resumed =
      this.context.state === "running" ? undefined : this.context.resume();
    this.stop();
    const buffer = await this.preload(id);
    await resumed;
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.addEventListener("ended", () => {
      if (this.current?.source === source) this.current = null;
    });
    source.start();
    this.current = { id, source };
    return buffer.duration;
  }

  stop(): void {
    if (!this.current) return;
    const { source } = this.current;
    this.current = null;
    source.stop();
  }

  /** The id of the sound playing now, if any. */
  get playing(): string | null {
    return this.current?.id ?? null;
  }
}
