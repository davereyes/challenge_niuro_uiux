import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen } from 'storybook/test';

import { formatYearMonth, type YearMonth } from '../../../utils/calendar';
import { PickerField } from '../../atoms/PickerField';
import { mobileStory } from '../../../storybook/platform';
import { MonthYearPickerSheet, type MonthYearPickerSheetProps } from './MonthYearPickerSheet';

const Demo = (args: MonthYearPickerSheetProps) => {
  const [open, setOpen] = useState(args.open);
  const [value, setValue] = useState<YearMonth | null>(args.value);
  return (
    <>
      <PickerField label="Month and year" value={value ? formatYearMonth(value) : ''} active={open} onClick={() => setOpen(true)} />
      <MonthYearPickerSheet
        {...args}
        open={open}
        value={value}
        onCancel={() => {
          setOpen(false);
          args.onCancel();
        }}
        onDone={(next) => {
          setValue(next);
          setOpen(false);
          args.onDone(next);
        }}
      />
    </>
  );
};

/** Prototype "today" = November 2026: December 2026 is disabled. */
const meta = {
  title: 'Mobile/Organisms/MonthYearPickerSheet',
  component: MonthYearPickerSheet,
  ...mobileStory,
  render: (args) => <Demo {...args} />,
  args: {
    open: true,
    title: 'Start date',
    value: null,
    max: { year: 2026, month: 10 },
    minYear: 1980,
    onDone: fn(),
    onCancel: fn(),
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof MonthYearPickerSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, userEvent }) => {
    await screen.findByRole('dialog', { name: 'Start date' });
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await expect(args.onDone).toHaveBeenCalledWith({ year: 2026, month: 10 });
  },
};
