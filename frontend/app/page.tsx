import PostList from "@/components/PostList";
import { fetchAllPosts } from "@/fetchs/posts";
import { CreatePost } from "@/components/CreatePost";
import { cookies } from "next/headers";
import { verifyToken, VerifyTokenResponse } from "@/fetchs/auth";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || null;

  let user: VerifyTokenResponse | null = null;

  if (token) {
    try {
      const res = await verifyToken(token);
      if (res && res.id) {
        user = res;
      }
    } catch {
      user = null; // 認証失敗はゲスト扱い
    }
  }

  const posts = await fetchAllPosts();

  return (
    <>
      <h1 className="text-xl font-bold p-4 border-b border-slate-700 sticky top-0 bg-black/80 backdrop-blur-sm">
        ホーム
      </h1>
      {/* token と user を渡す */}
      <CreatePost token={token} user={user} />
      <PostList posts={posts} />
    </>
  );
}
