import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { cx } from '@shared/utils/cx';

import styles from './WheelPicker.module.css';

export const WHEEL_ROW_HEIGHT = 36;
const SETTLE_DELAY_MS = 110;

export interface WheelItem {
  value: string;
  label: string;
  /** Not selectable: rendered gray; the wheel bounces off it (canvas 1F / 1J). */
  disabled?: boolean;
}

export interface WheelColumnProps {
  /** Accessible name ("Month", "Year"). */
  label: string;
  items: readonly WheelItem[];
  value: string;
  onChange: (value: string) => void;
  align?: 'start' | 'center' | 'end';
  /** Relative width (flex-grow) inside the picker. */
  flex?: number;
}

const nearestEnabled = (items: readonly WheelItem[], from: number): number => {
  for (let distance = 0; distance < items.length; distance += 1) {
    const before = from - distance;
    const after = from + distance;
    if (before >= 0 && !items[before]?.disabled) return before;
    if (after < items.length && !items[after]?.disabled) return after;
  }
  return from;
};

const clampIndex = (index: number, length: number) => Math.max(0, Math.min(length - 1, index));

/** One scroll-snapping wheel. Native momentum scrolling on touch; arrow keys on keyboard. */
export const WheelColumn = ({ label, items, value, onChange, align = 'start', flex = 1 }: WheelColumnProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const mounted = useRef(false);
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );
  const [scrollTop, setScrollTop] = useState(selectedIndex * WHEEL_ROW_HEIGHT);

  const scrollToIndex = useCallback((index: number, smooth: boolean) => {
    scrollerRef.current?.scrollTo({ top: index * WHEEL_ROW_HEIGHT, behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  const settle = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const index = clampIndex(Math.round(scroller.scrollTop / WHEEL_ROW_HEIGHT), items.length);
    const target = items[index]?.disabled ? nearestEnabled(items, index) : index;
    if (target !== index) {
      scrollToIndex(target, true); // bounce off an unavailable value
      return;
    }
    const next = items[target];
    if (next && next.value !== value) onChange(next.value);
  }, [items, onChange, scrollToIndex, value]);

  // Sync position with the controlled value (instant on mount, smooth afterwards)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (Math.round(scroller.scrollTop / WHEEL_ROW_HEIGHT) !== selectedIndex) {
      scrollToIndex(selectedIndex, mounted.current);
    }
    mounted.current = true;
  }, [selectedIndex, scrollToIndex]);

  // If the current value becomes unavailable (e.g. another column changed), bounce to the nearest valid one
  useEffect(() => {
    if (items[selectedIndex]?.disabled) {
      const target = nearestEnabled(items, selectedIndex);
      const next = items[target];
      if (next) onChange(next.value);
    }
  }, [items, selectedIndex, onChange]);

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  // The column may mount hidden (e.g. inside a <dialog> that opens after child effects run).
  // Re-apply the position as soon as it gets a size.
  const selectedIndexRef = useRef(selectedIndex);
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;
    const observer = new ResizeObserver(() => {
      if (scroller.clientHeight > 0 && Math.round(scroller.scrollTop / WHEEL_ROW_HEIGHT) !== selectedIndexRef.current) {
        scroller.scrollTop = selectedIndexRef.current * WHEEL_ROW_HEIGHT;
      }
    });
    observer.observe(scroller);
    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setScrollTop(scroller.scrollTop);
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(settle, SETTLE_DELAY_MS);
  };

  const step = (from: number, direction: 1 | -1): number => {
    let index = from + direction;
    while (index >= 0 && index < items.length && items[index]?.disabled) index += direction;
    return index >= 0 && index < items.length ? index : from;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => number> = {
      ArrowDown: () => step(selectedIndex, 1),
      ArrowUp: () => step(selectedIndex, -1),
      PageDown: () => nearestEnabled(items, clampIndex(selectedIndex + 5, items.length)),
      PageUp: () => nearestEnabled(items, clampIndex(selectedIndex - 5, items.length)),
      Home: () => nearestEnabled(items, 0),
      End: () => nearestEnabled(items, items.length - 1),
    };
    const resolve = keys[event.key];
    if (!resolve) return;
    event.preventDefault();
    const target = resolve();
    const next = items[target];
    if (next && target !== selectedIndex) {
      onChange(next.value);
    }
  };

  const position = scrollTop / WHEEL_ROW_HEIGHT;

  return (
    <div
      ref={scrollerRef}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={items.length - 1}
      aria-valuenow={selectedIndex}
      aria-valuetext={items[selectedIndex]?.label}
      className={cx(styles.column, styles[align])}
      style={{ flexGrow: flex }}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => {
        const distance = index - position;
        const abs = Math.abs(distance);
        if (abs > 5) return <div key={item.value} className={styles.item} aria-hidden="true" />;
        return (
          <div
            key={item.value}
            aria-hidden="true"
            className={cx(styles.item, abs < 0.5 && styles.centered, item.disabled && styles.disabled)}
            style={{
              opacity: Math.max(0, 1 - abs * 0.22),
              transform: `rotateX(${(-distance * 12).toFixed(2)}deg)`,
            }}
            onClick={() => !item.disabled && scrollToIndex(index, true)}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};
