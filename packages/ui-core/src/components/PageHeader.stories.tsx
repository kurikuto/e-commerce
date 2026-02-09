/**
 * PageHeader コンポーネントのストーリー
 *
 * ページヘッダーコンポーネントの使用例を提供します。
 */

import { Button } from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader';

/**
 * PageHeaderは、各ページの上部に表示するヘッダーコンポーネントです。
 *
 * ## 主な用途
 * - ページのタイトルと説明の表示
 * - アクションボタン（新規作成など）の配置
 * - フィルターや検索ボックスの配置
 *
 * ## 機能
 * - タイトルと説明のテキスト表示
 * - 右側へのアクションボタン配置
 * - 追加コンテンツの表示（children）
 */
const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ページ上部に配置するヘッダーコンポーネント。タイトル、説明、アクションボタンを表示します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'ページのタイトル',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: 'ページの説明（オプショナル）',
      table: {
        type: { summary: 'string' },
      },
    },
    actions: {
      control: false,
      description: 'ヘッダー右側に表示するアクションボタン',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    children: {
      control: false,
      description: '追加のコンテンツ（フィルター、検索ボックスなど）',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの表示
 *
 * タイトルのみのシンプルなヘッダーです。
 */
export const Default: Story = {
  args: {
    title: '商品一覧',
  },
};

/**
 * 説明付き
 *
 * タイトルと説明を表示します。
 */
export const WithDescription: Story = {
  args: {
    title: '商品一覧',
    description: 'カタログに登録されているすべての商品を表示します。',
  },
};

/**
 * アクションボタン付き
 *
 * 右側にアクションボタンを配置します。
 */
export const WithActions: Story = {
  args: {
    title: '商品一覧',
    description: 'カタログに登録されているすべての商品を表示します。',
    actions: (
      <>
        <Button appearance="secondary">エクスポート</Button>
        <Button appearance="primary" icon={<AddRegular />}>
          新規商品
        </Button>
      </>
    ),
  },
};

/**
 * 単一アクションボタン
 *
 * 1つのアクションボタンのみを配置します。
 */
export const WithSingleAction: Story = {
  args: {
    title: 'ユーザー管理',
    description: 'システムのユーザーアカウントを管理します。',
    actions: (
      <Button appearance="primary" icon={<AddRegular />}>
        ユーザーを追加
      </Button>
    ),
  },
};

/**
 * 複数アクション
 *
 * 3つ以上のアクションボタンを配置できます。
 */
export const WithMultipleActions: Story = {
  args: {
    title: '注文管理',
    description: 'すべての注文を管理・処理します。',
    actions: (
      <>
        <Button>フィルター</Button>
        <Button appearance="secondary">エクスポート</Button>
        <Button appearance="secondary">インポート</Button>
        <Button appearance="primary">新規注文</Button>
      </>
    ),
  },
};

/**
 * 子要素付き
 *
 * ヘッダー下部に追加のコンテンツを配置します。
 * フィルターや検索ボックスなどを配置するのに便利です。
 */
export const WithChildren: Story = {
  args: {
    title: '商品一覧',
    description: 'カタログに登録されているすべての商品を表示します。',
    actions: (
      <Button appearance="primary" icon={<AddRegular />}>
        新規商品
      </Button>
    ),
    children: (
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button appearance="subtle">すべて</Button>
        <Button appearance="subtle">公開中</Button>
        <Button appearance="subtle">下書き</Button>
        <Button appearance="subtle">非公開</Button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'children propsを使用して、フィルターボタンなどの追加UIを配置できます。',
      },
    },
  },
};

/**
 * 長いタイトル
 *
 * 長いタイトルでも適切にレイアウトされます。
 */
export const LongTitle: Story = {
  args: {
    title: 'グローバルマーケットプレイス向け多言語商品カタログ管理システム',
    description: '世界中の顧客に向けた商品情報を多言語で管理・配信するためのシステムです。',
    actions: (
      <Button appearance="primary" icon={<AddRegular />}>
        新規商品
      </Button>
    ),
  },
};

/**
 * アクションのみ（説明なし）
 *
 * タイトルとアクションのみで、説明を省略したパターンです。
 */
export const TitleAndActionsOnly: Story = {
  args: {
    title: 'ダッシュボード',
    actions: (
      <>
        <Button appearance="secondary">設定</Button>
        <Button appearance="primary">更新</Button>
      </>
    ),
  },
};
