import { useNavigate } from 'react-router';

import { Button, ConfirmSheet } from '@ds/mobile';
import { STEP_ORDER, stepNumber, TOTAL_STEPS } from '@domain/services/applyFlow';
import type { StepId } from '@domain/entities/ApplicationDraft';

import { stepPath } from '../routing/paths';
import { useApplyFlow } from '../state/useApplyFlow';

/** Step number to announce; Checking is not numbered, so use the next numbered step. */
const announcedNumber = (step: StepId): number => {
  for (const candidate of STEP_ORDER.slice(STEP_ORDER.indexOf(step))) {
    const number = stepNumber(candidate);
    if (number) return number;
  }
  return TOTAL_STEPS;
};

/** 2D · Resume — Coming back. "Continue application" jumps to the first incomplete step; "Start over" clears the cache. */
export const ResumeSheet = () => {
  const navigate = useNavigate();
  const { draft, resumePrompt, dismissResumePrompt, startOver } = useApplyFlow();
  const step = resumePrompt.step ?? 'contact';
  const firstName = draft.name?.first;

  return (
    <ConfirmSheet
      open={resumePrompt.visible}
      onClose={dismissResumePrompt}
      icon="user-filled"
      tone="brand"
      title={firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
      description={`Pick up where you left off: step ${announcedNumber(step)} of ${TOTAL_STEPS}.`}
      actions={
        <>
          <Button
            label="Continue application"
            onClick={() => {
              dismissResumePrompt();
              navigate(stepPath(step));
            }}
          />
          <Button variant="tertiary" label="Start over" onClick={() => void startOver()} />
        </>
      }
    />
  );
};
