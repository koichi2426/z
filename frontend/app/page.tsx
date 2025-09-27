import PostList from '@/components/PostList';
import { fetchAllPosts } from '@/fetchs/posts';
import { CreatePost } from "@/components/CreatePost";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || null;

  const posts = await fetchAllPosts();

  return (
    <>
      <h1 className="text-xl font-bold p-4 border-b border-slate-700 sticky top-0 bg-black/80 backdrop-blur-sm">
        ホーム
      </h1>
      {/* 認証不要なので token だけ渡す */}
      <CreatePost token={token} />
      <PostList posts={posts} />
    </>
  );
}
