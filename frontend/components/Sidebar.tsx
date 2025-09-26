import Link from 'next/link';
import { Home, User, LogIn, Shield, LogOut } from 'lucide-react';
// パスを絶対パスエイリアスに変更
import LogoutButton from '@/components/LogoutButton'; 

// サーバーサイドでセッションを確認する関数のダミー
// 実際には認証ライブラリやCookieの検証処理を行う
const isLoggedIn = async () => {
  // ここではデモ用に「ログイン済み」とみなす
  return true; 
};

export default async function Sidebar() {
  const signedIn = await isLoggedIn();

  const navItems = [
    { href: '/', label: 'ホーム', icon: Home, show: true },
    // ログインしている時だけプロフィールを表示
    { href: '/koichi', label: 'プロフィール', icon: User, show: signedIn }, 
    // ログインしている時だけ管理を表示
    { href: '/admin', label: '管理', icon: Shield, show: signedIn }, 
    // ログインしていない時だけログインを表示
    { href: '/login', label: 'ログイン', icon: LogIn, show: !signedIn }, 
  ];

  return (
    <header className="flex flex-col justify-between p-4 w-64 h-screen border-r border-slate-700">
      <div>
        <div className="text-2xl font-bold mb-8">z</div>
        <nav>
          <ul>
            {navItems.map((item) => (
              item.show && ( // showがtrueの項目のみ表示
                <li key={item.label}>
                  <Link href={item.href} className="flex items-center space-x-4 py-3 px-4 rounded-full hover:bg-slate-900 transition-colors duration-200">
                    <item.icon size={24} />
                    <span className="text-xl">{item.label}</span>
                  </Link>
                </li>
              )
            ))}
          </ul>
        </nav>
      </div>
      {/* ログインしている場合にログアウトボタンを表示 */}
      {signedIn && (
        <div className="mb-4">
          <LogoutButton />
        </div>
      )}
    </header>
  );
}

