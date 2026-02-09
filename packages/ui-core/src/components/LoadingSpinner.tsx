/**
 * ローディングスピナーコンポーネント
 *
 * データ取得中などの非同期処理を示すスピナーです。
 */

import { Spinner, SpinnerProps, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalXXL,
  },
  label: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
  },
});

export interface LoadingSpinnerProps extends Omit<SpinnerProps, 'label'> {
  /** ローディングメッセージ */
  message?: string;
  /** コンテナの最小高さ */
  minHeight?: string | number;
}

/**
 * LoadingSpinner コンポーネント
 *
 * @example
 * ```tsx
 * <LoadingSpinner message="商品を読み込んでいます..." />
 * ```
 */
export function LoadingSpinner({
  message = '読み込み中...',
  minHeight,
  ...spinnerProps
}: LoadingSpinnerProps) {
  const styles = useStyles();

  return (
    <div
      className={styles.container}
      style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
    >
      <Spinner {...spinnerProps} size="large" />
      {message && <div className={styles.label}>{message}</div>}
    </div>
  );
}
