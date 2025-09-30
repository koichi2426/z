import { PostWithUser } from '@/lib/data';
import PostCard from './PostCard';

type PostListProps = {
  posts: PostWithUser[];
};

export default function PostList({ posts }: PostListProps) {
  // 元の配列に影響を与えないようにコピーを作成してからソートします
  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

  return (
    <div>
      {/* ソート済みの配列を使って投稿を表示します */}
      {sortedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
