import { useRef, useState, type PointerEvent } from 'react';

import { cx } from '@shared/utils/cx';

import { useKeyboardInset } from '../../../hooks/useKeyboardInset';
import { FabChat } from '../../atoms/FabChat';
import styles from './DraggableFab.module.css';

const SIZE = 56;
const MARGIN = 16;
const DRAG_THRESHOLD = 6;
/** Top limit: below the top bar (safe area + 56px bar + margin). */
const TOP_LIMIT = 56 + MARGIN;

interface Position {
  x: number;
  y: number;
}

export interface DraggableFabProps {
  onClick?: (() => void) | undefined;
  label?: string;
  className?: string | undefined;
}

const bottomBarHeight = () =>
  Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bottom-bar-height')) || 0;

const bounds = () => ({
  maxX: window.innerWidth - SIZE,
  minY: TOP_LIMIT,
  maxY: window.innerHeight - bottomBarHeight() - SIZE - MARGIN,
});

/**
 * Chat FAB that can be dragged and snaps to the nearest side (canvas behavior, iOS AssistiveTouch-like).
 * Never rests on the anchored CTA bar and hides while the keyboard is open (2A).
 */
export const DraggableFab = ({ onClick, label = 'Chat with us', className }: DraggableFabProps) => {
  const keyboard = useKeyboardInset();
  const [position, setPosition] = useState<Position | null>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startX: number; startY: number; origin: Position; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    drag.current = { startX: event.clientX, startY: event.clientY, origin: { x: rect.left, y: rect.top }, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.moved && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;
    current.moved = true;
    setDragging(true);
    const { maxX, minY, maxY } = bounds();
    setPosition({
      x: Math.max(0, Math.min(maxX, current.origin.x + dx)),
      y: Math.max(minY, Math.min(maxY, current.origin.y + dy)),
    });
  };

  const onPointerUp = () => {
    const current = drag.current;
    drag.current = null;
    if (!current?.moved || !position) return;
    suppressClick.current = true;
    setDragging(false);
    const { maxX, minY, maxY } = bounds();
    setPosition({
      x: position.x + SIZE / 2 < window.innerWidth / 2 ? MARGIN : maxX - MARGIN,
      y: Math.max(minY, Math.min(maxY, position.y)),
    });
  };

  if (keyboard.open) return null;

  return (
    <div
      className={cx(styles.fab, dragging && styles.dragging, className)}
      style={position ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <FabChat
        label={label}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          onClick?.();
        }}
      />
    </div>
  );
};
