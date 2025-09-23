'use client';

import { useState, useEffect, useRef } from 'react';
import type { Post } from '@/lib/data';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { usePostStore } from '@/store/postStore';

type AdminReplayProps = {
  allPosts: Post[];
};

const speedOptions = [
  { multiplier: 1, label: '1時間/tick (標準)' },
  { multiplier: 6, label: '6時間/tick' },
  { multiplier: 12, label: '12時間/tick' },
  { multiplier: 24, label: '1日/tick (最速)' },
];

export default function AdminReplay({ allPosts }: AdminReplayProps) {
  const [startTime, setStartTime] = useState('2025-09-01T12:00');
  const [simulationTime, setSimulationTime] = useState<Date | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 速度をインデックスで管理
  const [speedIndex, setSpeedIndex] = useState(0); 
  const speed = 1000 * 60 * 60 * speedOptions[speedIndex].multiplier; // 1 tickあたりのミリ秒

  const { posts: visiblePosts, setPosts } = usePostStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 再生/停止のロジック
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
      }, 50); // 50msごとに画面を更新
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, simulationTime]);

  // シミュレーション時刻に応じて表示する投稿を更新
  useEffect(() => {
    if (simulationTime) {
      const newVisiblePosts = allPosts.filter(
        post => new Date(post.createdAt) <= simulationTime
      );
      setPosts(newVisiblePosts);
    }
  }, [simulationTime, allPosts, setPosts]);
  
  // 再生ボタンが押されたときの処理
  const handlePlayPause = () => {
    // 停止中に再生ボタンが押されたら
    if (!isPlaying) {
      // シミュレーションが未開始の場合、設定された開始時刻で初期化
      if (!simulationTime) {
        setSimulationTime(new Date(startTime));
      }
      setIsPlaying(true);
    } else {
      // 再生中にボタンが押されたら停止
      setIsPlaying(false);
    }
  };

  // リセットボタンが押されたときの処理
  const handleReset = () => {
    setIsPlaying(false);
    setSimulationTime(null);
    setPosts([]);
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">X 動作リプレイ</h2>
      
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-6">
        {/* 操作パネル */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div>
            <label htmlFor="startTime" className="block text-sm text-slate-400 mb-1">開始日時</label>
            <input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-md p-2 w-full md:w-auto"
              // 再生開始後は変更不可
              disabled={simulationTime !== null}
            />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handlePlayPause} className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600">
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={handleReset} className="bg-slate-600 text-white p-3 rounded-full hover:bg-slate-500">
              <RefreshCw />
            </button>
          </div>
        </div>

        {/* 再生速度スライダー */}
        <div>
          <label htmlFor="speed" className="block text-sm text-slate-400 mb-2">
            再生速度: <span className="font-bold text-sky-400">{speedOptions[speedIndex].label}</span>
          </label>
          <input
            id="speed"
            type="range"
            min="0"
            max={speedOptions.length - 1}
            step="1"
            value={speedIndex}
            onChange={e => setSpeedIndex(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* 状態表示 */}
        <div className="h-12 flex items-center bg-slate-800 rounded-md px-4">
          <p className="text-lg text-slate-300">
            シミュレーション時刻: 
            <span className="font-mono ml-2 p-1 text-lime-400">
              {simulationTime ? simulationTime.toLocaleString('ja-JP') : '■ ■ ■ 停止中 ■ ■ ■'}
            </span>
          </p>
        </div>

        {/* タイムライン */}
        <div className="border-t border-slate-700 pt-4">
          <h3 className="font-bold mb-2">再現タイムライン ({visiblePosts.length}件)</h3>
          <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {visiblePosts.length > 0 ? (
              [...visiblePosts].reverse().map(post => (
                <div key={post.id} className="bg-slate-800 p-3 rounded-md text-sm">
                  <span className="text-slate-400 mr-2">{new Date(post.createdAt).toLocaleTimeString('ja-JP')}</span>
                  <span className="font-bold text-sky-400">@{post.user.username}:</span>
                  <span className="ml-2">{post.content}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">再生ボタンを押して開始してください。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}