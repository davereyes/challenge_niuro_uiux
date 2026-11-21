import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { PickerField } from './PickerField';

/** One story; empty/picked (`value`), `active` (sheet open), `invalid`, `disabled` are controls. */
const meta = {
  title: 'Mobile/Atoms/PickerField',
  component: PickerField,
  ...mobileStory,
  args: { label: 'Month and year', value: '', active: false, invalid: false, disabled: false, onClick: fn() },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof PickerField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: args.label }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
