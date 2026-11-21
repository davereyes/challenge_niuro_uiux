import { cx } from '@shared/utils/cx';

import { Tag } from '../../atoms/Tag';
import { Text } from '../../atoms/Text';
import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  eyebrow?: string | undefined;
  title: string;
  /** Muted tail of the title ("Who we" + "work with"). */
  titleMuted?: string | undefined;
  description?: string | undefined;
  titleId?: string | undefined;
  className?: string | undefined;
}

/** Landing section header: Tag + two-tone title + optional paragraph. */
export const SectionHeader = ({ eyebrow, title, titleMuted, description, titleId, className }: SectionHeaderProps) => (
  <div className={cx(styles.header, className)}>
    {eyebrow && <Tag label={eyebrow} />}
    <Text id={titleId} variant="section" as="h2">
      {title}
      {titleMuted && <span className={styles.muted}> {titleMuted}</span>}
    </Text>
    {description && (
      <Text variant="bodySmall" tone="secondary">
        {description}
      </Text>
    )}
  </div>
);
