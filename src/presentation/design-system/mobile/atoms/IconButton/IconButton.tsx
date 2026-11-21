import type { ButtonHTMLAttributes } from 'react';

import { cx } from '@shared/utils/cx';

import type { IconName } from '../../../icons';
import { Icon } from '../Icon';
import styles from './IconButton.module.css';

export type IconButtonSize = 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Required: icon-only buttons need an accessible name (e.g. "Back", "Close"). */
  label: string;
  /** md: 44px hit area with a 40px circle (top bar). lg: 48px circle (next to the CTA). */
  size?: IconButtonSize;
}

/** Round icon button with the filled-gray circle from the canvas ("Atoms / Icon Button"). */
export const IconButton = ({ icon, label, size = 'md', type = 'button', className, ...rest }: IconButtonProps) => (
  <button type={type} aria-label={label} className={cx(styles.iconButton, styles[size], className)} {...rest}>
    <span className={styles.circle}>
      <Icon name={icon} />
    </span>
  </button>
);
