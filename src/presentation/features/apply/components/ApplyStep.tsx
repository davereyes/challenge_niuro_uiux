import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { Button, ConfirmSheet, InlineNotice, StepScreen } from '@ds/mobile';
import type { StepId } from '@domain/entities/ApplicationDraft';
import { previousStep, progressFor, stepNumber, TOTAL_STEPS } from '@domain/services/applyFlow';

import { CTA, NETWORK_ERROR } from '../copy/stepCopy';
import { LANDING_PATH, stepPath } from '../routing/paths';
import { useApplyFlow } from '../state/useApplyFlow';

export interface ApplyStepProps {
  step: StepId;
  children: ReactNode;
  /** Continue button state. Omit `onContinue` for screens without CTA (Checking). */
  onContinue?: (() => void) | undefined;
  continueDisabled?: boolean;
  continueLabel?: string;
  submitting?: boolean;
  slow?: boolean;
  networkError?: boolean;
  /** Override the default back (previous step, or landing on step 1). */
  onBack?: (() => void) | undefined;
  /** Extra actions under Continue (2E). Replaces the default CTA when `actions` is given. */
  actions?: ReactNode;
  overlays?: ReactNode;
  /** Label override for the top bar ("" on automatic screens). */
  stepLabel?: string;
  /** id of the step <form>: Continue becomes its submit button (keyboard "Go" submits too). */
  formId?: string | undefined;
}

/**
 * Apply Now screen shell (feature-level composition of the StepScreen template):
 * step label + progress (never decreases), Continue with back (project rule), leave confirmation (2C),
 * network banner + "Try again" (2I), "Still working…" (2H), and focus on the heading for screen readers.
 */
export const ApplyStep = ({
  step,
  children,
  onContinue,
  continueDisabled = false,
  continueLabel = CTA.continue,
  submitting = false,
  slow = false,
  networkError = false,
  onBack,
  actions,
  overlays,
  stepLabel,
  formId,
}: ApplyStepProps) => {
  const navigate = useNavigate();
  const { draft } = useApplyFlow();
  const [leaving, setLeaving] = useState(false);

  const number = stepNumber(step);
  const label = stepLabel ?? (number ? `Step ${number} of ${TOTAL_STEPS}` : '');

  const goBack =
    onBack ??
    (() => {
      const previous = previousStep(draft, step);
      navigate(previous ? stepPath(previous) : LANDING_PATH);
    });

  // Move focus to the screen title on arrival (route changes are silent for screen readers otherwise).
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('main h1');
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }, []);

  const cta =
    actions ??
    ((onContinue ?? formId) && (
      <Button
        label={networkError ? CTA.tryAgain : continueLabel}
        showBackIcon
        onBack={goBack}
        backLabel={CTA.back}
        {...(formId ? { type: 'submit' as const, form: formId } : { onClick: onContinue })}
        disabled={continueDisabled}
        loading={submitting}
      />
    ));

  return (
    <StepScreen
      stepLabel={label}
      progress={progressFor(draft, step)}
      onClose={() => setLeaving(true)}
      banner={
        networkError ? (
          <InlineNotice variant="error" title={NETWORK_ERROR.title}>
            {NETWORK_ERROR.body}
          </InlineNotice>
        ) : undefined
      }
      actions={cta || undefined}
      actionNote={slow ? CTA.stillWorking : undefined}
      overlays={
        <>
          {overlays}
          <ConfirmSheet
            open={leaving}
            onClose={() => setLeaving(false)}
            icon="alert-circle"
            tone="danger"
            title="Leave your application?"
            actions={
              <>
                {/* Progress is already cached step by step: leaving is silent (2C). */}
                <Button variant="destructive" label="Yes, leave" onClick={() => navigate(LANDING_PATH)} />
                <Button variant="tertiary" label="Keep going" onClick={() => setLeaving(false)} />
              </>
            }
          />
        </>
      }
    >
      {children}
    </StepScreen>
  );
};
