import { useId, useMemo, useState } from 'react';

import { MonthYearPickerSheet, PickerField, Text, TextField } from '@ds/mobile';
import { formatYearMonth } from '@ds/utils/calendar';
import { validateBusiness, type BusinessField } from '@domain/services/stepValidation';
import { BUSINESS_START_MIN_YEAR, latestBusinessStart } from '@domain/value-objects/BusinessStartDate';
import { toCalendarDate, type YearMonth } from '@domain/value-objects/CalendarDate';
import { useUseCases } from '@presentation/di';

import { ApplyStep } from '../components/ApplyStep';
import { StepForm } from '../components/StepForm';
import { errorMessage } from '../copy/errorMessages';
import { useBlurValidation } from '../hooks/useBlurValidation';
import { useStepSubmit } from '../hooks/useStepSubmit';
import { useApplyFlow } from '../state/useApplyFlow';
import styles from './pages.module.css';

const FORM_ID = 'business-form';

/** 1E · Your business (+ 1F month/year picker: future months bounce). */
export const BusinessPage = () => {
  const { apply, clock } = useUseCases();
  const { draft } = useApplyFlow();
  const questionId = useId();
  const today = useMemo(() => toCalendarDate(clock.now()), [clock]);
  const [name, setName] = useState<string>(draft.business?.name ?? '');
  const [startedOn, setStartedOn] = useState<YearMonth | null>(draft.business?.startedOn ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const input = { name, startedOn };
  const validation = validateBusiness(input, today);
  const blur = useBlurValidation<BusinessField>(validation.ok ? {} : validation.error);
  const { submit, submitting, slow, networkError } = useStepSubmit<BusinessField>();

  return (
    <ApplyStep
      step="business"
      formId={FORM_ID}
      continueDisabled={!validation.ok}
      submitting={submitting}
      slow={slow}
      networkError={networkError}
      overlays={
        <MonthYearPickerSheet
          open={pickerOpen}
          title="Start date"
          value={startedOn}
          max={latestBusinessStart(today)}
          minYear={BUSINESS_START_MIN_YEAR}
          onCancel={() => setPickerOpen(false)}
          onDone={(value) => {
            setStartedOn(value);
            setPickerOpen(false);
          }}
        />
      }
    >
      <Text variant="title">Your business</Text>
      <StepForm
        id={FORM_ID}
        canSubmit={validation.ok}
        onSubmit={() => submit(() => apply.submitBusiness.execute(draft, input))}
        onInvalidSubmit={blur.revealAll}
      >
        <TextField
          label="Business name"
          autoComplete="organization"
          autoCapitalize="words"
          value={name}
          readOnly={submitting}
          helperText="As it appears on your bank account"
          onValueChange={(value) => {
            setName(value);
            blur.onEdit('name');
          }}
          onBlur={() => blur.onBlur('name')}
          errorMessage={errorMessage('businessName', blur.visibleError('name', name.trim().length > 0))}
        />
        <div className={styles.question}>
          <Text variant="body" weight="semibold" id={questionId}>
            When did it start?
          </Text>
          <div role="group" aria-labelledby={questionId}>
            <PickerField
              label="Month and year"
              value={startedOn ? formatYearMonth(startedOn) : ''}
              active={pickerOpen}
              disabled={submitting}
              onClick={() => setPickerOpen(true)}
            />
          </div>
        </div>
      </StepForm>
    </ApplyStep>
  );
};
