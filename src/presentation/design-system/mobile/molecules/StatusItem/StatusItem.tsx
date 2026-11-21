import { cx } from '@shared/utils/cx';

import { Icon } from '../../atoms/Icon';
import { Spinner } from '../../atoms/Spinner';
import styles from './StatusItem.module.css';

export type StatusItemStatus = 'pending' | 'active' | 'done';

export interface StatusItemProps {
  label: string;
  /** pending: hidden (not started) · active: spinner · done: green check */
  status: StatusItemStatus;
  className?: string | undefined;
}

/** One row of the "Checking your information" checklist (canvas 1G→). */
export const StatusItem = ({ label, status, className }: StatusItemProps) => (
  <li className={cx(styles.item, styles[status], className)} aria-hidden={status === 'pending' || undefined}>
    <span className={styles.indicator}>
      {status === 'done' ? <Icon name="check-circle" className={styles.check} /> : <Spinner />}
    </span>
    <span className={styles.label}>
      {label}
      {status === 'done' && <span className={styles.srOnly}>, done</span>}
    </span>
  </li>
);
