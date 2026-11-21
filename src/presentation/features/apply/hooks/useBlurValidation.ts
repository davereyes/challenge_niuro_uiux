import { useCallback, useState } from 'react';

import type { FieldErrors, ValidationError } from '@domain/errors/ValidationError';

/**
 * Canvas 2B: validate on blur (and on Continue), never while typing.
 * An error becomes visible once the field was left with a value — empty untouched fields stay quiet.
 */
export const useBlurValidation = <Field extends string>(errors: FieldErrors<Field>) => {
  const [blurred, setBlurred] = useState<ReadonlySet<Field>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const onBlur = useCallback((field: Field) => {
    setBlurred((current) => (current.has(field) ? current : new Set(current).add(field)));
  }, []);

  /** Typing again hides the error until the next blur. */
  const onEdit = useCallback((field: Field) => {
    setBlurred((current) => {
      if (!current.has(field)) return current;
      const next = new Set(current);
      next.delete(field);
      return next;
    });
  }, []);

  const visibleError = (field: Field, hasValue: boolean): ValidationError | undefined =>
    (showAll || (blurred.has(field) && hasValue)) ? errors[field] : undefined;

  return { onBlur, onEdit, visibleError, revealAll: () => setShowAll(true) };
};
