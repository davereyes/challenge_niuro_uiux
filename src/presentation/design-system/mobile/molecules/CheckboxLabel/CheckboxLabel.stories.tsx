import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { CheckboxLabel, type CheckboxLabelProps } from './CheckboxLabel';

const Controlled = (args: CheckboxLabelProps) => {
  const [checked, setChecked] = useState(args.checked);
  return (
    <CheckboxLabel
      {...args}
      checked={checked}
      onCheckedChange={(next) => {
        setChecked(next);
        args.onCheckedChange(next);
      }}
    />
  );
};

/** Canvas "Checkbox Label — States": checked / error / disabled are controls. */
const meta = {
  title: 'Mobile/Molecules/CheckboxLabel',
  component: CheckboxLabel,
  ...mobileStory,
  render: (args) => <Controlled {...args} />,
  argTypes: { label: { control: 'text' } },
  args: {
    label: 'I agree to account-related calls and texts from Fundo.',
    checked: false,
    invalid: false,
    disabled: false,
    onCheckedChange: fn(),
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof CheckboxLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByText(String(args.label)));
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
