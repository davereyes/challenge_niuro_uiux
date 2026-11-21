import { useEffect, type RefObject } from 'react';

/**
 * Publishes an element's height as a CSS custom property on <html>, so layouts can reserve
 * space for anchored UI (e.g. `--bottom-bar-height` for the CTA bar).
 */
export const useElementHeightVar = (ref: RefObject<HTMLElement | null>, variable: `--${string}`): void => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const root = document.documentElement;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) root.style.setProperty(variable, `${Math.round(entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height)}px`);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty(variable);
    };
  }, [ref, variable]);
};
