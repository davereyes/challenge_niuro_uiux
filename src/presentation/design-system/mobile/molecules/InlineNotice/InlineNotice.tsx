import type { ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import type { IconName } from '../../../icons';
import { Icon } from '../../atoms/Icon';
import styles from './InlineNotice.module.css';

export type InlineNoticeVariant = 'info' | 'hint' | 'secure' | 'error';

const DEFAULT_ICON: Record<InlineNoticeVariant, IconName> = {
  info: 'info',
  hint: 'info',
  secure: 'shield-check',
  error: 'alert-circle',
};

export interface InlineNoticeProps {
  variant?: InlineNoticeVariant;
  /** Bold lead-in shown before the text ("Sell to customers?", "We couldn't save your info."). */
  title?: string | undefined;
  children: ReactNode;
  icon?: IconName | undefined;
  className?: string | undefined;
}

/**
 * Icon + short text. info: boxed (1H) · hint: plain, small (1D) · secure: plain (1I SSN note) ·
 * error: red banner (2I), announced with role="alert".
 */
export const InlineNotice = ({ variant = 'info', title, children, icon, className }: InlineNoticeProps) => (
  <div role={variant === 'error' ? 'alert' : undefined} className={cx(styles.notice, styles[variant], className)}>
    <Icon name={icon ?? DEFAULT_ICON[variant]} size={variant === 'hint' ? 'sm' : 'md'} className={styles.icon} />
    <p className={styles.text}>
      {title && <span className={styles.title}>{title}</span>} {children}
    </p>
  </div>
);
