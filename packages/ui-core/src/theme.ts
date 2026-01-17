/**
 * テーマ設定
 *
 * Fluent UI のテーマをカスタマイズします。
 * プロジェクト全体で一貫したデザインを提供します。
 */

import {
  createLightTheme,
  createDarkTheme,
  BrandVariants,
  Theme,
} from '@fluentui/react-components';

/**
 * ブランドカラー定義
 *
 * E-Commerceプラットフォームのブランドアイデンティティを表現する
 * カラーパレットです。
 */
const brandColors: BrandVariants = {
  10: '#020305',
  20: '#111723',
  30: '#16263D',
  40: '#193253',
  50: '#1B3F6A',
  60: '#1B4C82',
  70: '#18599B',
  80: '#1267B4',
  90: '#3174C2',
  100: '#4F82C8',
  110: '#6790CF',
  120: '#7D9ED5',
  130: '#92ACDC',
  140: '#A6BAE2',
  150: '#BAC9E9',
  160: '#CDD8EF',
};

/**
 * ライトテーマ
 */
export const lightTheme: Theme = createLightTheme(brandColors);

/**
 * ダークテーマ
 */
export const darkTheme: Theme = createDarkTheme(brandColors);

/**
 * テーマ選択のためのユーティリティ型
 */
export type ThemeMode = 'light' | 'dark';

/**
 * テーマを取得する関数
 */
export function getTheme(mode: ThemeMode): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
