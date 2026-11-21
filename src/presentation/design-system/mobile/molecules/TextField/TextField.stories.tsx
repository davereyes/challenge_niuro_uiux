import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { ICON_NAMES } from '../../../icons';
import { mobileStory } from '../../../storybook/platform';
import { TextField, type TextFieldProps } from './TextField';

const Controlled = (args: TextFieldProps) => {
  const [value, setValue] = useState(args.value);
  return (
    <TextField
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        args.onValueChange(next);
      }}
    />
  );
};

/** Helper vs error are data (controls): fill `errorMessage` to see the error state (canvas 2B). */
const meta = {
  title: 'Mobile/Molecules/TextField',
  component: TextField,
  ...mobileStory,
  render: (args) => <Controlled {...args} />,
  argTypes: {
    icon: { control: 'select', options: [undefined, ...ICON_NAMES] },
    mask: { control: 'inline-radio', options: ['none', 'phone', 'ssn', 'zip'] },
    type: { control: 'inline-radio', options: ['text', 'email', 'tel'] },
  },
  args: {
    label: 'Business name',
    value: '',
    helperText: 'As it appears on your bank account',
    errorMessage: undefined,
    disabled: false,
    onValueChange: fn(),
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByLabelText(args.label)).toHaveAccessibleDescription(args.helperText ?? '');
  },
};

/** Same component with an error message (2B). */
export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    icon: 'email',
    value: 'maria.lopez@gmail',
    helperText: undefined,
    errorMessage: 'Enter a valid email, like name@example.com',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a valid email');
    await expect(canvas.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  },
};
