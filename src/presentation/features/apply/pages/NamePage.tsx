import { useState } from 'react';

import { Text, TextField } from '@ds/mobile';
import { validateName, type NameField } from '@domain/services/stepValidation';
import { useUseCases } from '@presentation/di';

import { ApplyStep } from '../components/ApplyStep';
import { FieldStack } from '../components/FieldStack';
import { StepForm } from '../components/StepForm';
import { errorMessage } from '../copy/errorMessages';
import { useBlurValidation } from '../hooks/useBlurValidation';
import { useStepSubmit } from '../hooks/useStepSubmit';
import { useApplyFlow } from '../state/useApplyFlow';

const FORM_ID = 'name-form';

/** 1C · What's your name? */
export const NamePage = () => {
  const { apply } = useUseCases();
  const { draft } = useApplyFlow();
  const [first, setFirst] = useState<string>(draft.name?.first ?? '');
  const [last, setLast] = useState<string>(draft.name?.last ?? '');

  const validation = validateName({ first, last });
  const blur = useBlurValidation<NameField>(validation.ok ? {} : validation.error);
  const { submit, submitting, slow, networkError } = useStepSubmit<NameField>();

  const field = (name: NameField, label: string, value: string, set: (v: string) => void, autoComplete: string) => (
    <TextField
      label={label}
      autoComplete={autoComplete}
      autoCapitalize="words"
      value={value}
      readOnly={submitting}
      onValueChange={(next) => {
        set(next);
        blur.onEdit(name);
      }}
      onBlur={() => blur.onBlur(name)}
      errorMessage={errorMessage(name, blur.visibleError(name, value.trim().length > 0))}
    />
  );

  return (
    <ApplyStep
      step="name"
      formId={FORM_ID}
      continueDisabled={!validation.ok}
      submitting={submitting}
      slow={slow}
      networkError={networkError}
    >
      <Text variant="title">What&apos;s your name?</Text>
      <StepForm
        id={FORM_ID}
        canSubmit={validation.ok}
        onSubmit={() => submit(() => apply.submitName.execute(draft, { first, last }))}
        onInvalidSubmit={blur.revealAll}
      >
        <FieldStack>
          {field('first', 'First name', first, setFirst, 'given-name')}
          {field('last', 'Last name', last, setLast, 'family-name')}
        </FieldStack>
      </StepForm>
    </ApplyStep>
  );
};
