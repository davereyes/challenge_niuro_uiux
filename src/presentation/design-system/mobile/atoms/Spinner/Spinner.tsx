import { cx } from '@shared/utils/cx';

import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'brand' | 'current';

export interface SpinnerProps {
  /** sm 16 · md 20 (canvas) · lg 24 */
  size?: SpinnerSize;
  /** brand: gray track + navy arc (checklist). current: follows text color (inside buttons). */
  tone?: SpinnerTone;
  /** Announced to screen readers. Omit when the parent already announces the busy state. */
  label?: string | undefined;
  className?: string | undefined;
}

export const Spinner = ({ size = 'md', tone = 'brand', label, className }: SpinnerProps) => {
  const classes = cx(styles.spinner, styles[size], styles[tone], className);
  return label ? <output aria-label={label} className={classes} /> : <span aria-hidden="true" className={classes} />;
};
