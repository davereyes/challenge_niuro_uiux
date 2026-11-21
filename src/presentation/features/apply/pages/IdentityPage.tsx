import { useMemo, useState } from 'react';

import { DatePickerSheet, InlineNotice, PickerField, Text, TextField } from '@ds/mobile';
import { formatCalendarDate } from '@ds/utils/calendar';
import { formatSsn } from '@ds/utils/masks';
import { validateIdentity, type IdentityField } from '@domain/services/stepValidation';
import { toCalendarDate, type CalendarDate } from '@domain/value-objects/CalendarDate';
import { DATE_OF_BIRTH_DEFAULT, DATE_OF_BIRTH_MIN_YEAR, latestDateOfBirth } from '@domain/value-objects/DateOfBirth';
import { useUseCases } from '@presentation/di';

import { ApplyStep } from '../components/ApplyStep';
import { FieldStack } from '../components/FieldStack';
import { StepForm } from '../components/StepForm';
import { errorMessage } from '../copy/errorMessages';
import { useBlurValidation } from '../hooks/useBlurValidation';
import { useStepSubmit } from '../hooks/useStepSubmit';
import { useApplyFlow } from '../state/useApplyFlow';

const FORM_ID = 'identity-form';

/** 1I · Verify your identity (+ 1J date wheels: 18+, impossible dates bounce). SSN masked with show/hide. */
export const IdentityPage = () => {
  const { apply, clock } = useUseCases();
  const { draft } = useApplyFlow();
  const today = useMemo(() => toCalendarDate(clock.now()), [clock]);
  const [dateOfBirth, setDateOfBirth] = useState<CalendarDate | null>(draft.identity?.dateOfBirth ?? null);
  const [ssn, setSsn] = useState(draft.identity ? formatSsn(draft.identity.ssn) : '');
  const [pickerOpen, setPickerOpen] = useState(false);

  const input = { dateOfBirth, ssn };
  const validation = validateIdentity(input, today);
  const blur = useBlurValidation<IdentityField>(validation.ok ? {} : validation.error);
  const { submit, submitting, slow, networkError } = useStepSubmit<IdentityField>();

  return (
    <ApplyStep
      step="identity"
      formId={FORM_ID}
      continueDisabled={!validation.ok}
      submitting={submitting}
      slow={slow}
      networkError={networkError}
      overlays={
        <DatePickerSheet
          open={pickerOpen}
          title="Date of birth"
          value={dateOfBirth}
          defaultValue={DATE_OF_BIRTH_DEFAULT}
          max={latestDateOfBirth(today)}
          minYear={DATE_OF_BIRTH_MIN_YEAR}
          onCancel={() => setPickerOpen(false)}
          onDone={(value) => {
            setDateOfBirth(value);
            setPickerOpen(false);
          }}
        />
      }
    >
      <Text variant="title">Verify your identity</Text>
      <StepForm
        id={FORM_ID}
        canSubmit={validation.ok}
        onSubmit={() => submit(() => apply.submitIdentity.execute(draft, input))}
        onInvalidSubmit={blur.revealAll}
      >
        <FieldStack>
          <PickerField
            label="Date of birth"
            value={dateOfBirth ? formatCalendarDate(dateOfBirth) : ''}
            active={pickerOpen}
            disabled={submitting}
            onClick={() => setPickerOpen(true)}
          />
          <TextField
            label="Social Security number"
            mask="ssn"
            revealable
            autoComplete="off"
            value={ssn}
            readOnly={submitting}
            onValueChange={(value) => {
              setSsn(value);
              blur.onEdit('ssn');
            }}
            onBlur={() => blur.onBlur('ssn')}
            errorMessage={errorMessage('ssn', blur.visibleError('ssn', ssn.length > 0))}
          />
          <InlineNotice variant="secure">
            As a regulated financial service provider, we&apos;re required to collect your SSN to verify your identity.
            Your information is secured.
          </InlineNotice>
        </FieldStack>
      </StepForm>
    </ApplyStep>
  );
};
