'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/fetchs/auth';

type Props = {
  token: string;
};

export default function LogoutButton({ token }: Props) {
  const router = useRouter();

  // トークン確認用ログ
  console.log('LogoutButton::received token =', token);

  const handleLogout = async () => {
    try {
      console.log('LogoutButton::logout start with token =', token);

      await logout(token);

      // Cookie削除 (クライアント側)
      document.cookie = 'auth_token=; path=/; max-age=0;';

      // ログイン後トップページへ (リロード付き)
      window.location.href = '/';

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
