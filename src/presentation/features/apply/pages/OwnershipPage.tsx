import { useId, useState } from 'react';

import { OptionCardGroup, Text, type OptionCardOption } from '@ds/mobile';
import type { Ownership } from '@domain/entities/ApplicationDraft';
import { useUseCases } from '@presentation/di';

import { ApplyStep } from '../components/ApplyStep';
import { useStepSubmit } from '../hooks/useStepSubmit';
import { useApplyFlow } from '../state/useApplyFlow';

const OPTIONS: readonly OptionCardOption<Ownership>[] = [
  { value: 'majority', label: '51% or more', description: 'You own most of the business', icon: 'user' },
  { value: 'minority', label: '50% or less', description: 'You own part of the business', icon: 'users' },
];

/** 1G · How much of the business do you own? */
export const OwnershipPage = () => {
  const { apply } = useUseCases();
  const { draft } = useApplyFlow();
  const questionId = useId();
  const [value, setValue] = useState<Ownership | null>(draft.ownership);
  const { submit, submitting, slow, networkError } = useStepSubmit<'ownership'>();

  return (
    <ApplyStep
      step="ownership"
      onContinue={() => submit(() => apply.submitOwnership.execute(draft, value))}
      continueDisabled={value === null}
      submitting={submitting}
      slow={slow}
      networkError={networkError}
    >
      <Text variant="title" id={questionId}>
        How much of the business do you own?
      </Text>
      <OptionCardGroup labelledBy={questionId} options={OPTIONS} value={value} onChange={(next) => !submitting && setValue(next)} />
    </ApplyStep>
  );
};
