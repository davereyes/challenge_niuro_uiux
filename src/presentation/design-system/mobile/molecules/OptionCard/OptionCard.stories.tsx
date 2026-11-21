import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { ICON_NAMES } from '../../../icons';
import { mobileStory } from '../../../storybook/platform';
import { OptionCard } from './OptionCard';

/** `selected` is a state → control. One story. In real use it lives inside OptionCardGroup. */
const meta = {
  title: 'Mobile/Molecules/OptionCard',
  component: OptionCard,
  ...mobileStory,
  argTypes: { icon: { control: 'select', options: [undefined, ...ICON_NAMES] } },
  args: {
    label: 'My own business',
    description: 'Clients, business revenue',
    icon: 'store',
    selected: false,
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div role="radiogroup" aria-label="Example" style={{ width: '21.375rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OptionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: /My own business/ }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
