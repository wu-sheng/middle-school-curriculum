"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Mode = "lesson" | "break";

const DURATIONS: Record<Mode, number> = {
  lesson: 45 * 60,
  break: 15 * 60,
};

export default function StudyTimer() {
  const [mode, setMode] = useState<Mode>("lesson");
  const [remaining, setRemaining] = useState(DURATIONS.lesson);
  const [running, setRunning] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const alertedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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

  // Show center alert when timer finishes
  useEffect(() => {
    if (remaining === 0 && !alertedRef.current) {
      alertedRef.current = true;
      setShowAlert(true);
    }
  }, [remaining]);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setRemaining(DURATIONS[m]);
    setRunning(false);
    alertedRef.current = false;
    setShowAlert(false);
  }, []);

  const reset = useCallback(() => {
    setRemaining(DURATIONS[mode]);
    setRunning(false);
    alertedRef.current = false;
    setShowAlert(false);
  }, [mode]);

  const handleStart = useCallback(() => {
    if (remaining === 0) {
      // restart
      setRemaining(DURATIONS[mode]);
      alertedRef.current = false;
      setShowAlert(false);
    }
    setRunning((r) => !r);
  }, [remaining, mode]);

  const dismissAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  // Switch to the other mode after alert
  const switchAfterAlert = useCallback(() => {
    const next: Mode = mode === "lesson" ? "break" : "lesson";
    switchMode(next);
    setRunning(true);
    setShowAlert(false);
  }, [mode, switchMode]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = remaining / DURATIONS[mode];
  const isFinished = remaining === 0;

  const barColor = mode === "lesson" ? "bg-purple-400" : "bg-green-400";
  const barColorLight = mode === "lesson" ? "bg-purple-100" : "bg-green-100";

  return (
    <>
      {/* Bottom bar — always visible, one line */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Progress track */}
        <div className={`h-0.5 ${barColorLight} w-full`}>
          <div
            className={`h-full ${barColor} transition-all duration-1000 ease-linear`}
            style={{ width: `${(1 - progress) * 100}%` }}
          />
        </div>

        {/* Control bar */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-2 flex items-center gap-3">
          {/* Mode toggle */}
          <div className="flex gap-0.5 bg-gray-50 rounded-lg p-0.5 shrink-0">
            <button
              data-compact
              onClick={() => switchMode("lesson")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                mode === "lesson"
                  ? "bg-purple-400 text-white shadow-sm"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              上课
            </button>
            <button
              data-compact
              onClick={() => switchMode("break")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                mode === "break"
                  ? "bg-green-400 text-white shadow-sm"
                  : "text-gray-400 hover:text-green-400"
              }`}
            >
              休息
            </button>
          </div>

          {/* Status + time */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={`text-xs ${running ? "text-green-500" : isFinished ? "text-red-400" : "text-gray-400"}`}>
              {running ? "●" : isFinished ? "○" : "○"}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {mode === "lesson" ? "学习" : "休息"}
              {running ? "中" : isFinished ? "结束" : ""}
            </span>
            <span className={`text-base font-bold tabular-nums tracking-wide ${
              isFinished ? "text-red-400 animate-pulse" : running ? "text-gray-700" : "text-gray-400"
            }`}>
              {mm}:{ss}
            </span>
            <span className="text-[10px] text-gray-300">
              / {mode === "lesson" ? "45:00" : "15:00"}
            </span>
          </div>

          {/* Controls */}
          <div className="flex gap-1.5 shrink-0">
            <button
              data-compact
              onClick={handleStart}
              className={`px-3 py-1 rounded-lg text-xs font-medium text-white transition-colors ${
                running
                  ? "bg-amber-400 hover:bg-amber-500"
                  : mode === "lesson"
                  ? "bg-purple-400 hover:bg-purple-500"
                  : "bg-green-400 hover:bg-green-500"
              }`}
            >
              {running ? "暂停" : isFinished ? "重来" : "开始"}
            </button>
            <button
              data-compact
              onClick={reset}
              className="px-2 py-1 rounded-lg text-xs text-gray-400 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {/* Center screen alert modal when time is up */}
      {showAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center animate-bounce-in">
            <div className="text-5xl mb-4">
              {mode === "lesson" ? "☕" : "📖"}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${mode === "lesson" ? "text-purple-500" : "text-green-500"}`}>
              {mode === "lesson" ? "该休息一下啦！" : "休息结束，继续学习！"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {mode === "lesson"
                ? "你已经学习了 45 分钟，站起来活动一下吧！"
                : "精力恢复了，回到学习中吧！"}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={switchAfterAlert}
                className={`px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors ${
                  mode === "lesson"
                    ? "bg-green-400 hover:bg-green-500"
                    : "bg-purple-400 hover:bg-purple-500"
                }`}
              >
                {mode === "lesson" ? "开始休息 15′" : "开始学习 45′"}
              </button>
              <button
                onClick={dismissAlert}
                className="px-5 py-2 rounded-xl text-sm font-medium text-gray-400 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
