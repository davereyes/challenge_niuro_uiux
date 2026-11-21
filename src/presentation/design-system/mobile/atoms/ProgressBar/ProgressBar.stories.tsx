import type { Meta, StoryObj } from '@storybook/react-vite';

import { mobileStory } from '../../../storybook/platform';
import { ProgressBar } from './ProgressBar';

/** `value` is a control (0–100). Stepper values in the flow: 14, 29, 43, 57, 71, 79 (checking), 86, 100. */
const meta = {
  title: 'Mobile/Atoms/ProgressBar',
  component: ProgressBar,
  ...mobileStory,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    tone: { table: { disable: true } },
  },
  args: { value: 29 },
  decorators: [(Story) => <div style={{ width: '24.375rem' }}><Story /></div>],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { tone: 'default' } };

export const OnImage: Story = {
  args: { tone: 'onImage' },
  decorators: [(Story) => <div style={{ padding: 'var(--space-4) 0', background: 'var(--color-bg-inverse)' }}><Story /></div>],
};
