import { use, useCallback, useMemo, useState, type ReactNode } from 'react';

import type { ApplicationDraft } from '@domain/entities/ApplicationDraft';
import type { LoadedDraft } from '@application/use-cases/apply';

import { useUseCases } from '@presentation/di';
import { ApplyFlowContext, type ApplyFlowState } from './ApplyFlowContext';

export interface ApplyFlowProviderProps {
  /** Promise from GetApplicationDraftUseCase, resolved with React 19 `use()` (Suspense). */
  loaded: Promise<LoadedDraft>;
  /** Show the resume sheet when the user enters the flow with cached progress. */
  offerResume: boolean;
  children: ReactNode;
}

/** Holds the in-memory application draft (identity data lives only here) for every Apply Now screen. */
export const ApplyFlowProvider = ({ loaded, offerResume, children }: ApplyFlowProviderProps) => {
  const initial = use(loaded);
  const { apply } = useUseCases();
  const [draft, setDraft] = useState<ApplicationDraft>(initial.draft);
  const [resumeVisible, setResumeVisible] = useState(offerResume && initial.canResume);
  const [session, setSession] = useState(0);

  const startOver = useCallback(async () => {
    setDraft(await apply.startOver.execute());
    setResumeVisible(false);
    setSession((value) => value + 1);
  }, [apply.startOver]);

  const value = useMemo<ApplyFlowState>(
    () => ({
      draft,
      setDraft,
      resumePrompt: { visible: resumeVisible, step: initial.resumeStep },
      dismissResumePrompt: () => setResumeVisible(false),
      startOver,
      session,
    }),
    [draft, resumeVisible, initial.resumeStep, startOver, session],
  );

  return <ApplyFlowContext value={value}>{children}</ApplyFlowContext>;
};
