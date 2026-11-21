import { useEffect } from 'react';

import { releaseKeyboard } from './keyboardHandoff';

/** Fields that bring up the keyboard. Checkboxes, radios, selects and pickers do not. */
const TEXT_FIELD_SELECTOR = [
  'input[type="text"]',
  'input[type="email"]',
  'input[type="tel"]',
  'input[type="password"]',
  'input[type="search"]',
  'input:not([type])',
  'textarea',
]
  .map((selector) => `main ${selector}:not([disabled]):not([readonly])`)
  .join(', ');

/**
 * On mount: focus the first text field of the screen so the keyboard is ready (product rule).
 * Screens without text fields focus their heading instead (screen readers announce the new screen)
 * and close any keyboard held from the previous screen.
 */
export const useAutoFocusField = (): void => {
  useEffect(() => {
    const field = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(TEXT_FIELD_SELECTOR);
    if (field) {
      field.focus({ preventScroll: true });
      // Caret at the end when the field is prefilled (coming back to a step)
      const end = field.value.length;
      try {
        field.setSelectionRange(end, end);
      } catch {
        // some input types (email) don't support selection ranges
      }
      return;
    }
    releaseKeyboard();
    const heading = document.querySelector<HTMLElement>('main h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }, []);
};
