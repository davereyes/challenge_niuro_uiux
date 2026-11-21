import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Only the design system feeds Storybook. Stories live next to each component.
  stories: [
    '../src/presentation/design-system/**/*.mdx',
    '../src/presentation/design-system/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/react-vite',
  core: {
    disableTelemetry: true,
  },
};

export default config;
