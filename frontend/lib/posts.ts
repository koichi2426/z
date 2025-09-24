import { promises as fs } from 'fs';
import path from 'path';
// data.tsから型定義をインポート
import type { User, Post } from './data';

// --- JSONから読み込むデータ用の内部的な型定義 ---
// UserWithPasswordはUser型を継承するため、idも含まれる
type UserWithPassword = User & { password?: string };
// JSONファイル内のpostオブジェクトの型。ユーザー情報はusernameで持つ
type RawPost = { id: number; username: string; content: string; createdAt: string; };

// JSONファイルからデータを読み込むヘルパー関数
async function loadData() {
  const filePath = path.join(process.cwd(), 'lib/mock-data.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  // 読み込んだデータが内部的な型と一致すると仮定
  return JSON.parse(jsonData) as { users: UserWithPassword[], posts: RawPost[] };
}

// 全ての投稿を取得する関数
export const fetchAllPosts = async (): Promise<Post[]> => {
  const { users, posts } = await loadData();
  
  // 投稿にユーザー情報を結合
  const populatedPosts = posts.map((post) => {
    const foundUser = users.find((user) => user.username === post.username);
    
    // User型に準拠するようにユーザーオブジェクトを定義
    const userForPost: User = foundUser 
      ? { 
          id: foundUser.id, // 修正: user.id を含める
          username: foundUser.username, 
          name: foundUser.name, 
          avatarUrl: foundUser.avatarUrl 
        }
      : { 
          id: 0, // 修正: 不明ユーザーにもプレースホルダーIDを設定
          username: 'unknown', 
          name: 'Unknown User', 
          avatarUrl: '' 
        };

    // 元の投稿情報と、作成したuserオブジェクトをマージ
    return { ...post, user: userForPost };
  });

  // createdAtで昇順（古い順）に並べ替え
  return populatedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 特定のユーザーの投稿を取得する関数
export const fetchPostsByUsername = async (username: string): Promise<Post[]> => {
  const allPosts = await fetchAllPosts();
  // ユーザーページでは新しい順にしたいので、ここで降順に並べ替え
  return allPosts
    .filter(post => post.user.username === username)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};