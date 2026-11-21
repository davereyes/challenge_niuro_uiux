import { useState } from 'react';

import { cx } from '@shared/utils/cx';

import { AccordionItem } from '../../molecules/AccordionItem';
import styles from './Accordion.module.css';

export interface AccordionEntry {
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: readonly AccordionEntry[];
  /** Index open on mount (canvas: the first one). -1 = all closed. */
  defaultOpenIndex?: number;
  className?: string | undefined;
}

/** FAQ list: one item open at a time. */
export const Accordion = ({ items, defaultOpenIndex = 0, className }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);
  return (
    <div className={cx(styles.accordion, className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.question}
          question={item.question}
          answer={item.answer}
          open={openIndex === index}
          onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
        />
      ))}
    </div>
  );
};
