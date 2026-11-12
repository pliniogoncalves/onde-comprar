// Atrasos exclusivos da demonstração. Não aplicar a integrações reais.
export const demoTiming = {
  analysisMs: 1200,
  recognitionMs: 1500,
  offersMs: 2000,
  organizationMs: 1300,
};
export type DemoTiming = typeof demoTiming;
export const demoVisualTiming = { stepTransitionMs: 160 };

export const confirmationTiming = {
  introMs: 180,
  holdMs: 1800,
  animationMs: 420,
  audioTailMs: 150,
  maxHoldMs: 4000,
};
