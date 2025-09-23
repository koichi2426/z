import Link from 'next/link'; // Linkをインポート
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          zへようこそ
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg bg-black px-4 py-8 shadow sm:px-10">
          <LoginForm />
        </div>

        {/* ↓ ここからが追加部分 */}
        <div className="mt-6 text-center text-sm text-gray-400">
          アカウントをお持ちでないですか？{' '}
          <Link href="/signup" className="font-medium text-sky-400 hover:text-sky-300">
            新規登録
          </Link>
        </div>
        {/* ↑ ここまでが追加部分 */}

      </div>
    </div>
  );
}