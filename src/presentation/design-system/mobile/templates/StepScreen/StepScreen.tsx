import type { ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import { BottomActionBar } from '../../organisms/BottomActionBar';
import { DraggableFab } from '../../organisms/DraggableFab';
import { TopBar } from '../../organisms/TopBar';
import styles from './StepScreen.module.css';

export interface StepScreenProps {
  /** "Step 3 of 7". Empty for screens that are not steps (Checking). */
  stepLabel?: string;
  /** 0–100, never goes back (business rule) — computed by the caller. */
  progress: number;
  onClose: () => void;
  /** Error banner above the content (2I). */
  banner?: ReactNode;
  children: ReactNode;
  /** Buttons for the anchored CTA bar. Omit on automatic screens (Checking). */
  actions?: ReactNode;
  /** "Still working…" under the CTA (2H). */
  actionNote?: string | undefined;
  /** Sheets (pickers, leave confirmation…). */
  overlays?: ReactNode;
  showFab?: boolean;
  onChat?: (() => void) | undefined;
  className?: string | undefined;
}

/**
 * Template for every Apply Now step: TopBar (title + close + stepper, no back) · content ·
 * anchored CTA bar (back + Continue, rides the keyboard) · draggable chat FAB.
 */
export const StepScreen = ({
  stepLabel = '',
  progress,
  onClose,
  banner,
  children,
  actions,
  actionNote,
  overlays,
  showFab = true,
  onChat,
  className,
}: StepScreenProps) => (
  <div className={cx(styles.screen, actions ? styles.withActions : undefined, className)}>
    <div className={styles.topBar}>
      <TopBar variant="title" title={stepLabel} showClose onClose={onClose} showStepper progress={progress} />
    </div>
    <main className={styles.content}>
      {banner}
      {children}
    </main>
    {actions && <BottomActionBar note={actionNote}>{actions}</BottomActionBar>}
    {showFab && <DraggableFab onClick={onChat} />}
    {overlays}
  </div>
);
