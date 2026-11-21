import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import styles from './TextLink.module.css';

export type TextLinkTone = 'brand' | 'inverse';
export type TextLinkSize = 'inherit' | 'callout';

interface BaseProps {
  children: ReactNode;
  tone?: TextLinkTone;
  /** inherit: inline inside a paragraph (legal copy). callout: standalone 14/20 semibold ("Notify me…"). */
  size?: TextLinkSize;
  className?: string | undefined;
}

type AsAnchor = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string };
type AsButton = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { href?: undefined };

export type TextLinkProps = AsAnchor | AsButton;

/** Underlined text link. Renders <a> with `href`, otherwise a <button> (in-app action). */
export const TextLink = (props: TextLinkProps) => {
  const { children, tone = 'brand', size = 'inherit', className } = props;
  const classes = cx(styles.link, styles[tone], styles[size], className);

  if (props.href !== undefined) {
    const { children: _c, tone: _t, size: _s, className: _cl, ...anchor } = props;
    return (
      <a className={classes} {...anchor}>
        {children}
      </a>
    );
  }

  const { children: _c, tone: _t, size: _s, className: _cl, type = 'button', ...button } = props;
  return (
    <button type={type} className={cx(classes, styles.button)} {...button}>
      {children}
    </button>
  );
};
