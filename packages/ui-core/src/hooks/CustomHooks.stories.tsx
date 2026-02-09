/**
 * カスタムフックのストーリー
 *
 * ui-coreパッケージで提供されるカスタムフックの使用例を提供します。
 */

import { Badge, Button, Card, Input, Label } from '@fluentui/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';
import { usePrevious } from './usePrevious';
import { useToggle } from './useToggle';

/**
 * useDebounce フックのデモコンポーネント
 */
const UseDebounceDemoComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [callCount, setCallCount] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // 検索が実行されたことをシミュレート
      setCallCount((prev) => prev + 1);
    }
  }, [debouncedSearchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
      <div>
        <Label>検索キーワード</Label>
        <Input
          value={searchTerm}
          onChange={(_, data) => setSearchTerm(data.value)}
          placeholder="検索キーワードを入力..."
        />
      </div>

      <Card>
        <div style={{ padding: '16px' }}>
          <p>
            <strong>入力値:</strong> {searchTerm || '（なし）'}
          </p>
          <p>
            <strong>デバウンス後の値:</strong> {debouncedSearchTerm || '（なし）'}
          </p>
          <p>
            <strong>検索API呼び出し回数:</strong>{' '}
            <Badge appearance="filled" color="brand">
              {callCount}回
            </Badge>
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
            💡 入力を停止して500ms後にデバウンスされた値が更新されます。
            これにより、API呼び出しの回数を削減できます。
          </p>
        </div>
      </Card>
    </div>
  );
};

/**
 * useToggle フックのデモコンポーネント
 */
const UseToggleDemoComponent = () => {
  const [isMenuOpen, toggleMenu, setMenuOpen] = useToggle(false);
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  const [isLoading, toggleLoading] = useToggle(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
      <Card>
        <div style={{ padding: '16px' }}>
          <h3>メニューの開閉</h3>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <Button appearance="primary" onClick={toggleMenu}>
              トグル
            </Button>
            <Button onClick={() => setMenuOpen(true)}>開く</Button>
            <Button onClick={() => setMenuOpen(false)}>閉じる</Button>
          </div>
          <p style={{ marginTop: '12px' }}>
            状態:{' '}
            <Badge appearance="filled" color={isMenuOpen ? 'success' : 'danger'}>
              {isMenuOpen ? 'メニュー開' : 'メニュー閉'}
            </Badge>
          </p>
        </div>
      </Card>

      <Card>
        <div style={{ padding: '16px' }}>
          <h3>ダークモード切り替え</h3>
          <Button appearance="primary" onClick={toggleDarkMode}>
            {isDarkMode ? '☀️ ライトモード' : '🌙 ダークモード'}
          </Button>
          <p style={{ marginTop: '12px' }}>
            現在のテーマ:{' '}
            <Badge appearance="filled" color={isDarkMode ? 'important' : 'brand'}>
              {isDarkMode ? 'Dark' : 'Light'}
            </Badge>
          </p>
        </div>
      </Card>

      <Card>
        <div style={{ padding: '16px' }}>
          <h3>ローディング状態</h3>
          <Button appearance="primary" onClick={toggleLoading} disabled={isLoading}>
            {isLoading ? '読み込み中...' : 'データを取得'}
          </Button>
          <p style={{ marginTop: '12px' }}>
            状態:{' '}
            <Badge appearance="filled" color={isLoading ? 'warning' : 'success'}>
              {isLoading ? 'Loading...' : 'Ready'}
            </Badge>
          </p>
        </div>
      </Card>
    </div>
  );
};

/**
 * useLocalStorage フックのデモコンポーネント
 */
const UseLocalStorageDemoComponent = () => {
  const [name, setName] = useLocalStorage('user-name', '');
  const [count, setCount] = useLocalStorage('counter', 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
      <Card>
        <div style={{ padding: '16px' }}>
          <h3>名前の保存</h3>
          <Label>お名前</Label>
          <Input
            value={name}
            onChange={(_, data) => setName(data.value)}
            placeholder="名前を入力..."
          />
          <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
            💡 入力内容はlocalStorageに自動保存されます。ページをリロードしても保持されます。
          </p>
        </div>
      </Card>

      <Card>
        <div style={{ padding: '16px' }}>
          <h3>カウンター</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button onClick={() => setCount(count - 1)}>-</Button>
            <Badge appearance="filled" color="brand" size="extra-large">
              {count}
            </Badge>
            <Button onClick={() => setCount(count + 1)}>+</Button>
            <Button appearance="secondary" onClick={() => setCount(0)}>
              リセット
            </Button>
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
            💡 カウント値もlocalStorageに保存されます。
          </p>
        </div>
      </Card>
    </div>
  );
};

