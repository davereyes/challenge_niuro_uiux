import type { Preview } from '@storybook/react-vite';

import { VIEWPORTS } from '../src/presentation/design-system/storybook/viewports';
import '../src/presentation/design-system/tokens/index.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: VIEWPORTS,
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          'Mobile',
          ['Atoms', 'Molecules', 'Organisms', 'Templates'],
          'Desktop',
          ['Atoms', 'Molecules', 'Organisms', 'Templates'],
        ],
      },
    },
    a11y: {
      // 'error' fails the story test on any a11y violation (WCAG). Keep it strict.
      test: 'error',
    },
  },
};

export default preview;
