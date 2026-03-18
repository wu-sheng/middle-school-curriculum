"use client";

import { useState, useRef, useEffect } from "react";
import { useProgress } from "@/lib/progressContext";
import SettingsModal, { UserBadge } from "./SettingsModal";

export default function TopBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { isLoggedIn, recentPages } = useProgress();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    if (!panelOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setPanelOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [panelOpen]);

  return (
    <>
      <div ref={panelRef} className="fixed top-3 right-4 z-30 lg:right-6">
        {/* User badge row — always visible */}
        <div className="flex items-center gap-1">
          <UserBadge onClick={() => setSettingsOpen(true)} />
          {isLoggedIn && recentPages.length > 0 && (
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors text-xs ${
                panelOpen ? "bg-purple-100 text-purple-500" : "text-gray-300 hover:text-purple-400 hover:bg-purple-50"
              }`}
              title="Recent pages"
            >
              📍
            </button>
          )}
        </div>

        {/* Dropdown panel — below the badge */}
        {panelOpen && recentPages.length > 0 && (
          <div className="absolute top-full right-0 mt-1 bg-white rounded-xl border border-gray-100 shadow-lg px-3 py-2 min-w-[200px] max-w-[280px]">
            <p className="text-[10px] text-gray-400 mb-1.5 uppercase tracking-wide">Recent</p>
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
                {i === 0 ? "📍 " : "· "}{p.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
