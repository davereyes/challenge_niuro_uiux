import { useId, useState } from 'react';

import { InlineNotice, OptionCardGroup, Text, type OptionCardOption } from '@ds/mobile';
import type { IncomeSource } from '@domain/entities/ApplicationDraft';
import { useUseCases } from '@presentation/di';

import { ApplyStep } from '../components/ApplyStep';
import { useStepSubmit } from '../hooks/useStepSubmit';
import { useApplyFlow } from '../state/useApplyFlow';
import styles from './pages.module.css';

const OPTIONS: readonly OptionCardOption<IncomeSource>[] = [
  { value: 'business', label: 'My own business', description: 'Clients, business revenue', icon: 'store' },
  { value: 'gig', label: 'Gig or contract work', description: 'Uber, DoorDash, 1099', icon: 'car' },
  { value: 'job', label: 'A job or other income', description: 'W-2, unemployment, disability, retirement', icon: 'briefcase' },
];

/** 1D · How do you make money? (single choice) */
export const IncomeSourcePage = () => {
  const { apply } = useUseCases();
  const { draft } = useApplyFlow();
  const questionId = useId();
  const [value, setValue] = useState<IncomeSource | null>(draft.incomeSource);
  const { submit, submitting, slow, networkError } = useStepSubmit<'incomeSource'>();

  return (
    <ApplyStep
      step="income"
      onContinue={() => submit(() => apply.submitIncomeSource.execute(draft, value))}
      continueDisabled={value === null}
      submitting={submitting}
      slow={slow}
      networkError={networkError}
    >
      <div className={styles.lead}>
        <Text variant="title" id={questionId}>
          How do you make money?
        </Text>
        <Text tone="secondary">For business owners and independent workers.</Text>
      </div>
      <div className={styles.question}>
        <OptionCardGroup labelledBy={questionId} options={OPTIONS} value={value} onChange={(next) => !submitting && setValue(next)} />
        <InlineNotice variant="hint" title="Sell to customers?">
          Pick business or gig.
        </InlineNotice>
      </div>
    </ApplyStep>
  );
};
