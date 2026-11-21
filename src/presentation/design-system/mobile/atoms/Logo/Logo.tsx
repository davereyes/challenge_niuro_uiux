import { cx } from '@shared/utils/cx';

import logoBrand from '../../../assets/brand/logo-brand.svg';
import logoWhite from '../../../assets/brand/logo-white.svg';
import styles from './Logo.module.css';

export type LogoSize = 'sm' | 'md' | 'lg';
export type LogoColor = 'brand' | 'white';

const SOURCES: Record<LogoColor, string> = { brand: logoBrand, white: logoWhite };

export interface LogoProps {
  /** sm 24 · md 32 · lg 40 (height) */
  size?: LogoSize;
  color?: LogoColor;
  className?: string | undefined;
}

export const Logo = ({ size = 'md', color = 'brand', className }: LogoProps) => (
  <img src={SOURCES[color]} alt="Fundo" className={cx(styles.logo, styles[size], className)} />
);
