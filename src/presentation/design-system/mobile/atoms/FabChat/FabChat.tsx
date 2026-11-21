import type { ButtonHTMLAttributes } from 'react';

import { cx } from '@shared/utils/cx';

import { Icon } from '../Icon';
import styles from './FabChat.module.css';

export interface FabChatProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label?: string;
}

/** "Atoms / FAB Chat": 56px brand circle. Positioning/drag lives in the DraggableFab organism. */
export const FabChat = ({ label = 'Chat with us', type = 'button', className, ...rest }: FabChatProps) => (
  <button type={type} aria-label={label} className={cx(styles.fab, className)} {...rest}>
    <Icon name="chat" size="lg" />
  </button>
);
