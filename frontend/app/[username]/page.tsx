import PostList from '@/components/PostList';
import { fetchPostsByUsername } from '@/fetchs/posts';
import type { PostWithUser } from '@/lib/data';

type UserPageProps = {
  params: {
    username: string;
  };
};

export default async function UserPage({ params }: UserPageProps) {
  const { username } = params;

  // username から投稿を取得
  const posts: PostWithUser[] = await fetchPostsByUsername(username);

  const userName = posts[0]?.user.name ?? username;

  return (
    <>
      <h1 className="text-xl font-bold p-4 border-b border-slate-700">
        {userName}さんの投稿
      </h1>
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="p-4 text-slate-500">まだ投稿がありません。</p>
      )}
    </>
  );
}
