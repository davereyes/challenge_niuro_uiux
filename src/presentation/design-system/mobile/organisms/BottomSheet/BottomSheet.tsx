import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import { IconButton } from '../../atoms/IconButton';
import styles from './BottomSheet.module.css';

const DISMISS_DISTANCE = 80;

export interface BottomSheetProps {
  open: boolean;
  /** Called on Escape, tap outside, swipe down or the close button. */
  onClose: () => void;
  /** id of the element that names the dialog (its title). */
  labelledBy: string;
  children: ReactNode;
  /** Round close (X) button in the top-right corner (canvas 2C/2D). */
  showClose?: boolean;
  closeLabel?: string;
  className?: string | undefined;
}

/**
 * Floating bottom sheet (8px inset, 28px radius, grabber) built on the native <dialog>:
 * real modal semantics, focus trapping and Escape for free.
 */
export const BottomSheet = ({
  open,
  onClose,
  labelledBy,
  children,
  showClose = false,
  closeLabel = 'Close',
  className,
}: BottomSheetProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const drag = useRef<{ startY: number; pointerId: number } | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { startY: event.clientY, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setOffset(Math.max(0, event.clientY - drag.current.startY));
  };

  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    const dismissed = offset > DISMISS_DISTANCE;
    setOffset(0);
    if (dismissed) onClose();
  };

  return (
    // Tap-outside to close; the keyboard equivalent is Escape (native `cancel` event below).
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      className={styles.dialog}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <div
          className={cx(styles.panel, offset > 0 && styles.dragging, className)}
          style={offset > 0 ? { transform: `translateY(${offset}px)` } : undefined}
        >
          <div
            className={styles.handleArea}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className={styles.grabber} aria-hidden="true" />
          </div>
          {showClose && <IconButton icon="close" label={closeLabel} className={styles.close} onClick={onClose} />}
          {children}
        </div>
      )}
    </dialog>
  );
};
