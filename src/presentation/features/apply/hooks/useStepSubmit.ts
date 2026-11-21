import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import type { Result } from '@shared/types/result';
import type { StepSubmission, StepSubmissionError } from '@application/dto/StepSubmission';
import type { FieldErrors } from '@domain/errors/ValidationError';

import { destinationPath } from '../routing/paths';
import { useApplyFlow } from '../state/useApplyFlow';

/** Canvas 2H: after 10 s of waiting show "Still working…". */
const SLOW_AFTER_MS = 10_000;

export interface StepSubmitState<Field extends string> {
  submitting: boolean;
  /** Request still running after 10 s (2H). */
  slow: boolean;
  /** Last request failed (2I): banner + "Try again". */
  networkError: boolean;
  /** Errors returned by the use case (e.g. state not served). */
  serverErrors: FieldErrors<Field>;
  submit: (run: () => Promise<Result<StepSubmission, StepSubmissionError<Field>>>) => Promise<void>;
}

/** Runs a step use case: loading, slow notice, network error, then stores the draft and navigates. */
export const useStepSubmit = <Field extends string>(): StepSubmitState<Field> => {
  const navigate = useNavigate();
  const { setDraft } = useApplyFlow();
  const [submitting, setSubmitting] = useState(false);
  const [slow, setSlow] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors<Field>>({});
  const slowTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(slowTimer.current), []);

  const submit = useCallback(
    async (run: () => Promise<Result<StepSubmission, StepSubmissionError<Field>>>) => {
      setSubmitting(true);
      setNetworkError(false);
      slowTimer.current = window.setTimeout(() => setSlow(true), SLOW_AFTER_MS);
      const result = await run();
      window.clearTimeout(slowTimer.current);
      setSlow(false);
      setSubmitting(false);

      if (result.ok) {
        setDraft(result.value.draft);
        navigate(destinationPath(result.value.destination));
        return;
      }
      if (result.error.kind === 'network') setNetworkError(true);
      else setServerErrors(result.error.errors);
    },
    [navigate, setDraft],
  );

  return { submitting, slow, networkError, serverErrors, submit };
};
