import type { ButtonHTMLAttributes } from 'react';

import { cx } from '@shared/utils/cx';

import { Icon } from '../Icon';
import styles from './PickerField.module.css';

export interface PickerFieldProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
  label: string;
  /** Formatted value ("March 2021", "June 4, 1990"). Empty = not picked yet. */
  value: string;
  /** The picker (bottom sheet) it opens is currently open: focus styling + aria-expanded. */
  active?: boolean;
  invalid?: boolean;
}

/** Field-looking button that opens a picker sheet (canvas 1E "Month and year", 1I "Date of birth"). */
export const PickerField = ({
  label,
  value,
  active = false,
  invalid = false,
  disabled,
  className,
  type = 'button',
  ...rest
}: PickerFieldProps) => {
  const floating = active || value.length > 0;

  return (
    <button
      type={type}
      aria-haspopup="dialog"
      aria-expanded={active}
      disabled={disabled}
      className={cx(styles.field, active && styles.active, invalid && styles.invalid, className)}
      {...rest}
    >
      {/* Accessible name = visible text: "Month and year March 2021" */}
      <span className={cx(styles.label, floating && styles.floating)}>{label}</span>{' '}
      <span className={styles.value}>
        {value}
      </span>
      <span className={styles.chevron} aria-hidden="true">
        <Icon name="chevron-down" />
      </span>
    </button>
  );
};