/**
 * usePrevious フックのデモコンポーネント
 */
const UsePreviousDemoComponent = () => {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
      <Card>
        <div style={{ padding: '16px' }}>
          <h3>カウンター（前回値の追跡）</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <Button onClick={() => setCount(count - 1)}>-</Button>
            <Badge appearance="filled" color="brand" size="extra-large">
              {count}
            </Badge>
            <Button onClick={() => setCount(count + 1)}>+</Button>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <p>
              <strong>現在の値:</strong> {count}
            </p>
            <p>
              <strong>前回の値:</strong> {previousCount ?? '（なし）'}
            </p>
            <p>
              <strong>変化量:</strong> {previousCount !== undefined ? count - previousCount : 0}
            </p>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
            💡 前回のレンダリング時の値を追跡できます。値の変化を検知するのに便利です。
          </p>
        </div>
      </Card>
    </div>
  );
};

/**
 * カスタムフックのドキュメントとデモ
 *
 * ui-coreパッケージで提供される便利なReactカスタムフックの使用例です。
 *
 * ## 提供されるフック
 * - **useDebounce**: 値の変更を遅延させ、頻繁な更新を防ぐ
 * - **useToggle**: boolean値の切り替えを簡単に行う
 * - **useLocalStorage**: localStorageとstate管理を統合
 * - **usePrevious**: 前回のレンダリング時の値を追跡
 * - **useMediaQuery**: メディアクエリの状態を監視
 *
 * ## 使用上の注意
 * - これらのフックはReactコンポーネント内でのみ使用できます
 * - フックのルールに従ってください（条件分岐やループ内で呼び出さない）
 */
const meta = {
  title: 'Hooks/Custom Hooks',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'ui-coreパッケージで提供される便利なReactカスタムフックのデモとドキュメント。',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * useDebounce - 検索入力の最適化
 *
 * 入力値の変更を遅延させることで、API呼び出しを削減します。
 * 検索ボックス、オートコンプリートなどで有用です。
 */
export const UseDebounce: Story = {
  render: () => <UseDebounceDemoComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'useDebounceフックは、ユーザーの入力が停止してから指定時間後に値を更新します。これにより、API呼び出しやコストの高い処理の回数を大幅に削減できます。',
      },
    },
  },
};

/**
 * useToggle - シンプルな状態切り替え
 *
 * boolean値の切り替えを簡潔に記述できます。
 * モーダル、メニュー、テーマ切り替えなどで有用です。
 */
export const UseToggle: Story = {
  render: () => <UseToggleDemoComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'useToggleフックは、boolean状態の管理を簡素化します。トグル関数と直接設定する関数の両方を提供します。',
      },
    },
  },
};

/**
 * useLocalStorage - 永続的な状態管理
 *
 * stateとlocalStorageを同期させ、ブラウザリロード後も値を保持します。
 * ユーザー設定、フォームの下書きなどで有用です。
 */
export const UseLocalStorage: Story = {
  render: () => <UseLocalStorageDemoComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'useLocalStorageフックは、ReactのstateとブラウザのlocalStorageを自動的に同期します。ページをリロードしても値が保持されます。',
      },
    },
  },
};

/**
 * usePrevious - 前回値の追跡
 *
 * 前回のレンダリング時の値を保持します。
 * 値の変化の検知、アニメーション、差分計算などで有用です。
 */
export const UsePrevious: Story = {
  render: () => <UsePreviousDemoComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'usePreviousフックは、前回のレンダリング時の値を追跡します。現在の値と比較することで、変化量を計算したり、特定の変化に反応したりできます。',
      },
    },
  },
};
