
'use client';

import { useState } from 'react';
// import { login, LoginResponse } from '@/fetchs/auth';
// import { createPost, deletePost, fetchPostsByUsername } from '@/fetchs/posts';

import mockAccountsPostsJson from '@/lib/mock-accounts-posts.json';


type Account = typeof mockAccountsPostsJson[number];

export default function CheatPage() {
  const [results, setResults] = useState<(string | null)[]>([null, null, null]);
  const [tokens, setTokens] = useState<(string | null)[]>([null, null, null]);
  const [loading, setLoading] = useState(false);

  // 一斉ログイン（直接API）
  const handleLoginAll = async () => {
    setLoading(true);
    const promises = mockAccountsPostsJson.map(async (acc) => {
      try {
  const res = await fetch('http://176.34.25.68:8000/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: acc.email, password: acc.password }),
        });
        if (!res.ok) throw new Error('Login failed: ' + res.status);
        const data = await res.json();
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return 'エラー: ' + String(e);
      }
    });
    const resArr = await Promise.all(promises);
    setResults(resArr);

    // トークンも保存
    const tokenArr = await Promise.all(
      mockAccountsPostsJson.map(async (acc) => {
        try {
          const res = await fetch('http://176.34.25.68:8000/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: acc.email, password: acc.password }),
          });
          
          if (!res.ok) throw new Error('Login failed: ' + res.status);
          const data = await res.json();
          return data.token;
        } catch {
          return null;
        }
      })
    );
    setTokens(tokenArr);
    setLoading(false);
  };

  // 個別一斉投稿（直接API）
  const handlePostRound = async (round: number) => {
    setLoading(true);
    const promises = mockAccountsPostsJson.map(async (acc, idx) => {
      const token = tokens[idx];
      if (!token) return `未ログイン(${round + 1}回目)`;
      const postsForRound = acc.posts?.[round] || [];
      if (postsForRound.length === 0) return `投稿なし(${round + 1}回目)`;
      try {
        const results = [];
        for (const post of postsForRound) {
          const res = await fetch('http://176.34.25.68:8000/v1/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: post.content }),
          });
          if (!res.ok) throw new Error('Post failed: ' + res.status);
          const data = await res.json();
          results.push(JSON.stringify(data, null, 2));
        }
        return results.join('\n---\n');
      } catch (e) {
        return `エラー(${round + 1}回目): ` + String(e);
      }
    });
    const resArr = await Promise.all(promises);
    setResults(resArr);
    setLoading(false);
  };

  // 一斉投稿全削除（直接API）
  const handleDeleteAllPosts = async () => {
    setLoading(true);
    const promises = mockAccountsPostsJson.map(async (acc, idx) => {
      const token = tokens[idx];
      if (!token) return '未ログイン';
      try {
        // APIからユーザーごとの投稿を取得
  const res = await fetch(`http://176.34.25.68:8000/v1/posts/username/${acc.username}`);
        if (!res.ok) throw new Error('Fetch posts failed: ' + res.status);
        const posts = (await res.json()).posts;
        if (!posts || posts.length === 0) return '投稿なし';
        // 取得した投稿IDで全削除
        for (const post of posts) {
          const delRes = await fetch(`http://176.34.25.68:8000/v1/posts/${post.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!delRes.ok) throw new Error('Delete failed: ' + delRes.status);
        }
        return '全投稿削除完了';
      } catch (e) {
        return 'エラー: ' + String(e);
      }
    });
    const resArr = await Promise.all(promises);
    setResults(resArr);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-black rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-white">複数アカウント一斉操作</h2>
      <div className="space-y-4 mb-6">
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleLoginAll}
          disabled={loading}
        >
          3アカウントで一斉ログイン
        </button>
        <button
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => handlePostRound(0)}
          disabled={loading}
        >
          1回目の一斉投稿
        </button>
        <button
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => handlePostRound(1)}
          disabled={loading}
        >
          2回目の一斉投稿
        </button>
        <button
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => handlePostRound(2)}
          disabled={loading}
        >
          3回目の一斉投稿
        </button>
        <button
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={handleDeleteAllPosts}
          disabled={loading}
        >
          3アカウントの投稿全削除
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {mockAccountsPostsJson.map((acc, idx) => (
          <div key={acc.username} className="bg-gray-900 p-4 rounded">
            <div className="font-bold text-white mb-2">{acc.label}</div>
            <pre className="text-green-400 text-xs overflow-x-auto">
              {results[idx] || '未実行'}
            </pre>
          </div>
        ))}
      </div>
      {/* モックデータ表示領域 */}
      <div className="mt-10 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-2">モックデータ（アカウント＋投稿）</h3>
        <pre className="text-xs text-gray-200 overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(mockAccountsPostsJson, null, 2)}
        </pre>
      </div>
    </div>
  );
}
