/**
 * エラーバウンダリコンポーネント
 *
 * Reactコンポーネントツリー内のJavaScriptエラーをキャッチし、
 * エラーをログに記録して、フォールバックUIを表示します。
 */

import { Component, ReactNode } from 'react';
import { MessageBar, MessageBarBody, Button, makeStyles, tokens } from '@fluentui/react-components';
import { ErrorCircle24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalXXL,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalL,
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorPaletteRedForeground1,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  message: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    maxWidth: '600px',
  },
});

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** エラー時に表示するフォールバックUI */
  fallback?: ReactNode;
  /** エラー発生時のコールバック */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary コンポーネント
 *
 * 子コンポーネントでエラーが発生した場合に、
 * アプリケーション全体がクラッシュするのを防ぎます。
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  onReset: () => void;
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps) {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <ErrorCircle24Regular className={styles.icon} />
      <div className={styles.title}>エラーが発生しました</div>
      <div className={styles.message}>
        予期しないエラーが発生しました。ページを再読み込みするか、
        しばらく時間をおいてから再度お試しください。
      </div>
      {error && (
        <MessageBar intent="error">
          <MessageBarBody>{error.message}</MessageBarBody>
        </MessageBar>
      )}
      <Button appearance="primary" onClick={onReset}>
        再試行
      </Button>
    </div>
  );
}
