import { useMemo, useState } from 'react';

import { daysInMonth, MONTH_NAMES, yearsDescending, type CalendarDate } from '../../../utils/calendar';
import { PickerSheet } from '../PickerSheet';

export interface DatePickerSheetProps {
  open: boolean;
  title: string;
  value: CalendarDate | null;
  /** Wheels start here when there is no value (canvas: January 1, 1990). */
  defaultValue: CalendarDate;
  /** Latest selectable date (e.g. today − 18 years). Later dates render disabled and bounce. */
  max: CalendarDate;
  minYear: number;
  onDone: (value: CalendarDate) => void;
  onCancel: () => void;
}

const isAfter = (a: CalendarDate, b: CalendarDate) =>
  a.year !== b.year ? a.year > b.year : a.month !== b.month ? a.month > b.month : a.day > b.day;

/** Month / day / year wheels (canvas 1J "Date of birth"). Feb 30 and dates after `max` bounce. */
export const DatePickerSheet = ({ open, title, value, defaultValue, max, minYear, onDone, onCancel }: DatePickerSheetProps) => {
  const [pending, setPending] = useState<CalendarDate>(value ?? defaultValue);

  // Reset the wheels each time the sheet opens (state adjustment during render, no effect needed)
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setPending(value ?? defaultValue);
  }

  const years = useMemo(() => yearsDescending(max.year, minYear), [max.year, minYear]);

  const monthItems = useMemo(
    () =>
      MONTH_NAMES.map((name, month) => ({
        value: String(month),
        label: name,
        disabled: isAfter({ year: pending.year, month, day: 1 }, max),
      })),
    [pending.year, max],
  );

  const dayItems = useMemo(() => {
    const length = daysInMonth(pending.year, pending.month);
    return Array.from({ length: 31 }, (_, index) => {
      const day = index + 1;
      return {
        value: String(day),
        label: String(day),
        disabled: day > length || isAfter({ year: pending.year, month: pending.month, day }, max),
      };
    });
  }, [pending.year, pending.month, max]);

  const yearItems = useMemo(() => years.map((year) => ({ value: String(year), label: String(year) })), [years]);

  const update = (patch: Partial<CalendarDate>) => setPending((current) => ({ ...current, ...patch }));

  return (
    <PickerSheet
      open={open}
      title={title}
      onCancel={onCancel}
      onDone={() => {
        const day = Math.min(pending.day, daysInMonth(pending.year, pending.month));
        const candidate = { ...pending, day };
        onDone(isAfter(candidate, max) ? max : candidate);
      }}
      columns={[
        { id: 'month', label: 'Month', items: monthItems, value: String(pending.month), onChange: (v) => update({ month: Number(v) }), flex: 1.6 },
        { id: 'day', label: 'Day', items: dayItems, value: String(pending.day), onChange: (v) => update({ day: Number(v) }), flex: 0.7, align: 'center' },
        { id: 'year', label: 'Year', items: yearItems, value: String(pending.year), onChange: (v) => update({ year: Number(v) }), align: 'end' },
      ]}
    />
  );
};
