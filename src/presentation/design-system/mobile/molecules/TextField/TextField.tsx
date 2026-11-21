import { useId } from 'react';

import { InputText, type InputTextProps } from '../../atoms/InputText';
import { Text } from '../../atoms/Text';
import styles from './TextField.module.css';

export interface TextFieldProps extends Omit<InputTextProps, 'invalid'> {
  /** Hint under the field (e.g. "As it appears on your bank account"). */
  helperText?: string | undefined;
  /** Error under the field. When present the field switches to its error state and the message is announced. */
  errorMessage?: string | undefined;
}

/**
 * InputText + helper/error message, wired for a11y (aria-describedby, role="alert").
 * Canvas: 1E helper text and 2B "Enter a valid email, like name@example.com".
 */
export const TextField = ({ helperText, errorMessage, id, ...inputProps }: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = errorMessage ?? helperText;
  const invalid = Boolean(errorMessage);

  return (
    <div className={styles.field}>
      <InputText id={inputId} invalid={invalid} aria-describedby={message ? messageId : undefined} {...inputProps} />
      {message && (
        <Text
          id={messageId}
          variant="caption"
          tone={invalid ? 'danger' : 'muted'}
          className={styles.message}
          {...(invalid ? { as: 'p' } : {})}
        >
          {invalid ? <span role="alert">{message}</span> : message}
        </Text>
      )}
    </div>
  );
};
