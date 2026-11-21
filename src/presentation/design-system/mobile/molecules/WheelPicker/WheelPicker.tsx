import { cx } from '@shared/utils/cx';

import { WheelColumn, type WheelColumnProps } from './WheelColumn';
import styles from './WheelPicker.module.css';

export interface WheelPickerProps {
  columns: readonly (WheelColumnProps & { id: string })[];
  className?: string | undefined;
}

/** iOS-style multi-column wheel (canvas 1F / 1J): center highlight + fade at the edges. */
export const WheelPicker = ({ columns, className }: WheelPickerProps) => (
  <div className={cx(styles.picker, className)}>
    <div className={styles.highlight} aria-hidden="true" />
    {columns.map(({ id, ...column }) => (
      <WheelColumn key={id} {...column} />
    ))}
    <div className={styles.fade} aria-hidden="true" />
  </div>
);
