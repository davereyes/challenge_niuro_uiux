/**
 * Keeps the software keyboard open across screen changes.
 *
 * iOS Safari only opens the keyboard when `focus()` runs inside a user gesture. Our screens mount
 * after async work (submit → navigate), so a plain autofocus would place the caret without a keyboard.
 * Workaround: during the tap, focus an invisible input (`holdKeyboard`); when the next screen mounts,
 * move focus to its first field — iOS keeps the keyboard because focus goes input → input.
 * If the next screen has no text field, `releaseKeyboard` closes it.
 */
let keeper: HTMLInputElement | null = null;

const ensureKeeper = (): HTMLInputElement => {
  if (keeper?.isConnected) return keeper;
  const input = document.createElement('input');
  input.type = 'text';
  input.tabIndex = -1;
  input.setAttribute('aria-hidden', 'true');
  input.setAttribute('autocomplete', 'off');
  // 16px avoids iOS zoom; off-screen but still focusable (display:none would not be)
  input.style.cssText =
    'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;border:0;padding:0;pointer-events:none;';
  document.body.append(input);
  keeper = input;
  return input;
};

/** Call synchronously inside the tap/submit handler that leads to a new screen. */
export const holdKeyboard = (): void => {
  if (typeof document === 'undefined') return;
  const active = document.activeElement;
  // Only worth it when a keyboard is (or may be) in use: a field is focused, or we are on a touch device.
  const typing = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
  const touch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  if (!typing && !touch) return;
  ensureKeeper().focus({ preventScroll: true });
};

export const isHoldingKeyboard = (): boolean => keeper !== null && document.activeElement === keeper;

/** Close the held keyboard (next screen has nothing to type). */
export const releaseKeyboard = (): void => {
  if (isHoldingKeyboard()) keeper?.blur();
};
