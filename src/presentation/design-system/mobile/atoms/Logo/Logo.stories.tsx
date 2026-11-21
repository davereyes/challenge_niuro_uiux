import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { Logo } from './Logo';

/** Brand / White are variants (different artwork). Size is a control (canvas "Logo — Sizes"). */
const meta = {
  title: 'Mobile/Atoms/Logo',
  component: Logo,
  ...mobileStory,
  argTypes: {
    color: { table: { disable: true } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md' },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = { args: { color: 'brand' } };

export const White: Story = {
  args: { color: 'white' },
  decorators: [(Story) => <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-inverse)' }}><Story /></div>],
};
