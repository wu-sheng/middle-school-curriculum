"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progressContext";
import SettingsModal, { UserBadge } from "./SettingsModal";

export default function TopBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isLoggedIn, isSyncing, syncNow } = useProgress();

  return (
    <>
      <div className="fixed top-3 right-4 z-30 lg:right-6 flex items-center gap-2">
        {isLoggedIn && (
          <button
            onClick={() => syncNow()}
            disabled={isSyncing}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              isSyncing
                ? "bg-purple-100 text-purple-400 animate-spin"
                : "bg-white/80 text-gray-400 hover:text-purple-500 hover:bg-purple-50 border border-gray-100"
            }`}
            title="Sync"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
        <UserBadge onClick={() => setSettingsOpen(true)} />
      </div>
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
