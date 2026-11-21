import { createContext } from 'react';

import type { ApplicationDraft, StepId } from '@domain/entities/ApplicationDraft';

export interface ApplyFlowState {
  draft: ApplicationDraft;
  setDraft: (draft: ApplicationDraft) => void;
  /** Cached progress found on entry → show "Welcome back" (2D) once. */
  resumePrompt: { visible: boolean; step: StepId | null };
  dismissResumePrompt: () => void;
  startOver: () => Promise<void>;
  /** Increments on "Start over" so open screens remount with empty fields. */
  session: number;
}

export const ApplyFlowContext = createContext<ApplyFlowState | null>(null);
