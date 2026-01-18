/**
 * Storybook メイン設定ファイル
 *
 * Storybook 10の設定を定義します。
 * - React + Viteの統合
 * - ビルトインアドオンの設定
 * - ビルド最適化
 *
 * Storybook 10では、多くのアドオンがコアに統合されています。
 *
 * @see https://storybook.js.org/docs/configure
 */

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Storyファイルのパターン
  // src配下のすべての .stories.tsx ファイルを対象とする
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  // アドオンの設定
  // Storybook 10では、essentials等は自動的に含まれます
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y', // アクセシビリティチェック
  ],

  // フレームワーク設定
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // TypeScriptの型チェックを有効化
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        // node_modulesのpropsは除外
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules');
        }
        return true;
      },
    },
  },

  // ドキュメント設定
  docs: {},

  // Vite設定のカスタマイズ（必要に応じて）
  viteFinal: async (config) => {
    // 必要に応じてVite設定をカスタマイズ
    return config;
  },
};

export default config;
