/**
 * Storybook プレビュー設定
 *
 * すべてのStoryに適用されるグローバル設定を定義します。
 * - Fluent UI のテーマ設定
 * - デコレーター（ラッパーコンポーネント）
 * - パラメータ（ビューポート、背景色など）
 *
 * @see https://storybook.js.org/docs/configure/story-rendering
 */

import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import type { Preview } from '@storybook/react-vite';

/**
 * プレビュー設定
 */
const preview: Preview = {
  // すべてのStoryにデコレーターを適用
  decorators: [
    (Story, context) => {
      // テーマの切り替えをサポート
      const theme = context.globals.theme === 'dark' ? webDarkTheme : webLightTheme;

      return (
        <FluentProvider theme={theme}>
          {/* ストーリーのコンテナスタイル */}
          <div style={{
            padding: '2rem',
            minHeight: '100vh',
            backgroundColor: theme.colorNeutralBackground1
          }}>
            <Story />
          </div>
        </FluentProvider>
      );
    },
  ],

  // グローバルパラメータ
  parameters: {
    // アクションアドオンの設定
    // イベントハンドラー（onClick等）を自動的にActionsパネルに表示
    actions: {
      argTypesRegex: '^on[A-Z].*'
    },

    // コントロールアドオンの設定
    controls: {
      matchers: {
        // color型のプロパティにカラーピッカーを表示
        color: /(background|color)$/i,
        // date型のプロパティに日付ピッカーを表示
        date: /Date$/,
      },
    },

    // ビューポートアドオンの設定
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },

    // ドキュメントの設定
    docs: {
      toc: true, // 目次を表示
    },
  },

  // グローバルツールバー（テーマ切り替えなど）
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Fluent UI theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
