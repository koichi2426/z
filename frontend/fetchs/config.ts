// frontend/fetchs/config.ts

// SSR (Node.js 側) か CSR (ブラウザ側) かを判定
const isServer = typeof window === "undefined";

// SSR では Docker ネットワーク内のサービス名を使う
// CSR ではユーザーのブラウザからアクセスするので localhost を使う
export const API_URL = isServer
  ? process.env.API_URL_INTERNAL || "http://z-backend:8000"
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
