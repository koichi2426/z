'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // 本来はここでバックエンドのログアウトAPIを呼び出します。
    // 例: await fetch('/api/auth/logout', { method: 'POST' });
    console.log('Logging out...');

    // クライアント側の認証情報（例: state）をクリアし、
    // ログインページにリダイレクトします。
    // CookieがHttpOnly属性で管理されている場合、サーバー側でクリアされれば
    // クライアントでの特別な処理は不要です。
    
    // ログインページへ遷移
    router.push('/login');
    // 状態を完全にリセットするためにページをリロードするのも有効です
    // router.refresh(); 
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-full p-3 space-x-4 text-lg font-bold text-left text-red-500 rounded-full hover:bg-red-500/10 transition-colors duration-200"
    >
      <LogOut />
      <span>ログアウト</span>
    </button>
  );
}
