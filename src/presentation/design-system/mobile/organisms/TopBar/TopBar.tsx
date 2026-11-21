import { cx } from '@shared/utils/cx';

import { IconButton } from '../../atoms/IconButton';
import { Logo, type LogoSize } from '../../atoms/Logo';
import { ProgressBar } from '../../atoms/ProgressBar';
import { Text } from '../../atoms/Text';
import styles from './TopBar.module.css';

export type TopBarVariant = 'title' | 'logo' | 'logoOnImage' | 'large';

export interface TopBarProps {
  /** title: centered 17/22 · logo: brand logo · logoOnImage: white logo, transparent (hero) · large: 28/34 title below */
  variant?: TopBarVariant;
  title?: string;
  /** Off in the Apply Now flow: back lives next to Continue. */
  showBack?: boolean;
  onBack?: (() => void) | undefined;
  showClose?: boolean;
  onClose?: (() => void) | undefined;
  /** 3px stepper under the bar. */
  showStepper?: boolean;
  /** 0–100 */
  progress?: number;
  logoSize?: LogoSize;
  className?: string | undefined;
}

/** "Molecules / Top Bar" in the canvas (it composes atoms and owns layout → organism here). */
export const TopBar = ({
  variant = 'title',
  title = '',
  showBack = false,
  onBack,
  showClose = false,
  onClose,
  showStepper = false,
  progress = 0,
  logoSize = 'sm',
  className,
}: TopBarProps) => {
  const onImage = variant === 'logoOnImage';
  const isLogo = variant === 'logo' || onImage;

  return (
    <header className={cx(styles.topBar, onImage && styles.onImage, className)}>
      <div className={styles.row}>
        <div className={styles.slot}>
          {showBack && !onImage && <IconButton icon="back" label="Back" onClick={onBack} />}
        </div>
        <div className={styles.center}>
          {variant === 'title' && title && (
            <Text variant="headline" as="p" align="center" truncate>
              {title}
            </Text>
          )}
          {isLogo && <Logo size={logoSize} color={onImage ? 'white' : 'brand'} />}
        </div>
        <div className={styles.slot}>{showClose && <IconButton icon="close" label="Close" onClick={onClose} />}</div>
      </div>
      {variant === 'large' && title && (
        <Text variant="title" className={styles.large}>
          {title}
        </Text>
      )}
      {showStepper && <ProgressBar value={progress} tone={onImage ? 'onImage' : 'default'} />}
    </header>
  );
};
