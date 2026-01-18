/**
 * ErrorBoundary コンポーネントのストーリー
 *
 * エラーバウンダリコンポーネントの使用例を提供します。
 */

import { Button } from '@fluentui/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * エラーをスローするコンポーネント（テスト用）
 */
const ThrowErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('これはテスト用のエラーです');
  }
  return <div>正常に表示されています</div>;
};

/**
 * ボタンクリックでエラーをスローするコンポーネント（テスト用）
 */
const InteractiveErrorComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('ボタンクリックによるエラーが発生しました');
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>エラーバウンダリのテストコンポーネントです。</p>
      <Button appearance="primary" onClick={() => setShouldThrow(true)}>
        エラーをスローする
      </Button>
    </div>
  );
};

/**
 * ErrorBoundaryは、Reactコンポーネントツリー内のJavaScriptエラーをキャッチし、
 * エラーをログに記録して、フォールバックUIを表示するコンポーネントです。
 *
 * ## 主な用途
 * - アプリケーション全体のエラーハンドリング
 * - 特定のセクションのエラー分離
 * - エラー発生時のユーザーフレンドリーな表示
 *
 * ## 機能
 * - 子コンポーネントのエラーをキャッチ
 * - カスタマイズ可能なフォールバックUI
 * - エラー発生時のコールバック
 * - リセット機能
 *
 * ## 注意事項
 * ErrorBoundaryは以下のエラーをキャッチしません：
 * - イベントハンドラー内のエラー
 * - 非同期コード（setTimeout、Promise等）のエラー
 * - サーバーサイドレンダリング
 * - ErrorBoundary自身がスローしたエラー
 */
const meta = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Reactコンポーネントツリー内のエラーをキャッチし、フォールバックUIを表示するコンポーネント。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'エラー監視対象の子コンポーネント',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    fallback: {
      control: false,
      description: 'エラー発生時に表示するカスタムUI',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    onError: {
      control: false,
      description: 'エラー発生時のコールバック関数',
      table: {
        type: { summary: '(error: Error, errorInfo: React.ErrorInfo) => void' },
      },
    },
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 正常動作
 *
 * エラーが発生しない場合、子コンポーネントがそのまま表示されます。
 */
export const NoError: Story = {
  args: {
    children: (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h3>正常に動作しています</h3>
        <p>このコンポーネントはエラーをスローしていません。</p>
      </div>
    ),
  },
};

/**
 * デフォルトエラー表示
 *
 * エラーが発生した場合、デフォルトのエラーUIが表示されます。
 */
export const DefaultErrorUI: Story = {
  args: {
    children: <ThrowErrorComponent shouldThrow={true} />,
    onError: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'エラーが発生すると、デフォルトのエラーメッセージとリトライボタンが表示されます。',
      },
    },
  },
};

/**
 * カスタムフォールバックUI
 *
 * エラー時に表示するUIをカスタマイズできます。
 */
export const CustomFallback: Story = {
  args: {
    children: <ThrowErrorComponent shouldThrow={true} />,
    onError: fn(),
    fallback: (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#fff4e6',
        border: '2px solid #ff8c00',
        borderRadius: '8px'
      }}>
        <h2>🚧 メンテナンス中</h2>
        <p>現在この機能はメンテナンス中です。</p>
        <p>後ほど再度お試しください。</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'fallback propsを使用して、独自のエラーUIを表示できます。',
      },
    },
  },
};

/**
 * インタラクティブなエラー
 *
 * ボタンクリックでエラーを発生させるデモです。
 */
export const InteractiveError: Story = {
  args: {
    children: <InteractiveErrorComponent />,
    onError: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'ボタンをクリックするとエラーが発生し、ErrorBoundaryが動作します。リトライボタンで再度試すことができます。',
      },
    },
  },
};

/**
 * 複数のセクション
 *
 * 複数のErrorBoundaryを使用して、エラーを分離できます。
 */
export const MultipleSections: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <ErrorBoundary>
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <h3>セクション 1（正常）</h3>
          <p>このセクションは正常に動作しています。</p>
        </div>
      </ErrorBoundary>

      <ErrorBoundary>
        <div style={{ flex: 1 }}>
          <ThrowErrorComponent shouldThrow={true} />
        </div>
      </ErrorBoundary>

      <ErrorBoundary>
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <h3>セクション 3（正常）</h3>
          <p>このセクションも正常に動作しています。</p>
        </div>
      </ErrorBoundary>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '各セクションを個別のErrorBoundaryで囲むことで、1つのセクションでエラーが発生しても他のセクションは正常に動作し続けます。',
      },
    },
  },
};

/**
 * ネストされたErrorBoundary
 *
 * ErrorBoundaryをネストして、階層的なエラーハンドリングを実現できます。
 */
export const NestedErrorBoundaries: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <ErrorBoundary
      fallback={
        <div style={{ padding: '40px', backgroundColor: '#ffe6e6', border: '2px solid #ff0000', borderRadius: '8px' }}>
          <h2>外側のErrorBoundaryでキャッチ</h2>
          <p>内側でエラーが発生しましたが、外側でキャッチしました。</p>
        </div>
      }
    >
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h3>外側のセクション</h3>
        <ErrorBoundary
          fallback={
            <div style={{ padding: '20px', backgroundColor: '#fff4e6', border: '2px solid #ff8c00', borderRadius: '4px' }}>
              <h4>内側のErrorBoundaryでキャッチ</h4>
              <p>このエラーは内側でハンドリングされています。</p>
            </div>
          }
        >
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ErrorBoundaryをネストして、より細かいエラーハンドリングを実現できます。',
      },
    },
  },
};
