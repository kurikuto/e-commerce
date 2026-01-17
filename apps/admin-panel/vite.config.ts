import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite 6 設定ファイル
 *
 * 高速な開発サーバーとビルドを提供します。
 */
export default defineConfig({
  plugins: [
    react({
      // React 19.2に最適化されたJSXランタイム
      jsxRuntime: 'automatic',
    }),
  ],

  // パスエイリアス
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },

  // 開発サーバー設定
  server: {
    port: 3000,
    proxy: {
      // gRPC-Web通信をEnvoyプロキシに転送
      '/ecommerce.catalog.CatalogService': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },

  // ビルド設定
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext', // 最新のES仕様をターゲット
    // チャンク分割の最適化
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          fluentui: ['@fluentui/react-components', '@fluentui/react-icons'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
