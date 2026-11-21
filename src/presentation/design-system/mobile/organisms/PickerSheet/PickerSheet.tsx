import { useId } from 'react';

import { WheelPicker, type WheelPickerProps } from '../../molecules/WheelPicker';
import { BottomSheet } from '../BottomSheet';
import styles from './PickerSheet.module.css';

export interface PickerSheetProps {
  open: boolean;
  title: string;
  columns: WheelPickerProps['columns'];
  onCancel: () => void;
  onDone: () => void;
  cancelLabel?: string;
  doneLabel?: string;
}

/** Bottom sheet with iOS header (Cancel · Title · Done) and wheels (canvas 1F / 1J). */
export const PickerSheet = ({
  open,
  title,
  columns,
  onCancel,
  onDone,
  cancelLabel = 'Cancel',
  doneLabel = 'Done',
}: PickerSheetProps) => {
  const titleId = useId();

  return (
    <BottomSheet open={open} onClose={onCancel} labelledBy={titleId}>
      <div className={styles.header}>
        <button type="button" className={styles.action} onClick={onCancel}>
          {cancelLabel}
        </button>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <button type="button" className={`${styles.action} ${styles.done}`} onClick={onDone}>
          {doneLabel}
        </button>
      </div>
      <WheelPicker columns={columns} />
    </BottomSheet>
  );
};
