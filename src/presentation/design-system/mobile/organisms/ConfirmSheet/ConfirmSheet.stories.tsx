import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen } from 'storybook/test';

import { Button } from '../../atoms/Button';
import { mobileStory } from '../../../storybook/platform';
import { ConfirmSheet, type ConfirmSheetProps } from './ConfirmSheet';

const Demo = (args: ConfirmSheetProps) => {
  const [open, setOpen] = useState(args.open);
  return (
    <>
      <Button label="Open" onClick={() => setOpen(true)} />
      <ConfirmSheet
        {...args}
        open={open}
        onClose={() => {
          setOpen(false);
          args.onClose();
        }}
      />
    </>
  );
};

/** Two canvas usages as variants: Leave (2C) and Resume (2D). */
const meta = {
  title: 'Mobile/Organisms/ConfirmSheet',
  component: ConfirmSheet,
  ...mobileStory,
  render: (args) => <Demo {...args} />,
  argTypes: { actions: { control: false }, icon: { control: false } },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof ConfirmSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const onLeave = fn();

export const Leave: Story = {
  args: {
    open: true,
    onClose: fn(),
    icon: 'alert-circle',
    tone: 'danger',
    title: 'Leave your application?',
    actions: (
      <>
        <Button variant="destructive" label="Yes, leave" onClick={onLeave} />
        <Button variant="tertiary" label="Keep going" />
      </>
    ),
  },
  play: async ({ userEvent }) => {
    await screen.findByRole('dialog', { name: 'Leave your application?' });
    await userEvent.click(screen.getByRole('button', { name: 'Yes, leave' }));
    await expect(onLeave).toHaveBeenCalledOnce();
  },
};

export const Resume: Story = {
  args: {
    open: true,
    onClose: fn(),
    icon: 'user-filled',
    tone: 'brand',
    title: 'Welcome back, Maria',
    description: 'Pick up where you left off: step 4 of 7.',
    actions: (
      <>
        <Button label="Continue application" />
        <Button variant="tertiary" label="Start over" />
      </>
    ),
  },
};
