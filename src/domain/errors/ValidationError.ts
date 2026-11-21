/**
 * Validation failure of a single value. `code` is stable and language-agnostic:
 * presentation maps it to user-facing copy.
 */
export interface ValidationError<Code extends string = string> {
  readonly code: Code;
}

export const invalid = <Code extends string>(code: Code): ValidationError<Code> => ({ code });

/** Field → error map returned by step validators. */
export type FieldErrors<Field extends string> = Partial<Record<Field, ValidationError>>;
