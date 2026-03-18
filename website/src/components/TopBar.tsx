"use client";

import { useState } from "react";
import SettingsModal, { UserBadge } from "./SettingsModal";

export default function TopBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-3 right-4 z-30 lg:right-6">
        <UserBadge onClick={() => setSettingsOpen(true)} />
      </div>
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
