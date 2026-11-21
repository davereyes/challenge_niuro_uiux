import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { Spinner } from './Spinner';

/** Tone is a variant (brand = checklist rows, current = inside buttons). Size and label are controls. */
const meta = {
  title: 'Mobile/Atoms/Spinner',
  component: Spinner,
  ...mobileStory,
  argTypes: {
    tone: { table: { disable: true } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md', label: 'Loading' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = { args: { tone: 'brand' } };

export const Current: Story = {
  args: { tone: 'current' },
  decorators: [(Story) => <div style={{ color: 'var(--color-action-primary-bg)' }}><Story /></div>],
};
