import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/data';
import { MessageCircle, Repeat, Heart, BarChart2 } from 'lucide-react';

type PostCardProps = {
  post: Post;
};

const PostActions = () => (
  <div className="flex justify-between mt-4 text-slate-500">
    <button className="flex items-center space-x-2 hover:text-sky-500 group">
      <MessageCircle size={18} className="group-hover:bg-sky-500/10 rounded-full p-1" />
      <span>123</span>
    </button>
    <button className="flex items-center space-x-2 hover:text-green-500 group">
      <Repeat size={18} className="group-hover:bg-green-500/10 rounded-full p-1" />
      <span>45</span>
    </button>
    <button className="flex items-center space-x-2 hover:text-pink-500 group">
      <Heart size={18} className="group-hover:bg-pink-500/10 rounded-full p-1" />
      <span>678</span>
    </button>
    <button className="flex items-center space-x-2 hover:text-sky-500 group">
      <BarChart2 size={18} className="group-hover:bg-sky-500/10 rounded-full p-1" />
      <span>9.1K</span>
    </button>
  </div>
);

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="flex space-x-4 p-4 border-b border-slate-700">
      <Link href={`/${post.user.username}`}>
        <Image
          src={post.user.avatarUrl}
          alt={`${post.user.name}のアバター`}
          width={48}
          height={48}
          className="rounded-full w-12 h-12"
        />
      </Link>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Link href={`/${post.user.username}`} className="font-bold hover:underline">
            {post.user.name}
          </Link>
          <span className="text-sm text-slate-500">@{post.user.username}</span>
          <span className="text-sm text-slate-500">·</span>
          <span className="text-sm text-slate-500">{post.createdAt}</span>
        </div>
        <p className="mt-1 whitespace-pre-wrap">{post.content}</p>
        <PostActions />
      </div>
    </div>
  );
}