import { Users, FileText, BarChart2 } from 'lucide-react';

const AdminCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
    <div className="flex items-center space-x-4">
      <div className="bg-sky-500/20 text-sky-400 p-3 rounded-full">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold p-4 border-b border-slate-700">
        管理者ダッシュボード
      </h1>
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard title="総ユーザー数" value="1,234" icon={Users} />
        <AdminCard title="総投稿数" value="5,678" icon={FileText} />
        <AdminCard title="アナリティクス" value="詳細を見る" icon={BarChart2} />
      </div>
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">最近のアクティビティ</h2>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400">ユーザー &apos;gemini&apos; が新しい投稿をしました。</p>
        </div>
      </div>
    </div>
  );
}