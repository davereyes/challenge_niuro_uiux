import type { ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import { Button } from '../../atoms/Button';
import { TopBar } from '../TopBar';
import styles from './Hero.module.css';

export interface HeroProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  /** Last word(s) of the title in the accent color ("forward."). */
  titleAccent?: string | undefined;
  subtitle: string;
  ctaLabel: string;
  onCta: () => void;
  /** Legal copy under the CTA (contains TextLinks). */
  legal?: ReactNode;
  /** Animated "scroll" mouse at the bottom. */
  showScrollHint?: boolean;
  className?: string | undefined;
}

/** Full-screen landing hero (canvas 1A): photo, gradient, white logo, headline, inverse CTA and legal. */
export const Hero = ({
  imageSrc,
  imageAlt,
  title,
  titleAccent,
  subtitle,
  ctaLabel,
  onCta,
  legal,
  showScrollHint = true,
  className,
}: HeroProps) => (
  <section aria-label="Hero" className={cx(styles.hero, className)}>
    <img src={imageSrc} alt={imageAlt} className={styles.image} />
    <div className={styles.gradient} aria-hidden="true" />
    <div className={styles.topBar}>
      <TopBar variant="logoOnImage" logoSize="lg" />
    </div>
    <div className={styles.content}>
      <h1 className={cx(styles.title, styles.up)}>
        {title}
        {titleAccent && (
          <>
            {' '}
            <span className={styles.accent}>{titleAccent}</span>
          </>
        )}
      </h1>
      <p className={cx(styles.subtitle, styles.up)}>{subtitle}</p>
      <div className={cx(styles.cta, styles.up)}>
        <Button variant="inverse" label={ctaLabel} onClick={onCta} />
      </div>
      {legal && <div className={cx(styles.legal, styles.up)}>{legal}</div>}
    </div>
    {showScrollHint && (
      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.mouse}>
          <span className={styles.wheel} />
        </span>
      </div>
    )}
  </section>
);
