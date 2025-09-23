import PostList from '@/components/PostList';
// インポート元を lib/data から lib/posts に変更
import { fetchPostsByUsername } from '@/lib/posts';
import type { Post } from '@/lib/data';

type UserPageProps = {
  params: {
    username: string;
  };
};

export default async function UserPage({ params }: UserPageProps) {
  const posts: Post[] = await fetchPostsByUsername(params.username);
  const userName = posts[0]?.user.name ?? params.username;

  return (
    <>
      <h1 className="text-xl font-bold p-4 border-b border-slate-700">{userName}さんの投稿</h1>
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="p-4 text-slate-500">まだ投稿がありません。</p>
      )}
    </>
  );
}