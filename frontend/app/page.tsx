import { fetchAllPosts } from '@/lib/posts';
import PostList from '@/components/PostList';
import { CreatePost } from "@/components/CreatePost";
import StoreInitializer from '@/components/StoreInitializer';

export default async function HomePage() {
  // サーバーで初期投稿データを取得
  const initialPosts = await fetchAllPosts();
  
  return (
    <>
      {/* 取得した初期データをストアにセット */}
      <StoreInitializer posts={initialPosts} />
      <h1 className="text-xl font-bold p-4 border-b border-slate-700 sticky top-0 bg-black/80 backdrop-blur-sm">ホーム</h1>
      <CreatePost />
      {/* propsなしでPostListを呼び出す */}
      <PostList />
    </>
  );
}