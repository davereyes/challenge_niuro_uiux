import type { FormEvent, ReactNode } from 'react';

import styles from './StepForm.module.css';

export interface StepFormProps {
  id: string;
  /** Called on submit (Continue or keyboard "Go") only when the step is valid. */
  onSubmit: () => void;
  canSubmit: boolean;
  /** Reveal all errors when the user tries to submit an invalid step. */
  onInvalidSubmit?: () => void;
  children: ReactNode;
}

/** <form> wrapper so the mobile keyboard's "Go" submits the step; the CTA lives in the anchored bar. */
export const StepForm = ({ id, onSubmit, canSubmit, onInvalidSubmit, children }: StepFormProps) => (
  <form
    id={id}
    noValidate
    className={styles.form}
    onSubmit={(event: FormEvent) => {
      event.preventDefault();
      if (canSubmit) onSubmit();
      else onInvalidSubmit?.();
    }}
  >
    {children}
  </form>
);
