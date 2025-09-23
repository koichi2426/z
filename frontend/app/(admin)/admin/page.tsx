import { fetchAllPosts } from '@/lib/posts';
import AdminReplay from '@/components/AdminReplay';

export default async function AdminPage() {
  // サーバー側で事前に全投稿データを取得します。
  const allPosts = await fetchAllPosts();

  return (
    <div>
      <h1 className="text-2xl font-bold p-4 border-b border-slate-700">
        管理者ダッシュボード
      </h1>
      
      {/* 取得した全投稿データを、インタラクティブなUIを持つ
        AdminReplayコンポーネントにプロパティとして渡します。
      */}
      <AdminReplay allPosts={allPosts} />
    </div>
  );
}