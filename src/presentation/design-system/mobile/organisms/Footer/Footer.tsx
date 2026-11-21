import { cx } from '@shared/utils/cx';

import bbbBadge from '../../../assets/badges/bbb-accredited.png';
import godaddyBadge from '../../../assets/badges/godaddy-verified.png';
import type { IconName } from '../../../icons';
import { Icon } from '../../atoms/Icon';
import { Logo } from '../../atoms/Logo';
import styles from './Footer.module.css';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSocialLink extends FooterLink {
  icon: Extract<IconName, 'facebook' | 'linkedin' | 'instagram'>;
}

export interface FooterProps {
  links: readonly FooterLink[];
  social: readonly FooterSocialLink[];
  copyright: string;
  className?: string | undefined;
}

/** "Organisms / Footer": dark rounded card with logo, social, legal links and trust badges (landing). */
export const Footer = ({ links, social, copyright, className }: FooterProps) => (
  <div className={cx(styles.wrapper, className)}>
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Logo size="md" color="brand" />
        <ul className={styles.social}>
          {social.map((item) => (
            <li key={item.icon}>
              <a href={item.href} aria-label={item.label} className={styles.socialLink}>
                <Icon name={item.icon} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <nav aria-label="Footer">
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.badges}>
        <img src={bbbBadge} alt="BBB Accredited Business" className={styles.badge} />
        <img src={godaddyBadge} alt="GoDaddy Verified and Secured" className={styles.badge} />
      </div>
      <hr className={styles.divider} />
      <p className={styles.copyright}>{copyright}</p>
    </footer>
  </div>
);
