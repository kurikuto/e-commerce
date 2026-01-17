/**
 * レイアウトコンポーネント
 * 
 * アプリケーション全体のレイアウトを定義します。
 * ナビゲーションバーとコンテンツエリアを含みます。
 */

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Tab,
  TabList,
  Title2,
  Badge,
} from '@fluentui/react-components';
import {
  Box24Regular,
  ShoppingBag24Regular,
  People24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nav: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: `0 ${tokens.spacingHorizontalXXL}`,
  },
  main: {
    flex: 1,
    padding: tokens.spacingHorizontalXXL,
    maxWidth: '1600px',
    width: '100%',
    margin: '0 auto',
  },
});

/**
 * Layoutコンポーネント
 * 
 * 管理画面の共通レイアウトを提供します。
 */
export default function Layout() {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname.split('/')[1] || 'products';

  return (
    <div className={styles.root}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM }}>
          <Title2>E-Commerce 管理画面</Title2>
          <Badge appearance="filled" color="informative">
            Demo
          </Badge>
        </div>
        {/* TODO: ユーザーメニューを追加 */}
      </header>

      {/* ナビゲーション */}
      <nav className={styles.nav}>
        <TabList
          selectedValue={currentTab}
          onTabSelect={(_, data) => navigate(`/${data.value as string}`)}
        >
          <Tab icon={<Box24Regular />} value="products">
            商品管理
          </Tab>
          <Tab icon={<ShoppingBag24Regular />} value="orders" disabled>
            注文管理
          </Tab>
          <Tab icon={<People24Regular />} value="customers" disabled>
            顧客管理
          </Tab>
        </TabList>
      </nav>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
