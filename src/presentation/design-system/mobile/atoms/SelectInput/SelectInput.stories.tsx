import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { SelectInput, type SelectInputProps } from './SelectInput';

const Controlled = (args: SelectInputProps) => {
  const [value, setValue] = useState(args.value);
  return (
    <SelectInput
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        args.onValueChange(next);
      }}
    />
  );
};

/** One story; empty/filled/invalid/disabled are controls. */
const meta = {
  title: 'Mobile/Atoms/SelectInput',
  component: SelectInput,
  ...mobileStory,
  render: (args) => <Controlled {...args} />,
  argTypes: { options: { control: false } },
  args: {
    label: 'State',
    value: '',
    invalid: false,
    disabled: false,
    options: [
      { value: 'FL', label: 'Florida' },
      { value: 'TX', label: 'Texas' },
      { value: 'CA', label: 'California' },
    ],
    onValueChange: fn(),
  },
  decorators: [(Story) => <div style={{ width: '13.5rem' }}><Story /></div>],
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.selectOptions(canvas.getByLabelText('State'), 'TX');
    await expect(args.onValueChange).toHaveBeenCalledWith('TX');
  },
};
