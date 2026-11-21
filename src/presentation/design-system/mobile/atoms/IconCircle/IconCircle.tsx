import type { ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import type { IconName } from '../../../icons';
import { Icon } from '../Icon';
import styles from './IconCircle.module.css';

export type IconCircleSize = 'md' | 'lg';
export type IconCircleTone = 'surface' | 'brand' | 'danger' | 'success' | 'onBrand' | 'onImage';

export interface IconCircleProps {
  /** Icon to show. Use `children` instead for text (e.g. step numbers). */
  icon?: IconName | undefined;
  children?: ReactNode;
  /** md 40px (cards, option cards) · lg 64px (status screens and sheets) */
  size?: IconCircleSize;
  tone?: IconCircleTone;
  className?: string | undefined;
}

/** Decorative round icon container. Always aria-hidden: the meaning lives in the adjacent text. */
export const IconCircle = ({ icon, children, size = 'md', tone = 'surface', className }: IconCircleProps) => (
  <span aria-hidden="true" className={cx(styles.circle, styles[size], styles[tone], className)}>
    {icon ? <Icon name={icon} size={size === 'lg' ? 'lg' : 'md'} className={styles.icon} /> : children}
  </span>
);
