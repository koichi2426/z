'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/fetchs/auth';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Cookieからトークンを取得
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (token) {
        // バックエンドのログアウトAPIを呼び出す
        await logout(token);
      }

      // Cookieを削除
      document.cookie = 'auth_token=; path=/; max-age=0;';

      // ログインページにリダイレクト
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('ログアウトに失敗しました。');
    }
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
