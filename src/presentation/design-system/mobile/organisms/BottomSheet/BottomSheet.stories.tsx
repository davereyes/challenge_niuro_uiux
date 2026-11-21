import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen } from 'storybook/test';

import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { mobileStory } from '../../../storybook/platform';
import { BottomSheet, type BottomSheetProps } from './BottomSheet';

const Demo = (args: BottomSheetProps) => {
  const [open, setOpen] = useState(args.open);
  return (
    <>
      <Button label="Open sheet" onClick={() => setOpen(true)} />
      <BottomSheet
        {...args}
        open={open}
        onClose={() => {
          setOpen(false);
          args.onClose();
        }}
      >
        <div style={{ padding: 'var(--space-6)' }}>
          <Text id={args.labelledBy} variant="heading" align="center">
            Sheet title
          </Text>
        </div>
      </BottomSheet>
    </>
  );
};

/** Base container used by PickerSheet and ConfirmSheet. `showClose` is a control. */
const meta = {
  title: 'Mobile/Organisms/BottomSheet',
  component: BottomSheet,
  ...mobileStory,
  render: (args) => <Demo {...args} />,
  argTypes: { children: { control: false } },
  args: { open: true, showClose: true, labelledBy: 'sheet-demo-title', onClose: fn(), children: null },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, userEvent }) => {
    const dialog = await screen.findByRole('dialog', { name: 'Sheet title' });
    await expect(dialog).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};
