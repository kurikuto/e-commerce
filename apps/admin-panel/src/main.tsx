/**
 * アプリケーションエントリーポイント
 * 
 * Reactアプリケーションを初期化し、DOMにマウントします。
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

/**
 * React Query クライアント
 * 
 * サーバー状態管理とキャッシングを提供します。
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // データが古くなるまでの時間（5分）
      staleTime: 5 * 60 * 1000,
      // バックグラウンドでの再取得を有効化
      refetchOnWindowFocus: true,
      // エラー時のリトライ設定
      retry: 1,
    },
  },
});

/**
 * ルートコンポーネントをレンダリング
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* React Query Provider */}
    <QueryClientProvider client={queryClient}>
      {/* Fluent UI Provider */}
      <FluentProvider theme={webLightTheme}>
        {/* React Router */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FluentProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
