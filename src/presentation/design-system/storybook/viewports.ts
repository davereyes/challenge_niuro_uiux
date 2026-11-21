/**
 * Storybook viewports per platform. Every story declares its platform through
 * `mobileStory` / `desktopStory` so it always renders at the right size.
 */
export const VIEWPORTS = {
  mobile: {
    name: 'Mobile (390×844)',
    styles: { width: '390px', height: '844px' },
    type: 'mobile',
  },
  mobileSmall: {
    name: 'Mobile small (360×740)',
    styles: { width: '360px', height: '740px' },
    type: 'mobile',
  },
  desktop: {
    name: 'Desktop (1440×900)',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop',
  },
} as const;

export type ViewportKey = keyof typeof VIEWPORTS;
