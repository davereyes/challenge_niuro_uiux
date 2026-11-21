import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { MessageBlock, ScanIllustration, StatusChecklist, Text, type StatusChecklistItem } from '@ds/mobile';
import type { ApplicantCheckOutcome } from '@application/use-cases/apply';
import type { FlowDestination } from '@domain/services/applyFlow';
import { useUseCases } from '@presentation/di';
import { holdKeyboard } from '@presentation/hooks/keyboardHandoff';

import { ApplyStep } from '../components/ApplyStep';
import { destinationPath } from '../routing/paths';
import { useApplyFlow } from '../state/useApplyFlow';

const ROWS = ['Checking if you already have an account', 'Seeing if you can skip some steps', 'Preparing your next step'];

/** Minimum time on the first row and between rows, so the check reads as progress (canvas animation). */
const FIRST_ROW_MIN_MS = 1400;
const ROW_INTERVAL_MS = 1100;
const FINISH_DELAY_MS = 500;

const statusesFor = (phase: number): StatusChecklistItem[] =>
  ROWS.map((label, index) => ({
    id: String(index),
    label,
    status: index < phase ? 'done' : index === phase ? 'active' : 'pending',
  }));

/**
 * 1G→ · Checking your information (automatic, no button).
 * New customer → continues to 1H by itself. Returning customer → 2F "Welcome back" + Continue.
 */
export const CheckingPage = () => {
  const navigate = useNavigate();
  const { apply } = useUseCases();
  const { draft, setDraft } = useApplyFlow();
  const [initialDraft] = useState(draft);
  const [phase, setPhase] = useState(0);
  const [returning, setReturning] = useState<{ firstName: string | null; destination: FlowDestination } | null>(null);
  // One request per visit, shared across StrictMode effect re-runs.
  const request = useRef<Promise<ApplicantCheckOutcome> | null>(null);

  useEffect(() => {
    request.current ??= apply.runApplicantCheck.execute(initialDraft).then((result) => {
      if (!result.ok) throw new Error('unreachable');
      return result.value;
    });
    const started = performance.now();
    const timers: number[] = [];
    let cancelled = false;

    void request.current.then((outcome) => {
      if (cancelled) return;
      const firstDone = Math.max(0, FIRST_ROW_MIN_MS - (performance.now() - started));
      timers.push(
        window.setTimeout(() => setPhase(1), firstDone),
        window.setTimeout(() => setPhase(2), firstDone + ROW_INTERVAL_MS),
        window.setTimeout(() => setPhase(3), firstDone + ROW_INTERVAL_MS * 2),
      );
      timers.push(window.setTimeout(() => {
        setDraft(outcome.draft);
        if (outcome.returningCustomer) {
          setReturning({ firstName: outcome.draft.check?.firstName ?? null, destination: outcome.destination });
        } else {
          navigate(destinationPath(outcome.destination), { replace: true });
        }
      }, firstDone + ROW_INTERVAL_MS * 2 + FINISH_DELAY_MS));
    });

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [apply.runApplicantCheck, initialDraft, navigate, setDraft]);

  if (returning) {
    // 2F · Account found
    return (
      <ApplyStep step="checking" stepLabel="" onContinue={() => {
          holdKeyboard();
          navigate(destinationPath(returning.destination));
        }}>
        <MessageBlock
          icon="check-circle"
          tone="success"
          title={returning.firstName ? `Welcome back, ${returning.firstName}` : 'Welcome back'}
          description="We found your Fundo account, so you can skip the steps we already have."
        />
      </ApplyStep>
    );
  }

  return (
    <ApplyStep step="checking" stepLabel="">
      <ScanIllustration />
      <Text variant="title">You&apos;re almost there. Just checking your information.</Text>
      <StatusChecklist items={statusesFor(phase)} />
    </ApplyStep>
  );
};
