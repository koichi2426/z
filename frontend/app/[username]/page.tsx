import PostList from "@/components/PostList";
import { fetchPostsByUsername, ApiPostWithUser } from "@/fetchs/posts"; // fetchsから型をインポート
import { cookies } from "next/headers"; // ★追加
import { verifyToken, VerifyTokenResponse } from "@/fetchs/auth"; // ★追加

type UserPageProps = {
  params: {
    username: string;
  };
};

export default async function UserPage({ params }: UserPageProps) {
  const { username } = params;

  // usernameから投稿を取得
  const posts: ApiPostWithUser[] = await fetchPostsByUsername(username);

  const userName = posts[0]?.user.name ?? username;

  // --- ▼▼▼ ここからが修正部分 ▼▼▼ ---

  // ホームページと同様に、cookieから現在のユーザー情報を取得します
  const cookieStore = await cookies(); // ★修正点: awaitを追加
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

  // --- ▲▲▲ ここまでが修正部分 ▲▲▲ ---

  return (
    <>
      <h1 className="text-xl font-bold p-4 border-b border-slate-700">
        {userName}さんの投稿
      </h1>
      {posts.length > 0 ? (
        // ★★★ PostListに 'user' と 'token' を渡す ★★★
        <PostList posts={posts} user={user} token={token} />
      ) : (
        <p className="p-4 text-slate-500">まだ投稿がありません。</p>
      )}
    </>
  );
}
