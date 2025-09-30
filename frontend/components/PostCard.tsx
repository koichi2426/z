// PostCardはインタラクティブな部分を分離したので、サーバーコンポーネントのままでOKです
import Link from "next/link";
import Image from "next/image";
import type { ApiPostWithUser } from "@/fetchs/posts"; // ★fetchsから型をインポート
import { VerifyTokenResponse } from "@/fetchs/auth"; // ★追加
import DeletePostButton from "./DeletePostButton"; // ★新しいコンポーネントをインポート

type PostCardProps = {
  post: ApiPostWithUser; // ★型を更新
  user: VerifyTokenResponse | null; // ★追加
  token: string | null; // ★追加
};

export default function PostCard({ post, user, token }: PostCardProps) {
  // ログインしているユーザーが投稿の所有者であるかを判定
  const isOwner = user?.id === post.userId; // ★型に合わせて修正

  return (
    <div className="flex space-x-4 p-4 border-b border-slate-700">
      <Link href={`/${post.user.username}`}>
        <Image
          src={post.user.avatarUrl} // ★型に合わせて修正
          alt={`${post.user.name}のアバター`}
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
      <div className="w-full">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-bold">{post.user.name}</span>
            <span className="text-slate-500">@{post.user.username}</span>
            <span className="text-slate-500">·</span>
            <small className="text-slate-500">
              {new Date(post.createdAt).toLocaleString("ja-JP")} {/* ★型に合わせて修正 */}
            </small>
          </div>
          {/* ★★★ 投稿の所有者であればDeletePostButtonコンポーネントを表示 ★★★ */}
          {isOwner && <DeletePostButton postId={post.id} token={token} />}
        </div>
        <p className="mt-2 text-white">{post.content}</p>
      </div>
    </div>
  );
}

