import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Text } from '../../atoms/Text';
import { mobileStory } from '../../../storybook/platform';
import { OptionCardGroup, type OptionCardGroupProps } from './OptionCardGroup';

const Demo = (args: OptionCardGroupProps<string>) => {
  const [value, setValue] = useState(args.value);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)', width: '21.375rem' }}>
      <Text id={args.labelledBy} variant="title">
        How do you make money?
      </Text>
      <OptionCardGroup
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange(next);
        }}
      />
    </div>
  );
};

/** Canvas 1D (3 options) and 1G (2 options) are the same organism with different data. */
const meta = {
  title: 'Mobile/Organisms/OptionCardGroup',
  component: OptionCardGroup,
  ...mobileStory,
  render: (args) => <Demo {...(args as OptionCardGroupProps<string>)} />,
  argTypes: { options: { control: false } },
  args: {
    labelledBy: 'question-income',
    value: null,
    onChange: fn(),
    options: [
      { value: 'business', label: 'My own business', description: 'Clients, business revenue', icon: 'store' },
      { value: 'gig', label: 'Gig or contract work', description: 'Uber, DoorDash, 1099', icon: 'car' },
      { value: 'job', label: 'A job or other income', description: 'W-2, unemployment, disability, retirement', icon: 'briefcase' },
    ],
  },
} satisfies Meta<typeof OptionCardGroup<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const first = canvas.getByRole('radio', { name: /My own business/ });
    await userEvent.click(first);
    await expect(first).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowDown}');
    await expect(args.onChange).toHaveBeenLastCalledWith('gig');
  },
};
