/**
 * Token NAMES exposed to TypeScript (Foundations stories).
 * Values live only in CSS (primitives.css / semantic.css) — single source of truth.
 */
export const COLOR_TOKENS = {
  brand: ['--color-bg-brand', '--color-text-accent', '--color-bg-brand-subtle'],
  text: [
    '--color-text-primary',
    '--color-text-secondary',
    '--color-text-muted',
    '--color-text-disabled',
    '--color-text-placeholder',
    '--color-text-danger',
  ],
  surfaces: ['--color-bg-surface', '--color-bg-page', '--color-bg-subtle', '--color-bg-disabled', '--color-bg-inverse'],
  borders: ['--color-border-default', '--color-border-strong', '--color-border-focus', '--color-border-danger', '--color-border-selected'],
  feedback: ['--color-feedback-danger-fg', '--color-feedback-success-fg', '--color-progress-track', '--color-progress-fill'],
} as const;

export const TYPE_SCALE = [
  { name: 'display', size: '--font-size-40', lineHeight: '--line-height-44', weight: 700, usage: 'Landing hero' },
  { name: 'title', size: '--font-size-28', lineHeight: '--line-height-34', weight: 700, usage: 'Step titles (h1)' },
  { name: 'section', size: '--font-size-28', lineHeight: '--line-height-34', weight: 500, usage: 'Landing section titles' },
  { name: 'stat', size: '--font-size-34', lineHeight: '--line-height-40', weight: 500, usage: 'Facts in numbers' },
  { name: 'headline', size: '--font-size-17', lineHeight: '--line-height-22', weight: 600, usage: 'Top bar, card titles, sheet title' },
  { name: 'lead', size: '--font-size-19', lineHeight: '--line-height-27', weight: 400, usage: 'Hero subtitle' },
  { name: 'body', size: '--font-size-16', lineHeight: '--line-height-24', weight: 400, usage: 'Body, inputs' },
  { name: 'bodySmall', size: '--font-size-15', lineHeight: '--line-height-22', weight: 400, usage: 'Landing paragraphs' },
  { name: 'callout', size: '--font-size-14', lineHeight: '--line-height-20', weight: 400, usage: 'Notices, checkbox labels' },
  { name: 'caption', size: '--font-size-13', lineHeight: '--line-height-18', weight: 400, usage: 'Helper text, hints' },
  { name: 'micro', size: '--font-size-12', lineHeight: '--line-height-18', weight: 400, usage: 'Legal copy' },
] as const;

export const SPACE_TOKENS = [
  '--space-1',
  '--space-2',
  '--space-3',
  '--space-4',
  '--space-5',
  '--space-6',
  '--space-8',
  '--space-10',
  '--space-12',
  '--space-14',
] as const;

export const RADIUS_TOKENS = [
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--radius-xl',
  '--radius-2xl',
  '--radius-3xl',
  '--radius-full',
] as const;
