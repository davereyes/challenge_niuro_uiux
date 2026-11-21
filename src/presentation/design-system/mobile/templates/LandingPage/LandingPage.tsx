import type { ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import styles from './LandingPage.module.css';

export interface LandingPageProps {
  /** Usually the Hero organism. */
  hero: ReactNode;
  /** LandingSection blocks. */
  children: ReactNode;
  /** Usually the Footer organism. */
  footer: ReactNode;
  overlays?: ReactNode;
  className?: string | undefined;
}

/** Template for the marketing landing (canvas 1A): hero · sections · footer. */
export const LandingPage = ({ hero, children, footer, overlays, className }: LandingPageProps) => (
  <div className={cx(styles.page, className)}>
    <main>
      {hero}
      {children}
    </main>
    {footer}
    {overlays}
  </div>
);

export interface LandingSectionProps {
  /** id of the section heading (aria-labelledby). */
  labelledBy: string;
  children: ReactNode;
  /** Last section adds bottom padding before the footer (FAQ). */
  last?: boolean;
  className?: string | undefined;
}

/** Section wrapper with the landing rhythm (56px top, 24px gutters). */
export const LandingSection = ({ labelledBy, children, last = false, className }: LandingSectionProps) => (
  <section aria-labelledby={labelledBy} className={cx(styles.section, last && styles.last, className)}>
    {children}
  </section>
);
