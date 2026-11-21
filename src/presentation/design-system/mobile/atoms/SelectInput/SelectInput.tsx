import { useId, useState, type SelectHTMLAttributes } from 'react';

import { cx } from '@shared/utils/cx';

import { Icon } from '../Icon';
import styles from './SelectInput.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'children' | 'multiple'> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  invalid?: boolean;
}

/** Native select with the InputText look (canvas 1H "State"). Native picker = best mobile UX. */
export const SelectInput = ({
  label,
  value,
  onValueChange,
  options,
  invalid = false,
  disabled,
  id,
  className,
  onFocus,
  onBlur,
  ...rest
}: SelectInputProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;

  return (
    <div
      className={cx(
        styles.field,
        focused && styles.focused,
        invalid && styles.invalid,
        disabled && styles.disabled,
        className,
      )}
    >
      <label htmlFor={selectId} className={cx(styles.label, floating && styles.floating)}>
        {label}
      </label>
      <select
        id={selectId}
        className={cx(styles.select, !value && styles.empty)}
        value={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(event) => onValueChange(event.target.value)}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...rest}
      >
        <option value="" disabled hidden>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.chevron} aria-hidden="true">
        <Icon name="chevron-down" />
      </span>
    </div>
  );
};
