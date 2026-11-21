import { useId } from 'react';

import { cx } from '@shared/utils/cx';

import { Icon } from '../../atoms/Icon';
import styles from './AccordionItem.module.css';

export interface AccordionItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  className?: string | undefined;
}

/** FAQ disclosure (button with aria-expanded + region). */
export const AccordionItem = ({ question, answer, open, onToggle, className }: AccordionItemProps) => {
  const panelId = useId();
  return (
    <div className={cx(styles.item, className)}>
      <h3 className={styles.heading}>
        <button type="button" aria-expanded={open} aria-controls={panelId} className={styles.trigger} onClick={onToggle}>
          <span>{question}</span>
          <span className={cx(styles.chevron, open && styles.open)} aria-hidden="true">
            <Icon name="chevron-down" />
          </span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-label={question} hidden={!open} className={styles.panel}>
        <p className={styles.answer}>{answer}</p>
      </div>
    </div>
  );
};
