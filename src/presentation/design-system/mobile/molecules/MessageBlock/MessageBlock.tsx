import type { ElementType, ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import type { IconName } from '../../../icons';
import { IconCircle, type IconCircleTone } from '../../atoms/IconCircle';
import { Text } from '../../atoms/Text';
import styles from './MessageBlock.module.css';

export type MessageBlockVariant = 'page' | 'sheet';

export interface MessageBlockProps {
  icon: IconName;
  tone?: IconCircleTone;
  title: string;
  description?: ReactNode;
  /** page: left aligned, 28/34 title (2E, 2F) · sheet: centered, 22/28 title (2C, 2D) */
  variant?: MessageBlockVariant;
  titleId?: string | undefined;
  titleAs?: ElementType;
  className?: string | undefined;
}

/** Big icon + title + text. Used by status screens and confirmation sheets. */
export const MessageBlock = ({
  icon,
  tone = 'brand',
  title,
  description,
  variant = 'page',
  titleId,
  titleAs,
  className,
}: MessageBlockProps) => (
  <div className={cx(styles.block, styles[variant], className)}>
    <IconCircle icon={icon} tone={tone} size="lg" />
    <Text
      id={titleId}
      variant={variant === 'page' ? 'title' : 'heading'}
      align={variant === 'page' ? 'start' : 'center'}
      as={titleAs ?? (variant === 'page' ? 'h1' : 'h2')}
    >
      {title}
    </Text>
    {description && (
      <Text tone="secondary" align={variant === 'page' ? 'start' : 'center'}>
        {description}
      </Text>
    )}
  </div>
);
