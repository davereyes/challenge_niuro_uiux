import { cx } from '@shared/utils/cx';

import { Icon } from '../../atoms/Icon';
import styles from './SuggestionList.module.css';
import { suggestionOptionId } from './suggestionOptionId';

export interface Suggestion {
  id: string;
  primary: string;
  secondary?: string | undefined;
}

export interface SuggestionListProps {
  /** Referenced by the input's aria-controls. */
  id: string;
  label: string;
  suggestions: readonly Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  /** Index highlighted with the keyboard (combobox aria-activedescendant). */
  activeIndex?: number;
  className?: string | undefined;
}

/** Address autocomplete dropdown (canvas 1H). Pair it with an InputText acting as combobox. */
export const SuggestionList = ({ id, label, suggestions, onSelect, activeIndex = -1, className }: SuggestionListProps) => (
  <div id={id} role="listbox" aria-label={label} className={cx(styles.list, className)}>
    {suggestions.map((suggestion, index) => (
      // Keyboard navigation lives on the combobox input (aria-activedescendant), per the WAI-ARIA combobox pattern.
      // oxlint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        key={suggestion.id}
        id={suggestionOptionId(id, index)}
        role="option"
        tabIndex={-1}
        aria-selected={index === activeIndex}
        className={cx(styles.option, index === activeIndex && styles.active)}
        // mousedown keeps focus in the input so the list does not close before the click lands
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onSelect(suggestion)}
      >
        <Icon name="map-pin" className={styles.icon} />
        <span className={styles.text}>
          <span className={styles.primary}>{suggestion.primary}</span>
          {suggestion.secondary && <span className={styles.secondary}>{suggestion.secondary}</span>}
        </span>
      </div>
    ))}
  </div>
);
