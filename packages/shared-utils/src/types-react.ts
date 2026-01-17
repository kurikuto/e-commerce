/**
 * React 用ユーティリティ型
 */

import { ComponentType, ReactNode } from 'react';

/**
 * コンポーネントのprops型を抽出
 */
export type PropsOf<T> = T extends ComponentType<infer P> ? P : never;

/**
 * Children propを持つ型
 */
export interface WithChildren {
  children: ReactNode;
}

/**
 * ClassName propを持つ型
 */
export interface WithClassName {
  className?: string;
}

/**
 * TestId propを持つ型（テスト用）
 */
export interface WithTestId {
  'data-testid'?: string;
}

/**
 * 基本的なコンポーネントprops
 */
export type BaseComponentProps = WithClassName & WithTestId;

/**
 * Async状態を持つ型
 */
export interface AsyncState<T, E = Error> {
  data?: T;
  error?: E;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * フォーム状態
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * レイアウトprops
 */
export interface LayoutProps extends BaseComponentProps {
  children: ReactNode;
}

/**
 * オプション型（Selectなどで使用）
 */
export interface Option<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
