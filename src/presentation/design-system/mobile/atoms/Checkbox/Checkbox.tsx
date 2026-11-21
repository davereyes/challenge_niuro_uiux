import type { InputHTMLAttributes } from 'react';

import { cx } from '@shared/utils/cx';

import { Icon } from '../Icon';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Unchecked + required not met: red border (canvas "Error"). */
  invalid?: boolean;
}

/**
 * "Atoms / Checkbox": 24px box, 44px hit area. Needs an accessible name: either `aria-label`
 * or an external <label htmlFor> (see the CheckboxLabel molecule).
 */
export const Checkbox = ({ invalid = false, checked, disabled, className, ...rest }: CheckboxProps) => (
  <span className={cx(styles.checkbox, className)}>
    <input
      type="checkbox"
      className={styles.input}
      checked={checked}
      disabled={disabled}
      aria-invalid={(invalid && !checked) || undefined}
      {...rest}
    />
    <span className={cx(styles.box, invalid && !checked && styles.invalid)} aria-hidden="true">
      <Icon name="check" size="sm" className={styles.check} />
    </span>
  </span>
);
