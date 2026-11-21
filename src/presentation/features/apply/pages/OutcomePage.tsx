import { useNavigate } from 'react-router';

import { Button, MessageBlock } from '@ds/mobile';
import type { StepId } from '@domain/entities/ApplicationDraft';

import { ApplyStep } from '../components/ApplyStep';
import { LANDING_PATH, stepPath } from '../routing/paths';

export type PendingOutcome = 'gig' | 'minorityOwner' | 'bank';

interface OutcomeCopy {
  step: StepId;
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}

/**
 * PLACEHOLDER — destinations that are out of the prototype ("Do not design" in the business rules):
 * gig branch (1D), 50%-or-less branch (1G) and bank connection (after 1I). Neutral copy, existing DS only.
 * Replace each one when product/design defines it.
 */
const COPY: Record<PendingOutcome, OutcomeCopy> = {
  gig: {
    step: 'income',
    title: "We're still building this path",
    description: "Applications for gig and contract work aren't available in this version yet.",
    actionLabel: 'Change my answer',
    actionTo: stepPath('income'),
  },
  minorityOwner: {
    step: 'ownership',
    title: "We're still building this path",
    description: "Applications for owners with 50% or less aren't available in this version yet.",
    actionLabel: 'Change my answer',
    actionTo: stepPath('ownership'),
  },
  bank: {
    step: 'identity',
    title: "You're all set for now",
    description: "Next, you'll securely connect your business bank account. That step isn't part of this version yet.",
    actionLabel: 'Back to home',
    actionTo: LANDING_PATH,
  },
};

export const OutcomePage = ({ outcome }: { outcome: PendingOutcome }) => {
  const navigate = useNavigate();
  const copy = COPY[outcome];
  return (
    <ApplyStep step={copy.step} actions={<Button label={copy.actionLabel} onClick={() => navigate(copy.actionTo)} />}>
      <MessageBlock
        icon={outcome === 'bank' ? 'check-circle' : 'info'}
        tone={outcome === 'bank' ? 'success' : 'brand'}
        title={copy.title}
        description={copy.description}
      />
    </ApplyStep>
  );
};
