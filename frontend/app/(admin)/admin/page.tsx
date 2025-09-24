'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X } from 'lucide-react';
import mockData from '../../../lib/mock-data.json';
import type { User, Post, PostWithUser } from '@/lib/data';

export default function AdminPage() {
  // --- ステート定義 ---
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);

  // モーダル管理
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPost, setEditingPost] = useState<PostWithUser | null>(null);

  // --- データ取得処理 ---
  useEffect(() => {
    const loadedUsers = mockData.users as User[];
    const rawPosts = mockData.posts as Post[];

    const loadedPosts: PostWithUser[] = rawPosts.map((post: Post) => {
      const foundUser = loadedUsers.find(u => u.id === post.userId);
      const safeUser: User =
        foundUser ?? {
          id: 0,
          username: 'unknown',
          name: 'Unknown',
          email: 'unknown@example.com',
          avatarUrl: '/default-avatar.png',
        };
      return { ...post, user: safeUser };
    });

    setUsers(loadedUsers);
    setPosts(loadedPosts);
  }, []);

  // --- 選択処理 ---
  const handleSelectUser = (id: number) =>
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  const handleSelectAllUsers = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedUserIds(e.target.checked ? users.map(u => u.id) : []);

  const handleSelectPost = (id: number) =>
    setSelectedPostIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  const handleSelectAllPosts = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedPostIds(e.target.checked ? posts.map(p => p.id) : []);

  // --- CRUD処理 (モーダル開閉) ---
  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };
  const handleEditUser = (id: number) => {
    const user = users.find(u => u.id === id) || null;
    setEditingUser(user);
    setIsUserModalOpen(true);
  };
  const handleDeleteUser = (id: number) => {
    if (window.confirm(`ユーザーID: ${id} を本当に削除しますか？`)) {
      setUsers(users.filter(u => u.id !== id));
    }
  };
  const handleDeleteSelectedUsers = () => {
    if (window.confirm(`${selectedUserIds.length}件のユーザーを本当に削除しますか？`)) {
      setUsers(users.filter(u => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
    }
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setIsPostModalOpen(true);
  };
  const handleEditPost = (id: number) => {
    const post = posts.find(p => p.id === id) || null;
    setEditingPost(post);
    setIsPostModalOpen(true);
  };
  const handleDeletePost = (id: number) => {
    if (window.confirm(`投稿ID: ${id} を本当に削除しますか？`)) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };
  const handleDeleteSelectedPosts = () => {
    if (window.confirm(`${selectedPostIds.length}件の投稿を本当に削除しますか？`)) {
      setPosts(posts.filter(p => !selectedPostIds.includes(p.id)));
      setSelectedPostIds([]);
    }
  };

  // --- モーダルフォーム ---
  const UserModal = () =>
    isUserModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">
              {editingUser ? 'ユーザー編集' : '新規ユーザー追加'}
            </h3>
            <button onClick={() => setIsUserModalOpen(false)}>
              <X className="text-gray-400 hover:text-gray-200" />
            </button>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              setIsUserModalOpen(false);
            }}
          >
            <input
              type="text"
              defaultValue={editingUser?.name}
              placeholder="名前"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              defaultValue={editingUser?.username}
              placeholder="ユーザー名"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="email"
              defaultValue={editingUser?.email}
              placeholder="メール"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
            >
              保存
            </button>
          </form>
        </div>
      </div>
    );

  const PostModal = () =>
    isPostModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">
              {editingPost ? '投稿編集' : '新規投稿追加'}
            </h3>
            <button onClick={() => setIsPostModalOpen(false)}>
              <X className="text-gray-400 hover:text-gray-200" />
            </button>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              setIsPostModalOpen(false);
            }}
          >
            <textarea
              defaultValue={editingPost?.content}
              placeholder="投稿内容"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
            >
              保存
            </button>
          </form>
        </div>
      </div>
    );

  // --- UI部分 ---
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="pb-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white">管理者ダッシュボード</h1>
          <p className="mt-2 text-sm text-gray-400">
            ユーザーと投稿データを管理します。
          </p>
        </header>

        {/* --- ユーザー管理 --- */}
        <section className="mt-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-gray-100">ユーザー管理</h2>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3">
              <button
                onClick={handleAddUser}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                新規ユーザー追加
              </button>
              <button
                onClick={handleDeleteSelectedUsers}
                disabled={selectedUserIds.length === 0}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-500"
              >
                <Trash2 className="-ml-1 mr-2 h-5 w-5" />
                選択項目を削除 ({selectedUserIds.length})
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col">
            <div className="shadow overflow-hidden border-b border-gray-700 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-4">
                      <input type="checkbox" onChange={handleSelectAllUsers} />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">アバター</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">名前</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">ユーザー名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">メール</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                      </td>
                      <td className="px-6 py-4">{user.id}</td>
                      <td className="px-6 py-4">
                        <img
                          src={user.avatarUrl || '/default-avatar.png'}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">@{user.username}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEditUser(user.id)} className="text-indigo-400 mr-4">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* --- 投稿管理 --- */}
        <section className="mt-12">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-gray-100">投稿管理</h2>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3">
              <button
                onClick={handleAddPost}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                新規投稿追加
              </button>
              <button
                onClick={handleDeleteSelectedPosts}
                disabled={selectedPostIds.length === 0}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-500"
              >
                <Trash2 className="-ml-1 mr-2 h-5 w-5" />
                選択項目を削除 ({selectedPostIds.length})
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col">
            <div className="shadow overflow-hidden border-b border-gray-700 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-4"><input type="checkbox" onChange={handleSelectAllPosts} /></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">投稿者</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">ユーザー名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">内容</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">投稿日時</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedPostIds.includes(post.id)}
                          onChange={() => handleSelectPost(post.id)}
                        />
                      </td>
                      <td className="px-6 py-4">{post.id}</td>
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <img
                          src={post.user.avatarUrl || '/default-avatar.png'}
                          alt={post.user.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span>{post.user.name}</span>
                      </td>
                      <td className="px-6 py-4">@{post.user.username}</td>
                      <td className="px-6 py-4 max-w-xs truncate" title={post.content}>{post.content}</td>
                      <td className="px-6 py-4">{new Date(post.createdAt).toLocaleString('ja-JP')}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEditPost(post.id)} className="text-indigo-400 mr-4">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeletePost(post.id)} className="text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* モーダル */}
        <UserModal />
        <PostModal />
      </div>
    </div>
  );
}
