import { cx } from '@shared/utils/cx';

import styles from './ProgressBar.module.css';

export type ProgressBarTone = 'default' | 'onImage';

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  label?: string;
  tone?: ProgressBarTone;
  className?: string | undefined;
}

/** 3px stepper bar under the TopBar (canvas "showStepper"). */
export const ProgressBar = ({ value, label = 'Application progress', tone = 'default', className }: ProgressBarProps) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cx(styles.track, styles[tone], className)}
    >
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
};
