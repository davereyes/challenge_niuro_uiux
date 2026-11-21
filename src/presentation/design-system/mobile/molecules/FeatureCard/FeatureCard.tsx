import { cx } from '@shared/utils/cx';

import type { IconName } from '../../../icons';
import { IconCircle } from '../../atoms/IconCircle';
import styles from './FeatureCard.module.css';

export type FeatureCardTone = 'brand' | 'neutral' | 'image';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconName;
  tone?: FeatureCardTone;
  /** Background photo for tone="image" (decorative). */
  imageSrc?: string | undefined;
  className?: string | undefined;
}

/** Audience card of the landing ("Who we work with"). */
export const FeatureCard = ({ title, description, icon, tone = 'neutral', imageSrc, className }: FeatureCardProps) => (
  <article className={cx(styles.card, styles[tone], className)}>
    {tone === 'image' && imageSrc && (
      <>
        <img src={imageSrc} alt="" className={styles.photo} />
        <span className={styles.scrim} aria-hidden="true" />
      </>
    )}
    <IconCircle
      icon={icon}
      tone={tone === 'brand' ? 'onBrand' : tone === 'image' ? 'onImage' : 'surface'}
      className={cx(styles.layer, tone === 'neutral' && styles.iconNeutral)}
    />
    <div className={cx(styles.layer, styles.text)}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  </article>
);
