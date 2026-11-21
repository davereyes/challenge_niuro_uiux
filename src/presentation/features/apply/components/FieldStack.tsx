import type { ReactNode } from 'react';

import styles from './StepForm.module.css';

/** Vertical stack of fields with the canvas 12px gap. */
export const FieldStack = ({ children }: { children: ReactNode }) => <div className={styles.fields}>{children}</div>;
