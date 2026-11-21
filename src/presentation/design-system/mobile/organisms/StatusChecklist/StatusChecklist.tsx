import { StatusItem, type StatusItemStatus } from '../../molecules/StatusItem';
import styles from './StatusChecklist.module.css';

export interface StatusChecklistItem {
  id: string;
  label: string;
  status: StatusItemStatus;
}

export interface StatusChecklistProps {
  items: readonly StatusChecklistItem[];
  className?: string | undefined;
}

/** Live checklist announced politely as each step completes (canvas 1G→). */
export const StatusChecklist = ({ items, className }: StatusChecklistProps) => (
  <div role="status" aria-live="polite" className={className}>
    <ul className={styles.list}>
      {items.map((item) => (
        <StatusItem key={item.id} label={item.label} status={item.status} />
      ))}
    </ul>
  </div>
);
