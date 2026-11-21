import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen } from 'storybook/test';

import { formatCalendarDate, type CalendarDate } from '../../../utils/calendar';
import { PickerField } from '../../atoms/PickerField';
import { mobileStory } from '../../../storybook/platform';
import { DatePickerSheet, type DatePickerSheetProps } from './DatePickerSheet';

const Demo = (args: DatePickerSheetProps) => {
  const [open, setOpen] = useState(args.open);
  const [value, setValue] = useState<CalendarDate | null>(args.value);
  return (
    <>
      <PickerField label="Date of birth" value={value ? formatCalendarDate(value) : ''} active={open} onClick={() => setOpen(true)} />
      <DatePickerSheet
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

/** 18+ rule example: max = November 20, 2008 (today − 18 years in the prototype). */
const meta = {
  title: 'Mobile/Organisms/DatePickerSheet',
  component: DatePickerSheet,
  ...mobileStory,
  render: (args) => <Demo {...args} />,
  args: {
    open: true,
    title: 'Date of birth',
    value: null,
    defaultValue: { year: 1990, month: 0, day: 1 },
    max: { year: 2008, month: 10, day: 20 },
    minYear: 1926,
    onDone: fn(),
    onCancel: fn(),
  },
  decorators: [(Story) => <div style={{ width: '21.375rem' }}><Story /></div>],
} satisfies Meta<typeof DatePickerSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, userEvent }) => {
    await screen.findByRole('dialog', { name: 'Date of birth' });
    await expect(screen.getByRole('spinbutton', { name: 'Year' })).toHaveAttribute('aria-valuetext', '1990');
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await expect(args.onDone).toHaveBeenCalledWith({ year: 1990, month: 0, day: 1 });
  },
};
