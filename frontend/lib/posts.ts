import { promises as fs } from 'fs';
import path from 'path';
// data.tsから型定義をインポート
import type { User, Post } from './data';

// --- JSONから読み込むデータ用の内部的な型定義 ---
type UserWithPassword = User & { password?: string };
type RawPost = { id: number; username: string; content: string; createdAt: string; };

// JSONファイルからデータを読み込むヘルパー関数
async function loadData() {
  const filePath = path.join(process.cwd(), 'lib/mock-data.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData) as { users: UserWithPassword[], posts: RawPost[] };
}

// 全ての投稿を取得する関数
export const fetchAllPosts = async (): Promise<Post[]> => {
  const { users, posts } = await loadData();
  
  // 投稿にユーザー情報を結合
  const populatedPosts = posts.map((post) => {
    const foundUser = users.find((user) => user.username === post.username);
    const userForPost: User = foundUser 
      ? { username: foundUser.username, name: foundUser.name, avatarUrl: foundUser.avatarUrl }
      : { username: 'unknown', name: 'Unknown User', avatarUrl: '' };

    return { ...post, user: userForPost };
  });

  return populatedPosts.sort((a, b) => a.id < b.id ? 1 : -1);
};

// 特定のユーザーの投稿を取得する関数
export const fetchPostsByUsername = async (username: string): Promise<Post[]> => {
  const allPosts = await fetchAllPosts();
  return allPosts.filter(post => post.user.username === username);
};