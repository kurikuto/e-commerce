/// <reference types="vite/client" />

// 環境変数の型定義
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GRPC_WEB_URL: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_ENABLE_MOCK_DATA: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
