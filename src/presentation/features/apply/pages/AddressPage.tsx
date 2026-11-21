import { useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react';

import {
  InlineNotice,
  SelectInput,
  SuggestionList,
  Text,
  TextField,
  TextLink,
  suggestionOptionId,
  type Suggestion,
} from '@ds/mobile';
import type { AddressSuggestion } from '@application/ports/AddressAutocompleteService';
import { createHomeAddress, type HomeAddressField } from '@domain/value-objects/HomeAddress';
import { isUsStateCode, US_STATES, usStateName } from '@domain/value-objects/UsState';
import { useUseCases } from '@presentation/di';

import { ApplyStep } from '../components/ApplyStep';
import { FieldStack } from '../components/FieldStack';
import { StepForm } from '../components/StepForm';
import { errorMessage } from '../copy/errorMessages';
import { useBlurValidation } from '../hooks/useBlurValidation';
import { useStepSubmit } from '../hooks/useStepSubmit';
import { useApplyFlow } from '../state/useApplyFlow';
import styles from './pages.module.css';

const FORM_ID = 'address-form';
const SEARCH_DEBOUNCE_MS = 250;
const STATE_OPTIONS = US_STATES.map(([value, label]) => ({ value, label }));

type NotifyState = 'idle' | 'sending' | 'sent' | 'failed';

/** 1H · Where do you live? (autocomplete fills city/state/ZIP) + 2G state not served. */
export const AddressPage = () => {
  const { apply } = useUseCases();
  const { draft } = useApplyFlow();
  const listId = useId();

  const [line1, setLine1] = useState<string>(draft.address?.line1 ?? '');
  const [city, setCity] = useState<string>(draft.address?.city ?? '');
  const [state, setState] = useState<string>(draft.address?.state ?? '');
  const [zip, setZip] = useState<string>(draft.address?.zip ?? '');
  const [picked, setPicked] = useState(draft.address !== null);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<readonly AddressSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [notify, setNotify] = useState<NotifyState>('idle');

  const input = { line1, city, state, zip };
  const validation = createHomeAddress(input);
  const errors = validation.ok ? {} : validation.error;
  const blur = useBlurValidation<HomeAddressField>(errors);
  const { submit, submitting, slow, networkError } = useStepSubmit<HomeAddressField>();
  const notServed = errors.state?.code === 'notServed' && isUsStateCode(state);

  // Debounced autocomplete while typing (not after picking a suggestion)
  const query = line1.trim();
  const shouldSearch = focused && !picked && query.length >= 3;
  useEffect(() => {
    if (!shouldSearch) return undefined;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const result = await apply.searchAddresses.execute(query);
      if (!cancelled) {
        setSuggestions(result.ok ? result.value : []);
        setActiveIndex(-1);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [apply.searchAddresses, query, shouldSearch]);

  const listOpen = shouldSearch && suggestions.length > 0;
  const listItems = useMemo<Suggestion[]>(
    () => suggestions.map((s) => ({ id: s.id, primary: s.line1, secondary: `${s.city}, ${s.state} ${s.zip}` })),
    [suggestions],
  );

  const pick = (suggestion: AddressSuggestion) => {
    setLine1(suggestion.line1);
    setCity(suggestion.city);
    setState(suggestion.state);
    setZip(suggestion.zip);
    setPicked(true);
    setSuggestions([]);
    setNotify('idle');
  };

  const onComboboxKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!listOpen) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      const suggestion = suggestions[activeIndex];
      if (suggestion) pick(suggestion);
    } else if (event.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const notifyMe = async () => {
    if (!isUsStateCode(state)) return;
    setNotify('sending');
    const result = await apply.notifyWhenAvailable.execute({ email: draft.contact?.email ?? null, state });
    setNotify(result.ok ? 'sent' : 'failed');
  };

  const fieldError = (field: HomeAddressField, value: string) =>
    errorMessage(field, blur.visibleError(field, value.trim().length > 0));

  return (
    <ApplyStep
      step="address"
      formId={FORM_ID}
      continueDisabled={!validation.ok}
      submitting={submitting}
      slow={slow}
      networkError={networkError}
    >
      <Text variant="title">Where do you live?</Text>
      <InlineNotice variant="info">Pick a suggestion and we&apos;ll fill in city, state and ZIP.</InlineNotice>
      <StepForm
        id={FORM_ID}
        canSubmit={validation.ok}
        onSubmit={() => submit(() => apply.submitHomeAddress.execute(draft, input))}
        onInvalidSubmit={blur.revealAll}
      >
        <FieldStack>
          <div className={styles.combobox}>
            <TextField
              label="Home address"
              icon="search"
              autoComplete="address-line1"
              value={line1}
              readOnly={submitting}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={listOpen}
              aria-controls={listId}
              aria-activedescendant={listOpen && activeIndex >= 0 ? suggestionOptionId(listId, activeIndex) : undefined}
              onKeyDown={onComboboxKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                blur.onBlur('line1');
              }}
              onValueChange={(value) => {
                setLine1(value);
                setPicked(false);
                blur.onEdit('line1');
              }}
              errorMessage={listOpen ? undefined : fieldError('line1', line1)}
            />
            {listOpen && (
              <SuggestionList
                id={listId}
                label="Address suggestions"
                suggestions={listItems}
                activeIndex={activeIndex}
                onSelect={(item) => {
                  const suggestion = suggestions.find((s) => s.id === item.id);
                  if (suggestion) pick(suggestion);
                }}
              />
            )}
          </div>
          <TextField
            label="City"
            autoComplete="address-level2"
            value={city}
            readOnly={submitting}
            onValueChange={(value) => {
              setCity(value);
              blur.onEdit('city');
            }}
            onBlur={() => blur.onBlur('city')}
            errorMessage={fieldError('city', city)}
          />
          <div className={styles.addressRow}>
            <SelectInput
              label="State"
              autoComplete="address-level1"
              value={state}
              options={STATE_OPTIONS}
              invalid={notServed}
              disabled={submitting}
              aria-describedby={notServed ? `${listId}-state` : undefined}
              onValueChange={(value) => {
                setState(value);
                setNotify('idle');
              }}
            />
            <TextField
              label="ZIP"
              mask="zip"
              autoComplete="postal-code"
              value={zip}
              readOnly={submitting}
              onValueChange={(value) => {
                setZip(value);
                blur.onEdit('zip');
              }}
              onBlur={() => blur.onBlur('zip')}
              errorMessage={fieldError('zip', zip)}
            />
          </div>
          {notServed && (
            <div className={styles.stateNotice}>
              <Text id={`${listId}-state`} variant="caption" tone="danger">
                <span role="alert">Fundo isn&apos;t available in {usStateName(state)} yet.</span>
              </Text>
              {notify === 'sent' ? (
                <Text variant="callout" tone="secondary" as="p">
                  <span role="status">We&apos;ll let you know when Fundo is available in {usStateName(state)}.</span>
                </Text>
              ) : (
                <div>
                  <TextLink size="callout" onClick={notifyMe} disabled={notify === 'sending'}>
                    Notify me when it&apos;s available
                  </TextLink>
                  {notify === 'failed' && (
                    <Text variant="caption" tone="danger" as="p">
                      We couldn&apos;t save your request. Try again.
                    </Text>
                  )}
                </div>
              )}
            </div>
          )}
        </FieldStack>
      </StepForm>
    </ApplyStep>
  );
};
