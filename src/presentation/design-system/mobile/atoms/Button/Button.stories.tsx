import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { Button } from './Button';

/**
 * One story per **visual variant** (canvas "Button — States": Primary, Secondary, Tertiary, Inverse,
 * plus the proposed Destructive). `showBackIcon`, `loading` and `disabled` are **controls**.
 */
const meta = {
  title: 'Mobile/Atoms/Button',
  component: Button,
  ...mobileStory,
  argTypes: {
    variant: { table: { disable: true } },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  args: {
    label: 'Continue',
    showBackIcon: false,
    loading: false,
    disabled: false,
    onClick: fn(),
    onBack: fn(),
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', showBackIcon: true },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: args.label }));
    await expect(args.onClick).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(args.onBack).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Tertiary: Story = { args: { variant: 'tertiary' } };

/** For use on images or dark surfaces (landing hero). */
export const Inverse: Story = {
  args: { variant: 'inverse', label: 'Get Your Advance' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-brand)' }}>
        <Story />
      </div>
    ),
  ],
};

/** Proposed in the canvas (2C · Leave confirmation). Not on the DS page yet. */
export const Destructive: Story = { args: { variant: 'destructive', label: 'Yes, leave' } };
