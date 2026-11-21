import { useRef, type KeyboardEvent } from 'react';

import { cx } from '@shared/utils/cx';

import type { IconName } from '../../../icons';
import { OptionCard } from '../../molecules/OptionCard';
import styles from './OptionCardGroup.module.css';

export interface OptionCardOption<T extends string> {
  value: T;
  label: string;
  description?: string | undefined;
  icon?: IconName | undefined;
}

export interface OptionCardGroupProps<T extends string> {
  /** id of the visible question (the page h1), used as the group's accessible name. */
  labelledBy: string;
  options: readonly OptionCardOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  className?: string | undefined;
}

/** Single-choice radiogroup of OptionCards with roving tabindex and arrow-key selection (WAI-ARIA radio pattern). */
export const OptionCardGroup = <T extends string>({
  labelledBy,
  options,
  value,
  onChange,
  className,
}: OptionCardGroupProps<T>) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const focusableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const move = (from: number, delta: number) => {
    const next = (from + delta + options.length) % options.length;
    const option = options[next];
    if (!option) return;
    onChange(option.value);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(index, 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(index, -1);
    }
  };

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className={cx(styles.group, className)}>
      {options.map((option, index) => (
        <OptionCard
          key={option.value}
          ref={(element) => {
            refs.current[index] = element;
          }}
          label={option.label}
          description={option.description}
          icon={option.icon}
          selected={option.value === value}
          tabIndex={index === focusableIndex ? 0 : -1}
          onClick={() => onChange(option.value)}
          onKeyDown={(event) => onKeyDown(event, index)}
        />
      ))}
    </div>
  );
};
