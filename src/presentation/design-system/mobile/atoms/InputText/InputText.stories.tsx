import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { ICON_NAMES } from '../../../icons';
import { mobileStory } from '../../../storybook/platform';
import { InputText, type InputTextProps } from './InputText';

/** Controlled field: the story keeps the value in local state so controls and typing both work. */
const Controlled = (args: InputTextProps) => {
  const [value, setValue] = useState(args.value);
  return (
    <InputText
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        args.onValueChange(next);
      }}
    />
  );
};

/**
 * Canvas "Input Text — States": default, focus, typing, filled, error, disabled are **states**, so they are
 * controls (`value`, `invalid`, `disabled`) plus real focus. Stories only change the input **kind**.
 */
const meta = {
  title: 'Mobile/Atoms/InputText',
  component: InputText,
  ...mobileStory,
  render: (args) => <Controlled {...args} />,
  argTypes: {
    icon: { control: 'select', options: [undefined, ...ICON_NAMES] },
    type: { control: 'inline-radio', options: ['text', 'email', 'tel'] },
    mask: { control: 'inline-radio', options: ['none', 'phone', 'ssn', 'zip'] },
  },
  args: {
    label: 'First name',
    value: '',
    type: 'text',
    mask: 'none',
    invalid: false,
    disabled: false,
    readOnly: false,
    revealable: false,
    onValueChange: fn(),
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const input = canvas.getByLabelText(args.label);
    await userEvent.type(input, 'Maria');
    await expect(input).toHaveValue('Maria');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear text' }));
    await expect(input).toHaveValue('');
  },
};

export const Phone: Story = {
  args: { label: 'Number', type: 'tel', mask: 'phone', icon: 'phone', autoComplete: 'tel-national' },
  play: async ({ canvas, args, userEvent }) => {
    const input = canvas.getByLabelText(args.label);
    await userEvent.type(input, '3055550123');
    await expect(input).toHaveValue('(305) 555-0123');
  },
};

export const Email: Story = {
  args: { label: 'Email', type: 'email', icon: 'email', autoComplete: 'email' },
};

/** SSN: masked, numeric keypad, show/hide toggle (business rule 1I). */
export const Secret: Story = {
  args: { label: 'Social Security number', mask: 'ssn', revealable: true, autoComplete: 'off' },
  play: async ({ canvas, args, userEvent }) => {
    const input = canvas.getByLabelText(args.label);
    await userEvent.type(input, '123456789');
    await expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(canvas.getByRole('button', { name: `Show ${args.label}` }));
    await expect(input).toHaveAttribute('type', 'text');
    await expect(input).toHaveValue('123-45-6789');
  },
};
