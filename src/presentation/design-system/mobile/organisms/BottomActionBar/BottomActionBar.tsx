import { useRef, type ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import { useElementHeightVar } from '../../../hooks/useElementHeightVar';
import { useKeyboardInset } from '../../../hooks/useKeyboardInset';
import { Text } from '../../atoms/Text';
import styles from './BottomActionBar.module.css';

export interface BottomActionBarProps {
  /** Usually one Button with `showBackIcon` (the step CTA); a second stacked Button is allowed (2E). */
  children: ReactNode;
  /** Small status under the buttons, e.g. "Still working…" (2H). Announced politely. */
  note?: string | undefined;
  /**
   * fixed: anchored to the viewport bottom and lifted above the software keyboard (app).
   * static: in-flow (docs/Storybook previews).
   */
  position?: 'fixed' | 'static';
  className?: string | undefined;
}

/**
 * Anchored CTA bar — project rule: always at the bottom, above the home indicator,
 * and on top of the keyboard when it is open (canvas "rule-anchored" + 2A).
 * Publishes its height as `--bottom-bar-height` so content and the FAB keep clear of it.
 */
export const BottomActionBar = ({ children, note, position = 'fixed', className }: BottomActionBarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const keyboard = useKeyboardInset();
  useElementHeightVar(ref, '--bottom-bar-height');

  return (
    <div
      ref={ref}
      className={cx(styles.bar, styles[position], keyboard.open && styles.keyboardOpen, className)}
      style={position === 'fixed' && keyboard.inset > 0 ? { transform: `translateY(-${keyboard.inset}px)` } : undefined}
    >
      {children}
      <div aria-live="polite" className={styles.noteSlot}>
        {note && (
          <Text variant="caption" tone="muted" align="center" as="p">
            {note}
          </Text>
        )}
      </div>
    </div>
  );
};
