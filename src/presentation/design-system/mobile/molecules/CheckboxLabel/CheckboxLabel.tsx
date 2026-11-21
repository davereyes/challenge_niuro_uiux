import { useId, type ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import { Checkbox, type CheckboxProps } from '../../atoms/Checkbox';
import styles from './CheckboxLabel.module.css';

export interface CheckboxLabelProps extends Omit<CheckboxProps, 'id' | 'onChange' | 'children'> {
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string | undefined;
}

/** "Molecules / Checkbox Label": checkbox + 14/20 label, whole row tappable. */
export const CheckboxLabel = ({ label, checked, onCheckedChange, id, disabled, className, ...rest }: CheckboxLabelProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cx(styles.row, disabled && styles.disabled, className)}>
      <Checkbox
        id={inputId}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        {...rest}
      />
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
    </div>
  );
};
