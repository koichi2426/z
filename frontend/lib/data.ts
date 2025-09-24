// data.ts

/**
 * ユーザーの型定義
 */
export type User = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
};

/**
 * 投稿の型定義
 */
export type Post = {
  id: number;
  user: User; // ネストされたUserオブジェクト
  content: string;
  createdAt: string;
};