export const PRESETS = [
  {
    label: "1/1",
    focusTime: 1 * 60,
    breakTime: 1 * 60,
  },
  {
    label: "25/5",
    focusTime: 25 * 60,
    breakTime: 5 * 60,
  },
  {
    label: "50/10",
    focusTime: 50 * 60,
    breakTime: 10 * 60,
  },
  {
    label: "90/20",
    focusTime: 90 * 60,
    breakTime: 20 * 60,
  },
] as const;

export type TPreset = (typeof PRESETS)[number];

export const PHASE = {
  FOCUS: "focus",
  BREAK: "break",
} as const;

export type TPhase = (typeof PHASE)[keyof typeof PHASE];
