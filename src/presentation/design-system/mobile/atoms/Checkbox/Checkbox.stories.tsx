import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { Checkbox, type CheckboxProps } from './Checkbox';

const Controlled = (args: CheckboxProps) => {
  const [checked, setChecked] = useState(Boolean(args.checked));
  return (
    <Checkbox
      {...args}
      checked={checked}
      onChange={(event) => {
        setChecked(event.target.checked);
        args.onChange?.(event);
      }}
    />
  );
};

/** Canvas "Checkbox — States": unchecked, checked, error, disabled, disabled on → all controls. */
const meta = {
  title: 'Mobile/Atoms/Checkbox',
  component: Checkbox,
  ...mobileStory,
  render: (args) => <Controlled {...args} />,
  args: { 'aria-label': 'Accept', checked: false, invalid: false, disabled: false, onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept' });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};
