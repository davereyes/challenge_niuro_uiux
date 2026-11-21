import { cx } from '@shared/utils/cx';

import { ICONS, type IconName } from '../../../icons';
import styles from './Icon.module.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconProps {
  name: IconName;
  /** xs 12 · sm 16 · md 20 (default, as in the canvas) · lg 24 */
  size?: IconSize;
  /** Accessible name. Omit for decorative icons (they get aria-hidden). */
  label?: string | undefined;
  className?: string | undefined;
}

export const Icon = ({ name, size = 'md', label, className }: IconProps) => {
  const icon = ICONS[name];
  const paint =
    icon.kind === 'fill'
      ? { fill: 'currentColor' }
      : { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <svg
      viewBox="0 0 24 24"
      className={cx(styles.icon, styles[size], className)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: false })}
    >
      <path d={icon.d} {...paint} />
    </svg>
  );
};
