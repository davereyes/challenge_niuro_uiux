import type { ButtonHTMLAttributes } from 'react';

import { cx } from '@shared/utils/cx';

import { IconButton } from '../IconButton';
import { Spinner } from '../Spinner';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'destructive';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visible text. */
  label: string;
  /** `destructive` is proposed in the canvas (2C · Leave confirmation), not yet in the DS page. */
  variant?: ButtonVariant;
  /** Shows a spinner, keeps the width and blocks interaction. */
  loading?: boolean;
  /** Renders the round back IconButton to the left of the pill (canvas `showBack`). */
  showBackIcon?: boolean;
  /** Click handler for the back IconButton. */
  onBack?: (() => void) | undefined;
  /** Accessible name of the back IconButton. */
  backLabel?: string;
}

/**
 * Pill button, 48px, full width of its container ("Atoms / Button" in the canvas).
 * In the Apply Now flow the CTA always uses `showBackIcon`.
 */
export const Button = ({
  label,
  variant = 'primary',
  loading = false,
  showBackIcon = false,
  onBack,
  backLabel = 'Back',
  disabled,
  type = 'button',
  className,
  ...rest
}: ButtonProps) => {
  const button = (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={loading ? `${label}, loading` : undefined}
      className={cx(styles.button, styles[variant], loading && styles.loading, !showBackIcon && className)}
      {...rest}
    >
      {loading ? <Spinner tone="current" /> : <span className={styles.label}>{label}</span>}
    </button>
  );

  if (!showBackIcon) return button;

  return (
    <div className={cx(styles.withBack, className)}>
      <IconButton icon="back" size="lg" label={backLabel} onClick={onBack} />
      {button}
    </div>
  );
};
