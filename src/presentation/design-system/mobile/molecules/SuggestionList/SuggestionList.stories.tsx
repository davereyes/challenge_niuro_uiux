import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { SuggestionList } from './SuggestionList';

/** `activeIndex` (keyboard highlight) is a control. */
const meta = {
  title: 'Mobile/Molecules/SuggestionList',
  component: SuggestionList,
  ...mobileStory,
  argTypes: { suggestions: { control: false }, activeIndex: { control: { type: 'number', min: -1, max: 2 } } },
  args: {
    id: 'address-suggestions',
    label: 'Address suggestions',
    activeIndex: -1,
    suggestions: [
      { id: '1', primary: '1200 Main St', secondary: 'Houston, TX 77002' },
      { id: '2', primary: '1200 Maple Ave', secondary: 'Austin, TX 78701' },
      { id: '3', primary: '1200 Oak Ln', secondary: 'Dallas, TX 75201' },
    ],
    onSelect: fn(),
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof SuggestionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('option', { name: /1200 Maple Ave/ }));
    await expect(args.onSelect).toHaveBeenCalledWith(args.suggestions[1]);
  },
};
