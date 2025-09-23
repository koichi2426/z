'use client';

import { useRef } from 'react';
import { usePostStore } from '@/store/postStore';
import type { Post } from '@/lib/data';

type StoreInitializerProps = {
  posts: Post[];
};

export default function StoreInitializer({ posts }: StoreInitializerProps) {
  const initialized = useRef(false);
  // このコンポーネントが初回レンダリングされるときに一度だけ実行
  if (!initialized.current) {
    // Zustandストアの初期状態を、サーバーから渡されたpostsで設定
    usePostStore.setState({ posts });
    initialized.current = true;
  }
  // このコンポーネント自体は何も表示しない
  return null;
}