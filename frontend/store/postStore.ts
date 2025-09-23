import { create } from 'zustand';
import type { Post } from '@/lib/data';

// ストアが持つ状態と、それを更新する関数の型を定義します
type PostStore = {
  posts: Post[];
  setPosts: (newPosts: Post[]) => void;
};

// ストアを作成します
export const usePostStore = create<PostStore>((set) => ({
  // 初期状態として、投稿リストは空の配列とします
  posts: [],
  // postsの状態を更新するためのsetPosts関数を定義します
  setPosts: (newPosts) => set({ posts: newPosts }),
}));