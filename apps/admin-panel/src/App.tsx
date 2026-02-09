/**
 * アプリケーションのルートコンポーネント
 *
 * ルーティング設定とレイアウトを定義します。
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { makeStyles, tokens } from '@fluentui/react-components';
import { ErrorBoundary } from '@ecommerce/ui-core';
import Layout from '@components/Layout';
import ProductListPage from '@pages/ProductListPage';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground3,
  },
});

/**
 * Appコンポーネント
 *
 * アプリケーションのエントリーポイントです。
 * ルーティングとエラーハンドリングを設定します。
 */
function App() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <ErrorBoundary>
        <Routes>
          {/* レイアウト付きのルート */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<ProductListPage />} />

            {/* TODO: 他のページを追加 */}
            {/* <Route path="orders" element={<OrderListPage />} /> */}
            {/* <Route path="customers" element={<CustomerListPage />} /> */}
          </Route>

          {/* 404ページ */}
          <Route path="*" element={<div>404 - ページが見つかりません</div>} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
