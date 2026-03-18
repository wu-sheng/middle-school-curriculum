"use client";

import { useState, useRef, useEffect } from "react";
import { useProgress } from "@/lib/progressContext";
import SettingsModal, { UserBadge } from "./SettingsModal";

export default function TopBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { isLoggedIn, recentPages } = useProgress();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setPanelOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [panelOpen]);

  const hasRecent = isLoggedIn && recentPages.length > 0;

  return (
    <>
      <div ref={panelRef} className="fixed top-0 right-0 z-30">
        {/* Compact bar */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm border-b border-l border-gray-100 rounded-bl-xl px-3 py-1.5 shadow-sm">
          <UserBadge onClick={() => setSettingsOpen(true)} />
          {hasRecent && (
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors text-[10px] ${
                panelOpen ? "bg-purple-100 text-purple-500" : "text-gray-300 hover:text-purple-400"
              }`}
            >
              {panelOpen ? "▴" : "▾"}
            </button>
          )}
        </div>

        {/* Dropdown */}
        {panelOpen && hasRecent && (
          <div className="absolute top-full right-0 bg-white border border-gray-100 border-t-0 rounded-b-xl shadow-lg px-3 py-2 min-w-[200px] max-w-[300px]">
            <p className="text-[10px] text-gray-300 mb-1 uppercase tracking-wider">Recent</p>
            {recentPages.map((p, i) => (
              <a
                key={p.path + p.timestamp}
                href={p.path}
                onClick={() => setPanelOpen(false)}
                className={`block text-xs py-1 truncate transition-colors ${
                  i === 0 ? "text-purple-600 font-medium" : "text-gray-400 hover:text-purple-500"
                }`}
                title={p.path}
              >
                {i === 0 ? "📍 " : ""}{p.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
