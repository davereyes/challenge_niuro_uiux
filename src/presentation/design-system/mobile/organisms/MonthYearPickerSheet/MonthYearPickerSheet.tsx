import { useMemo, useState } from 'react';

import { MONTH_NAMES, yearsDescending, type YearMonth } from '../../../utils/calendar';
import { PickerSheet } from '../PickerSheet';

export interface MonthYearPickerSheetProps {
  open: boolean;
  title: string;
  /** Current value; when empty the wheels start at `max`. */
  value: YearMonth | null;
  /** Latest selectable month (later months render disabled and bounce). */
  max: YearMonth;
  /** Oldest year in the wheel. */
  minYear: number;
  onDone: (value: YearMonth) => void;
  onCancel: () => void;
}

/** Month + year wheels (canvas 1F "Start date"). Constraints come from the caller (domain rules). */
export const MonthYearPickerSheet = ({ open, title, value, max, minYear, onDone, onCancel }: MonthYearPickerSheetProps) => {
  const [pending, setPending] = useState<YearMonth>(value ?? max);

  // Reset the wheels each time the sheet opens (state adjustment during render, no effect needed)
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setPending(value ?? max);
  }

  const years = useMemo(() => yearsDescending(max.year, minYear), [max.year, minYear]);
  const monthItems = useMemo(
    () =>
      MONTH_NAMES.map((name, index) => ({
        value: String(index),
        label: name,
        disabled: pending.year === max.year && index > max.month,
      })),
    [pending.year, max.year, max.month],
  );
  const yearItems = useMemo(() => years.map((year) => ({ value: String(year), label: String(year) })), [years]);

  return (
    <PickerSheet
      open={open}
      title={title}
      onCancel={onCancel}
      onDone={() => {
        const month = pending.year === max.year ? Math.min(pending.month, max.month) : pending.month;
        onDone({ year: pending.year, month });
      }}
      columns={[
        {
          id: 'month',
          label: 'Month',
          items: monthItems,
          value: String(pending.month),
          onChange: (next) => setPending((current) => ({ ...current, month: Number(next) })),
          flex: 1.5,
        },
        {
          id: 'year',
          label: 'Year',
          items: yearItems,
          value: String(pending.year),
          onChange: (next) => setPending((current) => ({ ...current, year: Number(next) })),
          align: 'end',
        },
      ]}
    />
  );
};
