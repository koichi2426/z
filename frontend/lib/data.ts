/**
 * ユーザーの型定義
 */
export type User = {
  id: number;
  username: string;
  name: string;
  email: string; // emailを追加
  avatarUrl: string;
  password?: string; // パスワードはオプショナル（APIで返却しない想定）
};

/**
 * 投稿の元データの型定義 (mock-data.jsonに準拠)
 */
export type Post = {
  id: number;
  userId: number; // ユーザーオブジェクトではなく、userIdを持つ
  content: string;
  createdAt: string;
};

/**
 * ユーザー情報を結合した投稿の型
 */
export type PostWithUser = Post & {
  user: User;
};
