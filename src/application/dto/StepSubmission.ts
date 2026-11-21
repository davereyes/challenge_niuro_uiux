import type { ApplicationDraft } from '@domain/entities/ApplicationDraft';
import type { FieldErrors } from '@domain/errors/ValidationError';
import type { FlowDestination } from '@domain/services/applyFlow';

export interface StepSubmission {
  readonly draft: ApplicationDraft;
  readonly destination: FlowDestination;
}

export type StepSubmissionError<Field extends string = string> =
  | { readonly kind: 'validation'; readonly errors: FieldErrors<Field> }
  | { readonly kind: 'network' };
