import { useId, type ReactNode } from 'react';

import type { IconName } from '../../../icons';
import type { IconCircleTone } from '../../atoms/IconCircle';
import { MessageBlock } from '../../molecules/MessageBlock';
import { BottomSheet } from '../BottomSheet';
import styles from './ConfirmSheet.module.css';

export interface ConfirmSheetProps {
  open: boolean;
  onClose: () => void;
  icon: IconName;
  tone?: IconCircleTone;
  title: string;
  description?: ReactNode;
  /** Stacked full-width Buttons (primary action first). */
  actions: ReactNode;
}

/** Decision sheet: icon, title, text and stacked actions (canvas 2C Leave, 2D Resume). */
export const ConfirmSheet = ({ open, onClose, icon, tone = 'brand', title, description, actions }: ConfirmSheetProps) => {
  const titleId = useId();
  return (
    <BottomSheet open={open} onClose={onClose} labelledBy={titleId} showClose>
      <div className={styles.content}>
        <MessageBlock variant="sheet" icon={icon} tone={tone} title={title} description={description} titleId={titleId} />
        <div className={styles.actions}>{actions}</div>
      </div>
    </BottomSheet>
  );
};
