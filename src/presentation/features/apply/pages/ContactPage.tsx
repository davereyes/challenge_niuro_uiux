import { useState } from 'react';

import { CheckboxLabel, Text, TextField, TextLink } from '@ds/mobile';
import { formatPhone } from '@ds/utils/masks';
import { validateContact, type ContactField } from '@domain/services/stepValidation';
import { useUseCases } from '@presentation/di';

import { ApplyStep } from '../components/ApplyStep';
import { FieldStack } from '../components/FieldStack';
import { StepForm } from '../components/StepForm';
import { errorMessage } from '../copy/errorMessages';
import { useBlurValidation } from '../hooks/useBlurValidation';
import { useStepSubmit } from '../hooks/useStepSubmit';
import { useApplyFlow } from '../state/useApplyFlow';
import styles from './pages.module.css';

const FORM_ID = 'contact-form';

/** 1B · Contact info (+ 2A keyboard, 2B invalid email). */
export const ContactPage = () => {
  const { apply } = useUseCases();
  const { draft } = useApplyFlow();
  const [phone, setPhone] = useState(draft.contact ? formatPhone(draft.contact.phone) : '');
  const [email, setEmail] = useState<string>(draft.contact?.email ?? '');
  const [accountConsent, setAccountConsent] = useState(draft.contact?.accountConsent ?? false);
  const [promoConsent, setPromoConsent] = useState(draft.contact?.promoConsent ?? false);

  const input = { phone, email, accountConsent, promoConsent };
  const validation = validateContact(input);
  const blur = useBlurValidation<ContactField>(validation.ok ? {} : validation.error);
  const { submit, submitting, slow, networkError } = useStepSubmit<ContactField>();

  const handleSubmit = () => submit(() => apply.submitContact.execute(draft, input));

  return (
    <ApplyStep
      step="contact"
      formId={FORM_ID}
      continueDisabled={!validation.ok}
      submitting={submitting}
      slow={slow}
      networkError={networkError}
    >
      <Text variant="title">Contact info</Text>
      <StepForm id={FORM_ID} canSubmit={validation.ok} onSubmit={handleSubmit} onInvalidSubmit={blur.revealAll}>
        <FieldStack>
          <TextField
            label="Number"
            type="tel"
            mask="phone"
            icon="phone"
            autoComplete="tel-national"
            value={phone}
            readOnly={submitting}
            onValueChange={(value) => {
              setPhone(value);
              blur.onEdit('phone');
            }}
            onBlur={() => blur.onBlur('phone')}
            errorMessage={errorMessage('phone', blur.visibleError('phone', phone.length > 0))}
          />
          <TextField
            label="Email"
            type="email"
            icon="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            readOnly={submitting}
            onValueChange={(value) => {
              setEmail(value);
              blur.onEdit('email');
            }}
            onBlur={() => blur.onBlur('email')}
            errorMessage={errorMessage('email', blur.visibleError('email', email.length > 0))}
          />
        </FieldStack>
        <div className={styles.consents}>
          <CheckboxLabel
            label="I agree to account-related calls and texts from Fundo."
            checked={accountConsent}
            disabled={submitting}
            onCheckedChange={setAccountConsent}
          />
          <CheckboxLabel
            label="Send me promo offers by text."
            checked={promoConsent}
            disabled={submitting}
            onCheckedChange={setPromoConsent}
          />
          <Text variant="micro" tone="muted" className={styles.smsLegal}>
            Msg &amp; data rates may apply. Reply STOP to opt out. <TextLink href="#messaging-terms">Messaging Terms</TextLink>
          </Text>
        </div>
      </StepForm>
    </ApplyStep>
  );
};
