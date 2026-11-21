import { cx } from '@shared/utils/cx';

import { Icon } from '../Icon';
import styles from './ScanIllustration.module.css';

export interface ScanIllustrationProps {
  className?: string | undefined;
}

/** Decorative "checking your information" animation (canvas 1G→). Respects reduced motion. */
export const ScanIllustration = ({ className }: ScanIllustrationProps) => (
  <div aria-hidden="true" className={cx(styles.stage, className)}>
    <div className={styles.float}>
      <div className={styles.card}>
        <span className={styles.avatar}>
          <Icon name="user-filled" />
        </span>
        <span className={cx(styles.bar, styles.barA)}>
          <span className={styles.fill} />
        </span>
        <span className={cx(styles.bar, styles.barB)}>
          <span className={styles.fill} />
        </span>
        <span className={cx(styles.bar, styles.barC)}>
          <span className={cx(styles.fill, styles.accent)} />
        </span>
        <span className={cx(styles.bar, styles.barD)}>
          <span className={cx(styles.fill, styles.accent)} />
        </span>
        <span className={styles.scan} />
      </div>
      <span className={styles.badge}>
        <Icon name="check" size="sm" />
      </span>
    </div>
  </div>
);
