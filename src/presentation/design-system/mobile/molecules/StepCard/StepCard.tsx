import { cx } from '@shared/utils/cx';

import { IconCircle } from '../../atoms/IconCircle';
import styles from './StepCard.module.css';

export type StepCardTone = 'brand' | 'neutral';

export interface StepCardProps {
  step: number;
  title: string;
  description: string;
  tone?: StepCardTone;
  className?: string | undefined;
}

/** Numbered step card ("What to expect"). */
export const StepCard = ({ step, title, description, tone = 'neutral', className }: StepCardProps) => (
  <article className={cx(styles.card, styles[tone], className)}>
    <IconCircle tone={tone === 'brand' ? 'onBrand' : 'surface'} className={styles.number}>
      {step}
    </IconCircle>
    <div className={styles.text}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  </article>
);
