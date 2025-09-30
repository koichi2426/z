"use client"; // useRouterやonClickなど、クライアント側の機能を使うため

import { useRouter } from "next/navigation";
import { deletePost } from "@/fetchs/posts";

type DeletePostButtonProps = {
  postId: number;
  token: string | null;
};

export default function DeletePostButton({
  postId,
  token,
}: DeletePostButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!token) {
      alert("ログインが必要です。");
      return;
    }
    if (!confirm("本当にこの投稿を削除しますか？")) {
      return;
    }

    try {
      await deletePost(postId, token);
      alert("投稿を削除しました。");
      router.refresh(); // ページを再読み込みして投稿リストを更新
    } catch (error) {
      console.error("削除に失敗しました:", error);
      alert("投稿の削除に失敗しました。");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-slate-500 hover:text-red-500 p-1 rounded-full"
      aria-label="投稿を削除"
    >
      削除
    </button>
  );
}
