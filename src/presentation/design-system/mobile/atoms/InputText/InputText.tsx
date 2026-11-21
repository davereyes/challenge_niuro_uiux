import { useId, useRef, useState, type InputHTMLAttributes } from 'react';

import { cx } from '@shared/utils/cx';

import type { IconName } from '../../../icons';
import { applyMask, MASK_MAX_LENGTH, type InputMask } from '../../../utils/masks';
import { Icon } from '../Icon';
import styles from './InputText.module.css';

export type InputTextType = 'text' | 'email' | 'tel';

export interface InputTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'size' | 'placeholder'> {
  /** Floating label (inside the field, as in the canvas). */
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  type?: InputTextType;
  /** Display formatting while typing. */
  mask?: InputMask;
  /** Trailing decorative icon (phone, email, search, lock…). */
  icon?: IconName | undefined;
  /** Error state: red border + error icon. The message lives in the TextField molecule. */
  invalid?: boolean;
  /** Masks the value with a show/hide toggle (SSN). */
  revealable?: boolean;
}

const PLACEHOLDER_BY_MASK: Partial<Record<InputMask, string>> = { phone: '(555) 555-5555' };

/** "Atoms / Input Text" — filled field with floating label, clear button and error icon. */
export const InputText = ({
  label,
  value,
  onValueChange,
  type = 'text',
  mask = 'none',
  icon,
  invalid = false,
  revealable = false,
  disabled,
  readOnly,
  id,
  className,
  onFocus,
  onBlur,
  inputMode,
  maxLength,
  ...rest
}: InputTextProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const hasValue = value.length > 0;
  const floating = focused || hasValue;
  const editable = !disabled && !readOnly;
  const showClear = editable && focused && hasValue && !revealable;
  const showErrorIcon = invalid && !showClear;
  const placeholder = focused && !hasValue ? PLACEHOLDER_BY_MASK[mask] : undefined;
  const numericMask = mask === 'ssn' || mask === 'zip';

  const clear = () => {
    onValueChange('');
    inputRef.current?.focus();
  };

  return (
    <div
      className={cx(
        styles.field,
        focused && editable && styles.focused,
        invalid && styles.invalid,
        disabled && styles.disabled,
        className,
      )}
    >
      <div className={styles.control}>
        <label htmlFor={inputId} className={cx(styles.label, floating && styles.floating)}>
          {label}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          className={styles.input}
          type={revealable && !revealed ? 'password' : type}
          inputMode={inputMode ?? (numericMask ? 'numeric' : type === 'tel' ? 'tel' : type === 'email' ? 'email' : 'text')}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength ?? (mask === 'none' ? undefined : MASK_MAX_LENGTH[mask])}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          onChange={(event) => onValueChange(applyMask(mask, event.target.value))}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />
      </div>

      {showClear && (
        <button
          type="button"
          className={styles.action}
          aria-label="Clear text"
          // Out of the tab order: it only exists while the input is focused, so tabbing to it would
          // blur the input, unmount the button and drop focus. Touch/mouse users tap it directly.
          tabIndex={-1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={clear}
        >
          <Icon name="clear" />
        </button>
      )}
      {revealable && editable && (
        <button
          type="button"
          className={styles.action}
          aria-label={revealed ? `Hide ${label}` : `Show ${label}`}
          aria-pressed={revealed}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setRevealed((current) => !current)}
        >
          <Icon name={revealed ? 'eye-off' : 'eye'} />
        </button>
      )}
      {showErrorIcon && (
        <span className={cx(styles.adornment, styles.errorIcon)}>
          <Icon name="alert-circle" label="Error" />
        </span>
      )}
      {icon && !revealable && (
        <span className={styles.adornment} aria-hidden="true">
          <Icon name={icon} />
        </span>
      )}
    </div>
  );
};
