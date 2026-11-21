import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { ICON_NAMES } from '../../../icons';
import { mobileStory } from '../../../storybook/platform';
import { IconButton } from './IconButton';

/** Canvas "Icon Button — Variants": Back and Close. Size and disabled are controls. */
const meta = {
  title: 'Mobile/Atoms/IconButton',
  component: IconButton,
  ...mobileStory,
  argTypes: {
    icon: { control: 'select', options: ICON_NAMES },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
  args: { size: 'md', disabled: false, onClick: fn() },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Back: Story = {
  args: { icon: 'back', label: 'Back' },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Close: Story = { args: { icon: 'close', label: 'Close' } };
