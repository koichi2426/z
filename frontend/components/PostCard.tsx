// PostCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { PostWithUser } from "@/lib/data";

type PostCardProps = {
  post: PostWithUser;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="flex space-x-4 p-4 border-b border-slate-700">
      <Link href={`/${post.user.username}`}>
        <Image
          src={post.user.avatarUrl}
          alt={`${post.user.name}のアバター`}
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
      <div>
        <div className="font-bold">{post.user.name}</div>
        <p>{post.content}</p>
        <small className="text-slate-500">
          {new Date(post.createdAt).toLocaleString()}
        </small>
      </div>
    </div>
  );
}
