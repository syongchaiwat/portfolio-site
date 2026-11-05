export interface LiquidPreset {
  /** Drift per second of real time. Lower is slower. */
  speed: number;
  /** Where in the animation the page starts. */
  start: number;
  /** Size of the folds. Lower means wider folds. */
  scale: number;
  /** How much the surface twists into itself. */
  warp: number;
  /** 0 is smooth, 1 is sharply creased. */
  crease: number;
  /** Stretches folds along one axis. */
  stretch: number;
  /** Rotates the fold direction, in radians. */
  angle: number;
  /** Number of reflection bands. */
  bands: number;
  /** Surface steepness, which sets how strong reflections are. */
  relief: number;
  /** Rainbow shift on steep slopes. */
  film: number;
  /** Above 1 pushes the surface toward its darker colors. */
  depth: number;
  /** Highest point of the color ramp, from 0 to 1. */
  rampTop: number;
  /** Width of the bright reflection lines. Higher is thinner. */
  streakSharpness: number;
  /** Brightness of the bright reflection lines. */
  streakGain: number;
  /** Darkening toward the corners. */
  vignette: number;
  /** Luminance above which highlights shift to the signature color. */
  ceiling: number;
}

export const PRISM: LiquidPreset = {
  speed: 0.05,
  start: 47,
  scale: 0.85,
  warp: 1.5,
  crease: 0.36,
  stretch: 1.1,
  angle: 0.85,
  bands: 3.6,
  relief: 0.38,
  film: 0.2,
  depth: 1.35,
  rampTop: 0.6,
  streakSharpness: 16,
  streakGain: 1,
  vignette: 0.3,
  ceiling: 0.68,
};
