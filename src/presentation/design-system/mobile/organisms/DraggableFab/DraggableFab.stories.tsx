import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { DraggableFab } from './DraggableFab';

/** Drag it: it snaps to the nearest side and never covers the CTA bar. Hidden while the keyboard is open. */
const meta = {
  title: 'Mobile/Organisms/DraggableFab',
  component: DraggableFab,
  ...mobileStory,
  parameters: { layout: 'fullscreen' },
  args: { label: 'Chat with us', onClick: fn() },
  decorators: [(Story) => <div style={{ height: '100dvh' }}><Story /></div>],
} satisfies Meta<typeof DraggableFab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Chat with us' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
