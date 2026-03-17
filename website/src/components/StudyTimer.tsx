"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Mode = "lesson" | "break";

const DURATIONS: Record<Mode, number> = {
  lesson: 45 * 60,
  break: 15 * 60,
};

export default function StudyTimer() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("lesson");
  const [remaining, setRemaining] = useState(DURATIONS.lesson);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Timer tick
  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setRemaining(DURATIONS[m]);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRemaining(DURATIONS[mode]);
    setRunning(false);
  }, [mode]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = 1 - remaining / DURATIONS[mode];
  const isFinished = remaining === 0;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-white border border-pink-100 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow text-lg"
        title="Study Timer"
      >
        ⏱
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white rounded-2xl shadow-xl border border-pink-100 p-4 w-56">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">⏱ 计时器</span>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-300 hover:text-gray-500 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-3 bg-gray-50 rounded-lg p-0.5">
        <button
          onClick={() => switchMode("lesson")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === "lesson"
              ? "bg-purple-400 text-white shadow-sm"
              : "text-gray-500 hover:text-purple-400"
          }`}
        >
          上课 45′
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === "break"
              ? "bg-green-400 text-white shadow-sm"
              : "text-gray-500 hover:text-green-400"
          }`}
        >
          休息 15′
        </button>
      </div>

      {/* Circular progress + time */}
      <div className="flex justify-center mb-3">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="#f3e8ee"
              strokeWidth="6"
            />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke={mode === "lesson" ? "#c084fc" : "#86efac"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold tabular-nums ${isFinished ? "text-red-400 animate-pulse" : "text-gray-700"}`}>
              {mm}:{ss}
            </span>
            <span className="text-[10px] text-gray-400">
              {mode === "lesson" ? "学习中" : "休息中"}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setRunning(!running)}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-colors ${
            running
              ? "bg-amber-400 hover:bg-amber-500"
              : mode === "lesson"
              ? "bg-purple-400 hover:bg-purple-500"
              : "bg-green-400 hover:bg-green-500"
          }`}
        >
          {running ? "暂停" : isFinished ? "重新开始" : "开始"}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 border border-gray-200 hover:border-gray-300 transition-colors"
        >
          重置
        </button>
      </div>

      {/* Finished alert */}
      {isFinished && (
        <div className={`mt-3 text-center text-xs font-medium rounded-lg py-2 ${
          mode === "lesson"
            ? "bg-purple-50 text-purple-500"
            : "bg-green-50 text-green-500"
        }`}>
          {mode === "lesson" ? "⏰ 该休息一下啦！" : "⏰ 休息结束，继续学习！"}
        </div>
      )}
    </div>
  );
}
