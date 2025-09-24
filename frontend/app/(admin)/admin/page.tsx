'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import mockData from '../../../lib/mock-data.json';

// 型定義
type UserType = {
  id: number;
  name: string;
  username: string;
};

type PostType = {
  id: number;
  userId: number;
  authorName: string;
  content: string;
  createdAt: string;
};

export default function AdminPage() {
  // --- ステート定義 ---
  const [users, setUsers] = useState<UserType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);

  // --- データ取得処理 (修正済み) ---
  useEffect(() => {
    // モックデータからユーザー情報をそのままロード
    const loadedUsers: UserType[] = mockData.users;

    // 投稿データに、対応するユーザー名を追加して加工
    const loadedPosts: PostType[] = mockData.posts.map(post => {
      // post.userIdを使ってユーザー配列から投稿者を探す
      const author = loadedUsers.find(user => user.id === post.userId);
      return {
        id: post.id,
        userId: post.userId,
        authorName: author ? author.name : 'Unknown User', // 見つからない場合のフォールバック
        content: post.content,
        createdAt: post.createdAt,
      };
    });

    setUsers(loadedUsers);
    setPosts(loadedPosts);
  }, []);

  // --- イベントハンドラ ---

  // ユーザー選択処理
  const handleSelectUser = (id: number) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAllUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(users.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  // 投稿選択処理
  const handleSelectPost = (id: number) => {
    setSelectedPostIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAllPosts = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPostIds(posts.map(p => p.id));
    } else {
      setSelectedPostIds([]);
    }
  };

  // CRUD処理 (ダミー)
  const handleAddUser = () => {
    // TODO: APIを叩いてユーザーを追加
    console.log('Adding new user...');
  };

  const handleEditUser = (id: number) => {
    // TODO: APIを叩いてユーザーを編集
    console.log(`Editing user ${id}`);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm(`ユーザーID: ${id} を本当に削除しますか？`)) {
        // TODO: APIを叩いてユーザーを削除
        console.log(`Deleting user ${id}`);
        setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleDeleteSelectedUsers = () => {
    if (window.confirm(`${selectedUserIds.length}件のユーザーを本当に削除しますか？`)) {
        // TODO: APIを叩いて選択したユーザーを削除
        console.log(`Deleting users: ${selectedUserIds.join(', ')}`);
        setUsers(users.filter(u => !selectedUserIds.includes(u.id)));
        setSelectedUserIds([]);
    }
  };

  const handleEditPost = (id: number) => {
    // TODO: APIを叩いて投稿を編集
    console.log(`Editing post ${id}`);
  };
  
  const handleDeletePost = (id: number) => {
    if (window.confirm(`投稿ID: ${id} を本当に削除しますか？`)) {
        // TODO: APIを叩いて投稿を削除
        console.log(`Deleting post ${id}`);
        setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleDeleteSelectedPosts = () => {
    if (window.confirm(`${selectedPostIds.length}件の投稿を本当に削除しますか？`)) {
        // TODO: APIを叩いて選択した投稿を削除
        console.log(`Deleting posts: ${selectedPostIds.join(', ')}`);
        setPosts(posts.filter(p => !selectedPostIds.includes(p.id)));
        setSelectedPostIds([]);
    }
  };


  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="pb-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white">管理者ダッシュボード</h1>
          <p className="mt-2 text-sm text-gray-400">ユーザーと投稿データを管理します。</p>
        </header>

        {/* --- ユーザー管理 --- */}
        <section className="mt-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-gray-100">ユーザー管理</h2>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3">
               <button 
                onClick={handleAddUser}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                新規ユーザー追加
              </button>
              <button
                onClick={handleDeleteSelectedUsers}
                disabled={selectedUserIds.length === 0}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
              >
                <Trash2 className="-ml-1 mr-2 h-5 w-5" />
                選択項目を削除 ({selectedUserIds.length})
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-700 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th scope="col" className="p-4">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                            onChange={handleSelectAllUsers}
                            checked={selectedUserIds.length > 0 && selectedUserIds.length === users.length}
                          />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">名前</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ユーザー名</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-700/50">
                          <td className="p-4">
                            <input 
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                              checked={selectedUserIds.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditUser(user.id)} className="text-indigo-400 hover:text-indigo-300 mr-4"><Edit className="h-5 w-5"/></button>
                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400"><Trash2 className="h-5 w-5"/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 投稿管理 --- */}
        <section className="mt-12">
           <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-gray-100">投稿管理</h2>
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <button
                onClick={handleDeleteSelectedPosts}
                disabled={selectedPostIds.length === 0}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
              >
                <Trash2 className="-ml-1 mr-2 h-5 w-5" />
                選択項目を削除 ({selectedPostIds.length})
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-700 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                         <th scope="col" className="p-4">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                            onChange={handleSelectAllPosts}
                            checked={selectedPostIds.length > 0 && selectedPostIds.length === posts.length}
                          />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">投稿者</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">内容</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">投稿日時</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-700/50">
                           <td className="p-4">
                            <input 
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                              checked={selectedPostIds.includes(post.id)}
                              onChange={() => handleSelectPost(post.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{post.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{post.authorName} (ID: {post.userId})</td>
                          <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{post.content}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(post.createdAt).toLocaleString('ja-JP')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditPost(post.id)} className="text-indigo-400 hover:text-indigo-300 mr-4"><Edit className="h-5 w-5"/></button>
                            <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:text-red-400"><Trash2 className="h-5 w-5"/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


