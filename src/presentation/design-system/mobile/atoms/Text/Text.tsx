import type { ElementType, ReactNode } from 'react';

import { cx } from '@shared/utils/cx';

import styles from './Text.module.css';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'section'
  | 'stat'
  | 'headline'
  | 'lead'
  | 'body'
  | 'bodySmall'
  | 'callout'
  | 'caption'
  | 'micro';

export type TextTone =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'brand'
  | 'accent'
  | 'danger'
  | 'inverse'
  | 'inverseMuted'
  | 'inherit';

export type TextAlign = 'start' | 'center' | 'end';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/** Semantic element used by default for each variant. Override with `as`. */
const DEFAULT_ELEMENT: Record<TextVariant, ElementType> = {
  display: 'h1',
  title: 'h1',
  heading: 'h2',
  section: 'h2',
  stat: 'span',
  headline: 'h3',
  lead: 'p',
  body: 'p',
  bodySmall: 'p',
  callout: 'p',
  caption: 'p',
  micro: 'p',
};

export interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  tone?: TextTone;
  align?: TextAlign;
  /** Overrides the variant's default weight. */
  weight?: TextWeight | undefined;
  /** Truncate to one line with an ellipsis. */
  truncate?: boolean;
  as?: ElementType;
  className?: string | undefined;
  id?: string | undefined;
}

/** Typography from the canvas. See Foundations / Typography for sizes and usage. */
export const Text = ({
  children,
  variant = 'body',
  tone = 'primary',
  align = 'start',
  weight,
  truncate = false,
  as,
  className,
  id,
}: TextProps) => {
  const Component = as ?? DEFAULT_ELEMENT[variant];

  return (
    <Component
      id={id}
      className={cx(
        styles.text,
        styles[variant],
        styles[`tone-${tone}`],
        styles[`align-${align}`],
        weight && styles[`weight-${weight}`],
        truncate && styles.truncate,
        className,
      )}
    >
      {children}
    </Component>
  );
};
