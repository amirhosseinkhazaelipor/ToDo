/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" (پیش‌فرض) یا "real" — اتصال به بک‌اند .NET */
  readonly VITE_API_MODE?: "mock" | "real";
  /** آدرس پایه بک‌اند، مثلاً http://localhost:5199/api */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
