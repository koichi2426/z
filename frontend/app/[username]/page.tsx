import { fetchPostsByUsername } from '@/lib/posts';
import PostList from '@/components/PostList';
import StoreInitializer from '@/components/StoreInitializer';
import type { Post } from '@/lib/data';

type UserPageProps = {
  params: {
    username: string;
  };
};

export default async function UserPage({ params }: UserPageProps) {
  const initialPosts: Post[] = await fetchPostsByUsername(params.username);
  const userName = initialPosts[0]?.user.name ?? params.username;

  return (
    <>
      {/* ユーザーページでも、表示したい初期投稿をストアにセット */}
      <StoreInitializer posts={initialPosts} />
      <h1 className="text-xl font-bold p-4 border-b border-slate-700">{userName}さんの投稿</h1>
      <PostList />
    </>
  );
}