import { cx } from '@shared/utils/cx';

import styles from './Tag.module.css';

export interface TagProps {
  label: string;
  className?: string | undefined;
}

/** Outlined pill used as section eyebrow on the landing ("Our audience", "FAQ"). */
export const Tag = ({ label, className }: TagProps) => <span className={cx(styles.tag, className)}>{label}</span>;
