import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { mobileStory } from '../../../storybook/platform';
import { AccordionItem, type AccordionItemProps } from './AccordionItem';

const Controlled = (args: AccordionItemProps) => {
  const [open, setOpen] = useState(args.open);
  return (
    <AccordionItem
      {...args}
      open={open}
      onToggle={() => {
        setOpen((value) => !value);
        args.onToggle();
      }}
    />
  );
};

/** `open` is a state → control. */
const meta = {
  title: 'Mobile/Molecules/AccordionItem',
  component: AccordionItem,
  ...mobileStory,
  render: (args) => <Controlled {...args} />,
  args: {
    question: 'Does this affect my credit score?',
    answer: 'No, this does not affect your credit score. We do a soft credit check that does not impact your credit score.',
    open: false,
    onToggle: fn(),
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof AccordionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /credit score/ });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
};
