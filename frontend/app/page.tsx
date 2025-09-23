import PostList from '@/components/PostList';
import { fetchAllPosts } from '@/lib/posts';
import { CreatePost } from "@/components/CreatePost"; // Import

export default async function HomePage() {
  const posts = await fetchAllPosts();

  return (
    <>
      <h1 className="text-xl font-bold p-4 border-b border-slate-700 sticky top-0 bg-black/80 backdrop-blur-sm">ホーム</h1>
      <CreatePost /> {/* Add the form */}
      <PostList posts={posts} />
    </>
  );
}