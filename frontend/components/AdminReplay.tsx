'use client';

import { useState, useEffect, useRef } from 'react';
import type { Post } from '@/lib/data';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { usePostStore } from '@/store/postStore'; // Zustandストアをインポート

type AdminReplayProps = {
  allPosts: Post[];
};

export default function AdminReplay({ allPosts }: AdminReplayProps) {
  // ... startTime, simulationTime, isPlaying, speed のuseStateはそのまま ...
  const [startTime, setStartTime] = useState('2025-09-01T12:00');
  const [simulationTime, setSimulationTime] = useState<Date | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000 * 60 * 60);

  // visiblePostsのuseStateは削除
  // const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);

  // Zustandストアから、状態を更新する関数を取得
  const { posts: visiblePosts, setPosts } = usePostStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && simulationTime) {
      intervalRef.current = setInterval(() => {
        setSimulationTime(prevTime => {
          if (!prevTime) return null;
          const newTime = new Date(prevTime.getTime() + speed);
          if (newTime > new Date()) {
            setIsPlaying(false);
            return new Date();
          }
          return newTime;
        });
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, simulationTime]);

  useEffect(() => {
    if (simulationTime) {
      const newVisiblePosts = allPosts.filter(
        post => new Date(post.createdAt) <= simulationTime
      );
      // グローバルストアの状態を更新
      setPosts(newVisiblePosts);
    }
  }, [simulationTime, allPosts, setPosts]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      if (!simulationTime) {
        setSimulationTime(new Date(startTime));
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSimulationTime(null);
    // グローバルストアの状態をリセット
    setPosts([]);
  };

  return (
    // JSXの部分は変更なし
    <div className="p-8">
      {/* ... 省略 ... */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {visiblePosts.length > 0 ? (
          [...visiblePosts].reverse().map(post => (
            <div key={post.id} className="bg-slate-800 p-3 rounded-md text-sm">
              <span className="text-slate-400 mr-2">{new Date(post.createdAt).toLocaleTimeString('ja-JP')}</span>
              <span className="font-bold text-sky-400">@{post.user.username}:</span>
              <span className="ml-2">{post.content}</span>
            </div>
          ))
        ) : (
          <p className="text-slate-500">再生ボタンを押して開始してください。</p>
        )}
      </div>
      {/* ... 省略 ... */}
    </div>
  );
}