'use client';

export default function SignupForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // ここに実際の新規登録処理を記述します。
    // 今回はUIのみなので、アラートを表示します。
    alert('新規登録処理は未実装です。');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          表示名
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-300">
          ユーザー名
        </label>
        <div className="mt-1">
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300"
        >
          パスワード
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="w-full justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          アカウント作成
        </button>
      </div>
    </form>
  );
}