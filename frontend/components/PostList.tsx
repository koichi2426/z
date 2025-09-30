import { ApiPostWithUser } from "@/fetchs/posts"; // ★fetchs/postsから型をインポート
import { VerifyTokenResponse } from "@/fetchs/auth"; // ★追加
import PostCard from "./PostCard";

type PostListProps = {
  posts: ApiPostWithUser[]; // ★型を更新
  user: VerifyTokenResponse | null; // ★追加
  token: string | null; // ★追加
};

export default function PostList({ posts, user, token }: PostListProps) {
  // 元の配列に影響を与えないようにコピーを作成してからソートします
  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

  return (
    <div>
      {/* ★修正点: userとtokenをPostCardに渡す */}
      {sortedPosts.map((post) => (
        <PostCard key={post.id} post={post} user={user} token={token} />
      ))}
    </div>
  );
}

