"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLang, biPick } from "@/lib/i18n";
import { useProgress } from "@/lib/progressContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { lang } = useLang();
  const { isLoggedIn, isSyncing, userName, login, loginLocal, logout, setUserName, syncNow, profile, configInfo } = useProgress();

  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("xinbloom-progress");
  const [displayName, setDisplayName] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [visible, setVisible] = useState(false);

  // sync displayName from context
  useEffect(() => {
    if (userName) setDisplayName(userName);
  }, [userName]);

  // animate in
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleConnect = useCallback(async () => {
    if (!token.trim()) {
      setError(biPick(lang, "请输入 GitHub Token", "Please enter a GitHub token"));
      return;
    }
    setError("");
    setConnecting(true);
    try {
      await login(token.trim(), repo.trim(), displayName.trim() || undefined);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("401") || msg.toLowerCase().includes("invalid")) {
        setError(biPick(lang, "Token 无效，请检查后重试", "Invalid token. Please check and try again."));
      } else if (msg.includes("404") || msg.toLowerCase().includes("not found")) {
        setError(biPick(lang, "仓库未找到，请确认仓库名称", "Repository not found. Please verify the name."));
      } else {
        setError(msg);
      }
    } finally {
      setConnecting(false);
    }
  }, [token, repo, displayName, lang, login, setUserName]);

  const handleNameSave = useCallback(() => {
    if (displayName.trim() && displayName.trim() !== userName) {
      setUserName(displayName.trim());
    }
  }, [displayName, userName, setUserName]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleNameSave();
    },
    [handleNameSave]
  );

  const formatLastSync = useCallback(() => {
    if (!profile?.lastUpdated) return biPick(lang, "从未同步", "Never synced");
    const diff = Date.now() - new Date(profile.lastUpdated).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return biPick(lang, "刚刚同步", "Just now");
    if (mins < 60) return biPick(lang, `${mins} 分钟前`, `${mins} minute${mins > 1 ? "s" : ""} ago`);
    const hours = Math.floor(mins / 60);
    if (hours < 24) return biPick(lang, `${hours} 小时前`, `${hours} hour${hours > 1 ? "s" : ""} ago`);
    const days = Math.floor(hours / 24);
    return biPick(lang, `${days} 天前`, `${days} day${days > 1 ? "s" : ""} ago`);
  }, [profile?.lastUpdated, lang]);

  if (!isOpen) return null;

  const label = (zh: string, en: string) => biPick(lang, zh, en);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-xl border border-pink-100 transition-transform duration-200"
        style={{ transform: visible ? "scale(1)" : "scale(0.95)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
          <h2 className="text-lg font-semibold text-purple-700">
            {label("设置", "Settings")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {isLoggedIn ? (
            /* ── Logged-in view ── */
            <>
              {profile?.loginMode === "local" ? (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-1">
                  <p className="text-amber-700 font-medium">
                    {label("本地模式", "Local Mode")}
                  </p>
                  <p className="text-xs text-amber-500">
                    {label("进度仅保存在当前浏览器", "Progress saved in this browser only")}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-1">
                  <p className="text-green-700 font-medium">
                    {label("已连接到 GitHub", "Connected to GitHub")}
                  </p>
                  {configInfo && (
                    <p className="text-sm text-green-600">
                      Repo: {configInfo.owner}/{configInfo.repo}
                    </p>
                  )}
                  <p className="text-sm text-green-600">
                    {label("上次同步：", "Last synced: ")}{formatLastSync()}
                  </p>
                </div>
              )}

              {/* Display name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {label("显示名称", "Display Name")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-lg border border-purple-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                  {displayName.trim() === userName && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">
                      &#10003;
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => syncNow()}
                  disabled={isSyncing}
                  className="flex-1 rounded-lg bg-purple-100 text-purple-700 py-2 text-sm font-medium hover:bg-purple-200 disabled:opacity-50 transition-colors"
                >
                  {isSyncing ? (
                    <span className="inline-flex items-center gap-1">
                      <Spinner /> {label("同步中…", "Syncing...")}
                    </span>
                  ) : (
                    label("立即同步", "Sync Now")
                  )}
                </button>
                <button
                  onClick={() => { logout(); setToken(""); setError(""); }}
                  className="flex-1 rounded-lg bg-gray-100 text-gray-600 py-2 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {label("断开连接", "Disconnect")}
                </button>
              </div>
            </>
          ) : (
            /* ── Login view ── */
            <>
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <p className="font-medium text-purple-700 mb-1">
                  {label("同步学习进度到 GitHub", "Sync Progress with GitHub")}
                </p>
                <p className="text-sm text-gray-500">
                  {label(
                    "将学习进度保存到你的私有 GitHub 仓库。",
                    "Save your learning progress to a private GitHub repository."
                  )}
                </p>
              </div>

              {/* Token */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  GitHub Token
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="github_pat_..."
                    className="w-full rounded-lg border border-purple-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showToken ? label("隐藏", "Hide") : label("显示", "Show")}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  {label(
                    "在 github.com/settings/tokens 创建 Fine-grained PAT，仅授予进度仓库的 Contents: Read/Write 权限。",
                    "Create a Fine-grained PAT at github.com/settings/tokens with Contents: Read/Write for your progress repo only."
                  )}
                </p>
              </div>

              {/* Repo name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {label("仓库名称", "Repository Name")}
                </label>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="xinbloom-progress"
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <p className="mt-1 text-xs text-gray-400">
                  {label(
                    "默认 xinbloom-progress，可免填。需提前创建此私有仓库。",
                    "Default: xinbloom-progress. Create this private repo first."
                  )}
                </p>
              </div>

              {/* Display name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {label("显示名称", "Display Name")}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Xinxin"
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              {/* Connect button */}
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 text-white py-2.5 text-sm font-semibold hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 transition-all"
              >
                {connecting ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner /> {label("连接中…", "Connecting...")}
                  </span>
                ) : (
                  label("连接并同步", "Connect & Sync")
                )}
              </button>

              {/* Error message */}
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs text-gray-400">{label("或", "or")}</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Local only option */}
              <button
                onClick={() => {
                  loginLocal(displayName.trim() || "Student");
                  onClose();
                }}
                className="w-full rounded-lg border border-gray-200 text-gray-600 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {label("仅本地保存（不同步）", "Save Locally Only")}
              </button>
              <p className="text-xs text-amber-500 mt-1">
                {label(
                  "进度仅保存在当前浏览器，不会同步到其他设备。",
                  "Progress saved in this browser only. Will not sync to other devices."
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Tiny spinner ── */
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

/* ── UserBadge for sidebar ── */
function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function UserBadge({ onClick }: { onClick: () => void }) {
  const { lang } = useLang();
  const { isLoggedIn, isSyncing, userName, syncNow, nextSyncIn, lastVisitedPath } = useProgress();
  const pathname = usePathname();

  const initial = userName ? userName.charAt(0).toUpperCase() : "?";
  const hasResumePath = isLoggedIn && lastVisitedPath && lastVisitedPath !== "/";
  const isOnResumePage = hasResumePath && lastVisitedPath === pathname;

  // Extract a short label from path like "/fce/daily/D001" → "Day 1" or "/lesson/math/grade7/rational-numbers" → "有理数"
  function pathLabel(p: string): string {
    const parts = p.split("/").filter(Boolean);
    if (parts[0] === "fce" && parts[1] === "daily") return `Day ${parseInt(parts[2]?.replace("D", "") || "0")}`;
    if (parts[0] === "fce" && parts[1] === "quest") return parts[2]?.replace("Q0", "Q").replace("-", " ") || "Quest";
    if (parts[0] === "lesson") return parts[parts.length - 1]?.replace(/-/g, " ") || "Lesson";
    return parts[parts.length - 1] || p;
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Resume / current page indicator */}
      {hasResumePath && (
        isOnResumePage ? (
          <span className="text-[11px] text-gray-300 px-2 py-1">
            📍 {pathLabel(lastVisitedPath!)}
          </span>
        ) : (
          <a
            href={lastVisitedPath!}
            className="text-[11px] text-purple-400 hover:text-purple-600 transition-colors px-2 py-1 rounded-lg hover:bg-purple-50"
            title={lastVisitedPath!}
          >
            ▶ {pathLabel(lastVisitedPath!)}
          </a>
        )
      )}
      <button
        onClick={onClick}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-purple-50 transition-colors"
      >
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs font-bold shrink-0">
              {initial}
            </span>
            <div className="text-left">
              <div className="text-gray-700 text-sm leading-tight">{userName}</div>
              {nextSyncIn > 0 && !isSyncing && (
                <div className="text-[10px] text-gray-400 leading-tight tabular-nums">
                  sync in {formatCountdown(nextSyncIn)}
                </div>
              )}
              {isSyncing && (
                <div className="text-[10px] text-purple-400 leading-tight">
                  syncing...
                </div>
              )}
            </div>
          </div>
        ) : (
          <span className="text-gray-500">
            ⚙️ {biPick(lang, "设置", "Settings")}
          </span>
        )}
      </button>
      {isLoggedIn && (
        <button
          onClick={(e) => { e.stopPropagation(); syncNow(); }}
          disabled={isSyncing}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
            isSyncing
              ? "bg-purple-100 text-purple-400"
              : "text-gray-300 hover:text-purple-500 hover:bg-purple-50"
          }`}
          title="Sync now"
        >
          <svg className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
    </div>
  );
}
