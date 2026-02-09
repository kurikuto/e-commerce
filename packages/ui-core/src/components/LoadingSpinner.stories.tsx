/**
 * LoadingSpinner コンポーネントのストーリー
 *
 * ローディング状態を表示するスピナーコンポーネントの使用例を提供します。
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * LoadingSpinnerは、データ取得中などの非同期処理を示すスピナーコンポーネントです。
 *
 * ## 主な用途
 * - ページ全体のローディング
 * - データテーブルの読み込み中表示
 * - 非同期処理の待機状態
 *
 * ## 機能
 * - カスタマイズ可能なメッセージ
 * - 最小高さの設定
 * - Fluent UIのSpinnerをベースにした一貫性のあるデザイン
 */
const meta = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ローディング状態を表示するスピナーコンポーネント。非同期処理の進行中であることをユーザーに伝えます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'ローディング中に表示するメッセージ',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '読み込み中...' },
      },
    },
    minHeight: {
      control: 'text',
      description: 'コンテナの最小高さ（CSSの値）',
      table: {
        type: { summary: 'string | number' },
      },
    },
    size: {
      control: 'select',
      options: ['tiny', 'extra-small', 'small', 'medium', 'large', 'extra-large', 'huge'],
      description: 'スピナーのサイズ',
      table: {
        type: { summary: 'SpinnerSize' },
        defaultValue: { summary: 'medium' },
      },
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの表示
 *
 * 基本的なローディングスピナーの表示です。
 */
export const Default: Story = {
  args: {},
};

/**
 * カスタムメッセージ
 *
 * ローディング中のメッセージをカスタマイズできます。
 */
export const WithCustomMessage: Story = {
  args: {
    message: '商品データを読み込んでいます...',
  },
};

/**
 * サイズバリエーション - 小
 *
 * 小さいサイズのスピナーです。コンパクトな領域に適しています。
 */
export const SmallSize: Story = {
  args: {
    message: '処理中...',
    size: 'small',
  },
};

/**
 * サイズバリエーション - 大
 *
 * 大きいサイズのスピナーです。ページ全体のローディングに適しています。
 */
export const LargeSize: Story = {
  args: {
    message: 'アプリケーションを起動しています...',
    size: 'large',
  },
};

/**
 * 最小高さ指定
 *
 * コンテナの最小高さを指定して、レイアウトのガタつきを防ぎます。
 */
export const WithMinHeight: Story = {
  args: {
    message: 'データを取得しています...',
    minHeight: '400px',
  },
  parameters: {
    docs: {
      description: {
        story: 'データテーブルなど、高さが決まっている領域でのローディング表示に便利です。',
      },
    },
  },
};

/**
 * 長いメッセージ
 *
 * 複数行になる長いメッセージも適切に表示されます。
 */
export const LongMessage: Story = {
  args: {
    message:
      '大量のデータを処理しています。この処理には数分かかる場合があります。しばらくお待ちください。',
  },
};

/**
 * メッセージなし
 *
 * メッセージを表示せず、スピナーのみを表示します。
 */
export const WithoutMessage: Story = {
  args: {
    message: '',
  },
};
