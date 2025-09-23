// ユーザーの型定義
export type User = {
    username: string;
    name: string;
    avatarUrl: string;
  };
  
  // 投稿の型定義
  export type Post = {
    id: number;
    user: User; // User型を参照
    content: string;
    createdAt: string;
  };