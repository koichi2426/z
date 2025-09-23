'use client'; // Client Componentに変更

import PostCard from './PostCard';
import { usePostStore } from '@/store/postStore'; // ストアをインポート

// propsを受け取らなくなります
export default function PostList() {
  // グローバルストアから投稿リストの状態を読み取る
  const posts = usePostStore((state) => state.posts);

  // 投稿を新しい順にソート
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (posts.length === 0) {
    return <p className="p-4 text-center text-slate-500">投稿がありません。</p>;
  }
  
  return (
    <div>
      {sortedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}