import { PostWithUser } from '@/lib/data';
import PostCard from './PostCard';

type PostListProps = {
  posts: PostWithUser[];
};

export default function PostList({ posts }: PostListProps) {
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
