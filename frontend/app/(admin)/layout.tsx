import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

// 1. 関数に 'async' を追加
export default async function AdminLayout({ children }: { children: ReactNode }) {
  // 2. cookies() の呼び出しの前に 'await' を追加
  const cookieStore = await cookies();
  
  // これで cookieStore は実際のCookieオブジェクトになり、.get() が使える
  const isAdminCookie = cookieStore.get('isAdmin');

  if (isAdminCookie?.value !== 'true') {
    redirect('/login');
  }

  return <>{children}</>;
}