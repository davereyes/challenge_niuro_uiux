import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { TopBar } from './TopBar';

/**
 * Canvas "Top Bar — Variants": Title, Logo, Logo on image, Large.
 * Back, close, stepper and progress are controls. Apply Now uses Title + close + stepper, **no back**.
 */
const meta = {
  title: 'Mobile/Organisms/TopBar',
  component: TopBar,
  ...mobileStory,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: { table: { disable: true } },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    logoSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    title: 'Step 2 of 7',
    showBack: false,
    showClose: true,
    showStepper: true,
    progress: 29,
    logoSize: 'sm',
    onBack: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Title: Story = {
  args: { variant: 'title' },
  play: async ({ canvas, args, userEvent }) => {
    await expect(canvas.queryByRole('button', { name: 'Back' })).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

export const Logo: Story = { args: { variant: 'logo', showStepper: false, showClose: false } };

export const LogoOnImage: Story = {
  args: { variant: 'logoOnImage', logoSize: 'lg', showStepper: false, showClose: false },
  decorators: [(Story) => <div style={{ background: 'var(--color-bg-inverse)' }}><Story /></div>],
};

export const Large: Story = { args: { variant: 'large', title: 'Your business', showStepper: false } };
