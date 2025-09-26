'use client';

import Image from "next/image";

export function CreatePost() {
  return (
    <div className="flex space-x-4 p-4 border-b border-slate-700">
      <Image
        src="https://avatar.vercel.sh/koichi" // Logged-in user's avatar
        alt="あなたのアバター"
        width={48}
        height={48}
        className="rounded-full w-12 h-12"
      />
      <div className="flex-1 space-y-4">
        <textarea
          placeholder="いまどうしてる？"
          className="w-full bg-transparent text-xl placeholder-slate-500 focus:outline-none resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <button className="bg-sky-500 text-white font-bold px-6 py-2 rounded-full hover:bg-sky-600 transition-colors duration-200 disabled:opacity-50">
            投稿する
          </button>
        </div>
      </div>
    </div>
  );
}