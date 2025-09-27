'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/fetchs/auth';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      setSubmitting(true);

      const res = await login(email, password);

      // Cookie にトークン保存
      document.cookie = `auth_token=${res.token}; path=/;`;

      // ログイン後トップページへ
      router.push('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('ユーザー名またはパスワードが違います。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          メールアドレス
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            required
            className="w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          パスワード
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-sky-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          {submitting ? 'ログイン中…' : 'ログイン'}
        </button>
      </div>
    </form>
  );
}
