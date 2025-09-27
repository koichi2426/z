'use client';

import Image from "next/image";
import { useState } from "react";
import { createPost } from "@/fetchs/posts";

type CreatePostProps = {
  token: string | null;
};

export function CreatePost({ token }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      alert("ログインが必要です");
      return;
    }
    if (!content.trim()) return;

    try {
      setLoading(true);
      await createPost(
        { content }, // ✅ created_at は送らない
        token
      );
      setContent(""); // 成功時にリセット
    } catch (err) {
      console.error("CreatePost failed:", err);
      alert("投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-4 p-4 border-b border-slate-700">
      <Image
        src="https://avatar.vercel.sh/koichi" // TODO: サーバーから受け取った avatar_url を使う
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || !token || loading}
            className="bg-sky-500 text-white font-bold px-6 py-2 rounded-full hover:bg-sky-600 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "送信中..." : "投稿する"}
          </button>
        </div>
      </div>
    </div>
  );
}
