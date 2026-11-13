import { confirmationTiming } from '../../../config/demoTiming';

export type ConfirmationTiming = typeof confirmationTiming;
export function confirmationHold(durationMs: number, timing: ConfirmationTiming = confirmationTiming) {
  const duration = Number.isFinite(durationMs) && durationMs > 0 ? durationMs : 0;
  return Math.max(timing.holdMs, duration > 0 ? Math.min(duration + timing.audioTailMs, timing.maxHoldMs) : 0);
}

// Mantém o progresso entre focos e cancela callbacks de apresentações antigas.
export class ConfirmationController {
  private id?: string;
  private phase: 'intro' | 'success' | 'finished' = 'intro';
  private remaining = 0;
  private hold = 0;
  private generation = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private startedAt = 0;
  constructor(private readonly timing: ConfirmationTiming = confirmationTiming) {}
  reset() {
    clearTimeout(this.timer); this.timer = undefined; this.generation++; this.id = undefined;
  }
  attach(id: string, reducedMotion: boolean, durationMs: number, onVisual: (success: boolean) => void, onFinish: () => void) {
    if (id !== this.id) {
      this.reset(); this.id = id; this.phase = 'intro';
      this.remaining = reducedMotion ? 0 : this.timing.introMs;
      this.hold = confirmationHold(durationMs, this.timing);
    }
    clearTimeout(this.timer);
    const generation = ++this.generation;
    const schedule = () => {
      this.startedAt = Date.now();
      this.timer = setTimeout(() => {
        if (generation !== this.generation) return;
        if (this.phase === 'intro') {
          this.phase = 'success'; this.remaining = this.hold;
          onVisual(true);
          if (generation === this.generation) schedule();
        } else if (this.phase === 'success') {
          this.phase = 'finished'; this.remaining = 0; this.timer = undefined;
          onFinish();
        }
      }, this.remaining);
    };
    onVisual(this.phase !== 'intro');
    if (generation === this.generation && this.phase !== 'finished') schedule();
    return () => {
      if (generation !== this.generation) return;
      clearTimeout(this.timer); this.timer = undefined; this.generation++;
      this.remaining = Math.max(0, this.remaining - (Date.now() - this.startedAt));
    };
  }
}
