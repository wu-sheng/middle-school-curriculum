"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progressContext";
import SettingsModal, { UserBadge } from "./SettingsModal";

export default function TopBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { isLoggedIn, recentPages } = useProgress();

  return (
    <>
      <div className="fixed top-3 right-4 z-30 lg:right-6">
        {/* Desktop: show badge + recent pages inline */}
        <div className="hidden lg:flex items-start gap-2">
          <UserBadge onClick={() => setSettingsOpen(true)} />
          {isLoggedIn && recentPages.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm px-3 py-2 min-w-[180px]">
              <p className="text-[10px] text-gray-400 mb-1">Recent</p>
              {recentPages.map((p, i) => (
                <a
                  key={p.path}
                  href={p.path}
                  className={`block text-xs py-0.5 truncate transition-colors ${
                    i === 0 ? "text-purple-500 font-medium" : "text-gray-400 hover:text-purple-400"
                  }`}
                  title={p.path}
                >
                  {i === 0 ? "📍 " : "· "}{p.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Mobile: collapsed button, tap to expand panel */}
        <div className="lg:hidden">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 border border-gray-100 shadow-sm text-gray-500"
          >
            {panelOpen ? "✕" : "👤"}
          </button>
          {panelOpen && (
            <div className="absolute top-12 right-0 bg-white rounded-xl border border-gray-100 shadow-lg p-3 min-w-[220px] animate-in fade-in">
              <UserBadge onClick={() => { setPanelOpen(false); setSettingsOpen(true); }} />
              {isLoggedIn && recentPages.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-50">
                  <p className="text-[10px] text-gray-400 mb-1">Recent</p>
                  {recentPages.map((p, i) => (
                    <a
                      key={p.path}
                      href={p.path}
                      onClick={() => setPanelOpen(false)}
                      className={`block text-xs py-1 truncate transition-colors ${
                        i === 0 ? "text-purple-500 font-medium" : "text-gray-400 hover:text-purple-400"
                      }`}
                    >
                      {i === 0 ? "📍 " : "· "}{p.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
