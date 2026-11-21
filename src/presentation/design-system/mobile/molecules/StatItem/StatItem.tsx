import { cx } from '@shared/utils/cx';

import styles from './StatItem.module.css';

export interface StatItemProps {
  value: string;
  label: string;
  className?: string | undefined;
}

/** Big number + caption ("A few facts in numbers"). */
export const StatItem = ({ value, label, className }: StatItemProps) => (
  <div className={cx(styles.stat, className)}>
    <span className={styles.value}>{value}</span>
    <span className={styles.label}>{label}</span>
  </div>
);
