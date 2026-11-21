import type { ButtonHTMLAttributes, Ref } from 'react';

import { cx } from '@shared/utils/cx';

import type { IconName } from '../../../icons';
import { Icon } from '../../atoms/Icon';
import { IconCircle } from '../../atoms/IconCircle';
import styles from './OptionCard.module.css';

export interface OptionCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'role'> {
  label: string;
  description?: string | undefined;
  icon?: IconName | undefined;
  selected: boolean;
  ref?: Ref<HTMLButtonElement> | undefined;
}

/**
 * Single-choice card (canvas 1D / 1G). Renders role="radio"; use inside OptionCardGroup,
 * which provides the radiogroup and arrow-key navigation.
 */
export const OptionCard = ({ label, description, icon, selected, className, type = 'button', ...rest }: OptionCardProps) => (
  <button
    type={type}
    role="radio"
    aria-checked={selected}
    className={cx(styles.card, selected && styles.selected, className)}
    {...rest}
  >
    {icon && <IconCircle icon={icon} tone="surface" />}
    <span className={styles.text}>
      <span className={styles.label}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
    </span>
    <span className={styles.radio} aria-hidden="true">
      {selected && <Icon name="check" size="xs" />}
    </span>
  </button>
);
