import type { ViewportKey } from './viewports';

const platformGlobals = (value: ViewportKey) => ({
  viewport: { value, isRotated: false },
});

/** Spread into a Mobile/* story meta: `...mobileStory` */
export const mobileStory = {
  globals: platformGlobals('mobile'),
  parameters: { layout: 'padded' },
} as const;

/** Spread into a Desktop/* story meta: `...desktopStory` */
export const desktopStory = {
  globals: platformGlobals('desktop'),
  parameters: { layout: 'padded' },
} as const;
