/**
 * ページヘッダーコンポーネント
 *
 * 各ページの上部に表示するヘッダーです。
 * タイトル、説明、アクションボタンなどを配置できます。
 */

import { ReactNode } from 'react';
import { makeStyles, tokens, Title3, Body1 } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalXXL,
    paddingBottom: tokens.spacingVerticalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  description: {
    color: tokens.colorNeutralForeground2,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export interface PageHeaderProps {
  /** ページタイトル */
  title: string;
  /** ページの説明（オプショナル） */
  description?: string;
  /** ヘッダー右側に表示するアクションボタンなど */
  actions?: ReactNode;
  /** 追加のコンテンツ（フィルターなど） */
  children?: ReactNode;
}

/**
 * PageHeader コンポーネント
 *
 * ページの上部に表示するヘッダーセクションです。
 * 一貫したレイアウトとスタイルを提供します。
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="商品管理"
 *   description="商品の一覧表示と編集を行います"
 *   actions={<Button>新規作成</Button>}
 * >
 *   <SearchBox placeholder="商品を検索..." />
 * </PageHeader>
 * ```
 */
export function PageHeader({ title, description, actions, children }: PageHeaderProps) {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Title3>{title}</Title3>
          {description && <Body1 className={styles.description}>{description}</Body1>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
