import { useEffect, useState } from 'react';

export interface KeyboardInset {
  /** Pixels the on-screen keyboard covers at the bottom of the layout viewport. */
  inset: number;
  /** True when a software keyboard is (very likely) open. */
  open: boolean;
}

/** Ignore small viewport changes (browser toolbars collapsing) that are not a keyboard. */
const KEYBOARD_THRESHOLD = 120;

/**
 * Tracks the software keyboard through the VisualViewport API so anchored UI (the CTA bar)
 * can ride on top of it. iOS Safari keeps the layout viewport and overlays the keyboard;
 * Android Chrome with `interactive-widget=resizes-content` resizes it (inset stays 0).
 */
export const useKeyboardInset = (): KeyboardInset => {
  const [state, setState] = useState<KeyboardInset>({ inset: 0, open: false });

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;

    const update = () => {
      const covered = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      const inset = covered > KEYBOARD_THRESHOLD ? Math.round(covered) : 0;
      const resized = window.screen.height - window.innerHeight > window.screen.height * 0.35;
      setState((previous) => {
        const open = inset > 0 || resized;
        return previous.inset === inset && previous.open === open ? previous : { inset, open };
      });
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return state;
};
