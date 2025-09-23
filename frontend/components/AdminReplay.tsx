'use client';

import { useState, useEffect, useRef } from 'react';
import type { Post } from '@/lib/data';
import { Play, Pause, RefreshCw } from 'lucide-react';

type AdminReplayProps = {
  allPosts: Post[];
};

export default function AdminReplay({ allPosts }: AdminReplayProps) {
  const [startTime, setStartTime] = useState('2025-09-01T12:00');
  const [simulationTime, setSimulationTime] = useState<Date | null>(null);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000 * 60 * 60); // 1 tick = 1 hour

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && simulationTime) {
      intervalRef.current = setInterval(() => {
        setSimulationTime(prevTime => {
          if (!prevTime) return null;
          const newTime = new Date(prevTime.getTime() + speed);
          
          // 現在時刻を超えたら停止
          if (newTime > new Date()) {
            setIsPlaying(false);
            return new Date();
          }
          return newTime;
        });
      }, 50); // 50msごとに更新
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
      setVisiblePosts(newVisiblePosts);
    }
  }, [simulationTime, allPosts]);

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
    setVisiblePosts([]);
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">X 動作リプレイ</h2>
      
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="startTime" className="text-sm text-slate-400">開始日時</label>
            <input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-md p-2 ml-2"
              disabled={isPlaying || simulationTime !== null}
            />
          </div>
          <button onClick={handlePlayPause} className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600">
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button onClick={handleReset} className="bg-slate-600 text-white p-3 rounded-full hover:bg-slate-500">
            <RefreshCw />
          </button>
        </div>

        {/* Status */}
        <div className="h-12 flex items-center">
          <p className="text-lg text-slate-300">
            シミュレーション時刻: 
            <span className="font-mono ml-2 p-2 bg-slate-800 rounded-md">
              {simulationTime ? simulationTime.toLocaleString('ja-JP') : '未開始'}
            </span>
          </p>
        </div>

        {/* Timeline */}
        <div className="border-t border-slate-700 pt-4">
          <h3 className="font-bold mb-2">再現タイムライン ({visiblePosts.length}件)</h3>
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
        </div>
      </div>
    </div>
  );
}