"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  clearGitHubConfig,
  fetchGitHubUser,
  loadGitHubConfig,
  readProgressFile,
  saveGitHubConfig,
  writeProgressFile,
  type GitHubConfig,
} from "./githubSync";

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

export interface UserProfile {
  userName: string;
  loginMode: "github" | "local";
  lastUpdated: string;
  lastVisitedPath?: string;
}

export interface MathProgress {
  lastUpdated: string;
  chapterScores: {
    [chapterId: string]: {
      completedAt: string;
      exerciseScore?: number;
      examPrepScore?: number;
      questionResults?: { [questionId: string]: boolean };
    };
  };
}

export interface FCEProgress {
  lastUpdated: string;
  dailyCompleted: {
    [dayId: string]: {
      completedAt: string;
      scores: {
        reading?: number;
        vocab?: number;
        grammar?: number;
        uoe?: number;
        listening?: number;
        [key: string]: number | undefined;
      };
      questionResults?: { [questionId: string]: boolean };
    };
  };
  questCompleted: {
    [questId: string]: { completedAt: string };
  };
}

export interface ScoreHistoryEntry {
  id: string; // e.g. "D001-reading", "rational-numbers-exercise"
  subject: string;
  date: string;
  score: number;
  maxScore: number;
}

export interface ScoreHistory {
  entries: ScoreHistoryEntry[];
}

// ---------------------------------------------------------------------------
// Context type
// ---------------------------------------------------------------------------

export interface ProgressContextType {
  // State
  profile: UserProfile | null;
  scoreHistory: ScoreHistory | null;
  isLoggedIn: boolean;
  isSyncing: boolean;
  userName: string;
  configInfo: { owner: string; repo: string } | null;

  // Actions
  login: (token: string, repo: string, displayName?: string) => Promise<boolean>;
  loginLocal: (displayName: string) => void; // local-only login (no GitHub)
  logout: () => void;
  setUserName: (name: string) => void;
  syncNow: () => Promise<void>;
  nextSyncIn: number; // seconds until next auto-sync (0 if not logged in)

  // Page tracking
  recordPageVisit: (path: string) => void;
  lastVisitedPath: string | null;

  // Record scores
  recordDailyScore: (
    dayId: string,
    tab: string,
    score: number,
    maxScore: number,
    questionResults?: Record<string, boolean>
  ) => Promise<void>;
  recordChapterScore: (
    chapterId: string,
    type: "exercise" | "examPrep",
    score: number,
    maxScore: number
  ) => Promise<void>;
  recordQuestComplete: (questId: string) => Promise<void>;

  // Read scores
  getDailyScores: (dayId: string) => Record<string, number> | null;
  getChapterScores: (
    chapterId: string
  ) => { exerciseScore?: number; examPrepScore?: number } | null;
  getScoreHistory: (
    id: string
  ) => { date: string; score: number; maxScore: number }[];

  // Check if a day is fully completed (all scorable tabs have scores)
  isDayCompleted: (dayId: string) => boolean;
  getDayAverageScore: (dayId: string) => number | null; // average across all tabs, 0-100
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROFILE_FILE = "profile.json";
const MATH_FILE = "math-progress.json";
const FCE_FILE = "english-fce-progress.json";
const HISTORY_FILE = "score-history.json";

const PROFILE_LOCAL_KEY = "xinbloom-profile";
const MATH_LOCAL_KEY = "xinbloom-math-progress";
const FCE_LOCAL_KEY = "xinbloom-fce-progress";
const HISTORY_LOCAL_KEY = "xinbloom-score-history";

const SYNC_DEBOUNCE_MS = 2000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emptyProfile(userName: string, loginMode: "github" | "local" = "github"): UserProfile {
  return {
    userName,
    loginMode,
    lastUpdated: new Date().toISOString(),
  };
}

function emptyMathProgress(): MathProgress {
  return {
    lastUpdated: new Date().toISOString(),
    chapterScores: {},
  };
}

function emptyFCEProgress(): FCEProgress {
  return {
    lastUpdated: new Date().toISOString(),
    dailyCompleted: {},
    questCompleted: {},
  };
}

function emptyHistory(): ScoreHistory {
  return { entries: [] };
}

function saveProfileLocal(data: UserProfile): void {
  try { localStorage.setItem(PROFILE_LOCAL_KEY, JSON.stringify(data)); } catch { /* quota exceeded */ }
}
function loadProfileLocal(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_LOCAL_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch { return null; }
}

function saveMathLocal(data: MathProgress): void {
  try { localStorage.setItem(MATH_LOCAL_KEY, JSON.stringify(data)); } catch { /* quota exceeded */ }
}
function loadMathLocal(): MathProgress | null {
  try {
    const raw = localStorage.getItem(MATH_LOCAL_KEY);
    return raw ? (JSON.parse(raw) as MathProgress) : null;
  } catch { return null; }
}

function saveFCELocal(data: FCEProgress): void {
  try { localStorage.setItem(FCE_LOCAL_KEY, JSON.stringify(data)); } catch { /* quota exceeded */ }
}
function loadFCELocal(): FCEProgress | null {
  try {
    const raw = localStorage.getItem(FCE_LOCAL_KEY);
    return raw ? (JSON.parse(raw) as FCEProgress) : null;
  } catch { return null; }
}

function saveHistoryLocal(data: ScoreHistory): void {
  try { localStorage.setItem(HISTORY_LOCAL_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}
function loadHistoryLocal(): ScoreHistory | null {
  try {
    const raw = localStorage.getItem(HISTORY_LOCAL_KEY);
    return raw ? (JSON.parse(raw) as ScoreHistory) : null;
  } catch { return null; }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ProgressContext = createContext<ProgressContextType | null>(null);

export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within <ProgressProvider>");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mathProgress, setMathProgress] = useState<MathProgress | null>(null);
  const [fceProgress, setFCEProgress] = useState<FCEProgress | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory | null>(null);
  const [config, setConfig] = useState<GitHubConfig | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userName, setUserNameState] = useState("");

  // SHA tracking for conflict-free updates
  const profileShaRef = useRef<string | null>(null);
  const mathShaRef = useRef<string | null>(null);
  const fceShaRef = useRef<string | null>(null);
  const historyShaRef = useRef<string | null>(null);

  // Dirty flags — track which files need syncing
  const profileDirtyRef = useRef(false);
  const mathDirtyRef = useRef(false);
  const fceDirtyRef = useRef(false);
  const historyDirtyRef = useRef(false);

  // Single debounce timer for all files
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep a ref to latest state for async callbacks
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const mathRef = useRef(mathProgress);
  mathRef.current = mathProgress;
  const fceRef = useRef(fceProgress);
  fceRef.current = fceProgress;
  const historyRef = useRef(scoreHistory);
  historyRef.current = scoreHistory;
  const configRef = useRef(config);
  configRef.current = config;

  // -----------------------------------------------------------------------
  // GitHub sync helpers
  // -----------------------------------------------------------------------

  /** Write a single file to GitHub with 409-conflict retry */
  const writeFileWithRetry = useCallback(async (
    cfg: GitHubConfig,
    fileName: string,
    data: unknown,
    shaRef: React.MutableRefObject<string | null>
  ) => {
    try {
      const newSha = await writeProgressFile(cfg, fileName, data, shaRef.current);
      shaRef.current = newSha;
    } catch (err) {
      console.error(`[progressContext] Failed to sync ${fileName} to GitHub:`, err);
      if (err instanceof Error && err.message.includes("409")) {
        try {
          const remote = await readProgressFile(cfg, fileName);
          if (remote) {
            shaRef.current = remote.sha;
            const newSha = await writeProgressFile(cfg, fileName, data, remote.sha);
            shaRef.current = newSha;
          }
        } catch (retryErr) {
          console.error(`[progressContext] ${fileName} retry also failed:`, retryErr);
        }
      }
    }
  }, []);

  /** Flush all dirty files to GitHub */
  const flushDirtyToGitHub = useCallback(async () => {
    const cfg = configRef.current;
    if (!cfg) return;

    setIsSyncing(true);
    try {
      const promises: Promise<void>[] = [];
      if (profileDirtyRef.current && profileRef.current) {
        profileDirtyRef.current = false;
        promises.push(writeFileWithRetry(cfg, PROFILE_FILE, profileRef.current, profileShaRef));
      }
      if (mathDirtyRef.current && mathRef.current) {
        mathDirtyRef.current = false;
        promises.push(writeFileWithRetry(cfg, MATH_FILE, mathRef.current, mathShaRef));
      }
      if (fceDirtyRef.current && fceRef.current) {
        fceDirtyRef.current = false;
        promises.push(writeFileWithRetry(cfg, FCE_FILE, fceRef.current, fceShaRef));
      }
      if (historyDirtyRef.current && historyRef.current) {
        historyDirtyRef.current = false;
        promises.push(writeFileWithRetry(cfg, HISTORY_FILE, historyRef.current, historyShaRef));
      }
      await Promise.all(promises);
    } finally {
      setIsSyncing(false);
    }
  }, [writeFileWithRetry]);

  /** Schedule a debounced sync for all dirty files */
  const scheduleSyncDirty = useCallback(() => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }
    syncTimerRef.current = setTimeout(() => {
      syncTimerRef.current = null;
      flushDirtyToGitHub();
    }, SYNC_DEBOUNCE_MS);
  }, [flushDirtyToGitHub]);

  // -----------------------------------------------------------------------
  // Load from GitHub
  // -----------------------------------------------------------------------

  const loadFromGitHub = useCallback(async (cfg: GitHubConfig) => {
    setIsSyncing(true);
    try {
      // Load profile
      const profileResult = await readProgressFile(cfg, PROFILE_FILE);
      let prof: UserProfile;
      if (profileResult) {
        prof = profileResult.data as UserProfile;
        profileShaRef.current = profileResult.sha;
      } else {
        prof = emptyProfile(cfg.owner);
        try {
          const sha = await writeProgressFile(cfg, PROFILE_FILE, prof, null);
          profileShaRef.current = sha;
        } catch (e) {
          console.error("[progressContext] Failed to create initial profile.json:", e);
          profileShaRef.current = null;
        }
      }
      setProfile(prof);
      setUserNameState(prof.userName || cfg.owner);
      saveProfileLocal(prof);

      // Load math progress
      const mathResult = await readProgressFile(cfg, MATH_FILE);
      let math: MathProgress;
      if (mathResult) {
        math = mathResult.data as MathProgress;
        mathShaRef.current = mathResult.sha;
      } else {
        math = emptyMathProgress();
        try {
          const sha = await writeProgressFile(cfg, MATH_FILE, math, null);
          mathShaRef.current = sha;
        } catch (e) {
          console.error("[progressContext] Failed to create initial math-progress.json:", e);
          mathShaRef.current = null;
        }
      }
      setMathProgress(math);
      saveMathLocal(math);

      // Load FCE progress
      const fceResult = await readProgressFile(cfg, FCE_FILE);
      let fce: FCEProgress;
      if (fceResult) {
        fce = fceResult.data as FCEProgress;
        fceShaRef.current = fceResult.sha;
      } else {
        fce = emptyFCEProgress();
        try {
          const sha = await writeProgressFile(cfg, FCE_FILE, fce, null);
          fceShaRef.current = sha;
        } catch (e) {
          console.error("[progressContext] Failed to create initial english-fce-progress.json:", e);
          fceShaRef.current = null;
        }
      }
      setFCEProgress(fce);
      saveFCELocal(fce);

      // Load score history
      const historyResult = await readProgressFile(cfg, HISTORY_FILE);
      let hist: ScoreHistory;
      if (historyResult) {
        hist = historyResult.data as ScoreHistory;
        historyShaRef.current = historyResult.sha;
      } else {
        hist = emptyHistory();
        try {
          const sha = await writeProgressFile(cfg, HISTORY_FILE, hist, null);
          historyShaRef.current = sha;
        } catch (e) {
          console.error("[progressContext] Failed to create initial score-history.json:", e);
          historyShaRef.current = null;
        }
      }
      setScoreHistory(hist);
      saveHistoryLocal(hist);
    } catch (err) {
      console.error("[progressContext] Failed to load from GitHub:", err);
      // Fall back to local data
      const localProf = loadProfileLocal();
      const localMath = loadMathLocal();
      const localFCE = loadFCELocal();
      const localHist = loadHistoryLocal();
      setProfile(localProf || emptyProfile(cfg.owner));
      setMathProgress(localMath || emptyMathProgress());
      setFCEProgress(localFCE || emptyFCEProgress());
      setScoreHistory(localHist || emptyHistory());
      setUserNameState(localProf?.userName || cfg.owner);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // -----------------------------------------------------------------------
  // Auto-init on mount
  // -----------------------------------------------------------------------

  useEffect(() => {
    const savedConfig = loadGitHubConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      loadFromGitHub(savedConfig);
    } else {
      // Check for local-only mode
      const localProf = loadProfileLocal();
      const localMath = loadMathLocal();
      const localFCE = loadFCELocal();
      const localHist = loadHistoryLocal();
      if (localProf) {
        setProfile(localProf);
        setUserNameState(localProf.userName || "");
      }
      if (localMath) setMathProgress(localMath);
      if (localFCE) setFCEProgress(localFCE);
      if (localHist) setScoreHistory(localHist);
    }
    // Cleanup debounce timer on unmount
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [loadFromGitHub]);

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------

  const login = useCallback(
    async (token: string, repo: string, displayName?: string): Promise<boolean> => {
      try {
        const owner = await fetchGitHubUser(token);
        const cfg: GitHubConfig = { token, repo, owner };
        saveGitHubConfig(cfg);
        setConfig(cfg);
        await loadFromGitHub(cfg);
        // If display name provided and profile was just created, update it
        if (displayName?.trim()) {
          setUserNameState(displayName.trim());
          setProfile((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, userName: displayName.trim(), lastUpdated: new Date().toISOString() };
            saveProfileLocal(updated);
            return updated;
          });
          profileDirtyRef.current = true;
          scheduleSyncDirty();
        }
        return true;
      } catch (err) {
        console.error("[progressContext] Login failed:", err);
        return false;
      }
    },
    [loadFromGitHub, scheduleSyncDirty]
  );

  const loginLocal = useCallback((displayName: string) => {
    // No GitHub config needed. Just initialize in localStorage.
    const prof = emptyProfile(displayName || "Student", "local");
    setProfile(prof);
    setUserNameState(displayName || "Student");
    saveProfileLocal(prof);
    const math = emptyMathProgress();
    setMathProgress(math);
    saveMathLocal(math);
    const fce = emptyFCEProgress();
    setFCEProgress(fce);
    saveFCELocal(fce);
    const hist = emptyHistory();
    setScoreHistory(hist);
    saveHistoryLocal(hist);
    // Set a flag so we know we're in local mode
    try { localStorage.setItem("xinbloom-login-mode", "local"); } catch {}
  }, []);

  const logout = useCallback(() => {
    // Flush any pending syncs
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }

    clearGitHubConfig();
    setConfig(null);
    setProfile(null);
    setMathProgress(null);
    setFCEProgress(null);
    setScoreHistory(null);
    setUserNameState("");
    profileShaRef.current = null;
    mathShaRef.current = null;
    fceShaRef.current = null;
    historyShaRef.current = null;
    profileDirtyRef.current = false;
    mathDirtyRef.current = false;
    fceDirtyRef.current = false;
    historyDirtyRef.current = false;

    try {
      localStorage.removeItem(PROFILE_LOCAL_KEY);
      localStorage.removeItem(MATH_LOCAL_KEY);
      localStorage.removeItem(FCE_LOCAL_KEY);
      localStorage.removeItem(HISTORY_LOCAL_KEY);
      localStorage.removeItem("xinbloom-login-mode");
    } catch {
      /* ignore */
    }
  }, []);

  const setUserName = useCallback(
    (name: string) => {
      setUserNameState(name);
      setProfile((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, userName: name, lastUpdated: new Date().toISOString() };
        saveProfileLocal(updated);
        return updated;
      });
      if (config) {
        profileDirtyRef.current = true;
        scheduleSyncDirty();
      }
    },
    [config, scheduleSyncDirty]
  );

  const recordPageVisit = useCallback((path: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, lastVisitedPath: path, lastUpdated: new Date().toISOString() };
      saveProfileLocal(updated);
      return updated;
    });
    // Don't sync to GitHub immediately for every page visit — the periodic sync will handle it
  }, []);

  const syncNow = useCallback(async () => {
    const cfg = configRef.current;
    if (!cfg) return;
    // Flush pending debounced writes
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    setIsSyncing(true);
    try {
      const localProf = loadProfileLocal();
      const localMath = loadMathLocal();
      const localFCE = loadFCELocal();
      const localHist = loadHistoryLocal();

      // Check remote for diffs before writing
      const [remoteProf, remoteMath, remoteFCE, remoteHist] = await Promise.all([
        readProgressFile(cfg, PROFILE_FILE),
        readProgressFile(cfg, MATH_FILE),
        readProgressFile(cfg, FCE_FILE),
        readProgressFile(cfg, HISTORY_FILE),
      ]);

      // --- Profile: compare by lastUpdated ---
      if (remoteProf) {
        const remoteData = remoteProf.data as UserProfile;
        const remoteTime = new Date(remoteData?.lastUpdated || 0).getTime();
        const localTime = new Date(localProf?.lastUpdated || 0).getTime();
        if (remoteTime > localTime) {
          setProfile(remoteData);
          setUserNameState(remoteData.userName || cfg.owner);
          saveProfileLocal(remoteData);
          profileShaRef.current = remoteProf.sha;
        } else if (localProf && localTime > remoteTime) {
          const sha = await writeProgressFile(cfg, PROFILE_FILE, localProf, remoteProf.sha);
          profileShaRef.current = sha;
        } else {
          profileShaRef.current = remoteProf.sha;
        }
      } else if (localProf) {
        const sha = await writeProgressFile(cfg, PROFILE_FILE, localProf, null);
        profileShaRef.current = sha;
      }

      // --- Math progress: compare by lastUpdated ---
      if (remoteMath) {
        const remoteData = remoteMath.data as MathProgress;
        const remoteTime = new Date(remoteData?.lastUpdated || 0).getTime();
        const localTime = new Date(localMath?.lastUpdated || 0).getTime();
        if (remoteTime > localTime) {
          setMathProgress(remoteData);
          saveMathLocal(remoteData);
          mathShaRef.current = remoteMath.sha;
        } else if (localMath && localTime > remoteTime) {
          const sha = await writeProgressFile(cfg, MATH_FILE, localMath, remoteMath.sha);
          mathShaRef.current = sha;
        } else {
          mathShaRef.current = remoteMath.sha;
        }
      } else if (localMath) {
        const sha = await writeProgressFile(cfg, MATH_FILE, localMath, null);
        mathShaRef.current = sha;
      }

      // --- FCE progress: compare by lastUpdated ---
      if (remoteFCE) {
        const remoteData = remoteFCE.data as FCEProgress;
        const remoteTime = new Date(remoteData?.lastUpdated || 0).getTime();
        const localTime = new Date(localFCE?.lastUpdated || 0).getTime();
        if (remoteTime > localTime) {
          setFCEProgress(remoteData);
          saveFCELocal(remoteData);
          fceShaRef.current = remoteFCE.sha;
        } else if (localFCE && localTime > remoteTime) {
          const sha = await writeProgressFile(cfg, FCE_FILE, localFCE, remoteFCE.sha);
          fceShaRef.current = sha;
        } else {
          fceShaRef.current = remoteFCE.sha;
        }
      } else if (localFCE) {
        const sha = await writeProgressFile(cfg, FCE_FILE, localFCE, null);
        fceShaRef.current = sha;
      }

      // --- History: compare by entry count ---
      if (remoteHist) {
        const remoteEntries = (remoteHist.data as ScoreHistory)?.entries?.length || 0;
        const localEntries = localHist?.entries?.length || 0;
        if (remoteEntries > localEntries) {
          setScoreHistory(remoteHist.data as ScoreHistory);
          saveHistoryLocal(remoteHist.data as ScoreHistory);
          historyShaRef.current = remoteHist.sha;
        } else if (localHist && localEntries > remoteEntries) {
          const sha = await writeProgressFile(cfg, HISTORY_FILE, localHist, remoteHist.sha);
          historyShaRef.current = sha;
        } else {
          historyShaRef.current = remoteHist.sha;
        }
      } else if (localHist) {
        const sha = await writeProgressFile(cfg, HISTORY_FILE, localHist, null);
        historyShaRef.current = sha;
      }

      // Clear all dirty flags after full sync
      profileDirtyRef.current = false;
      mathDirtyRef.current = false;
      fceDirtyRef.current = false;
      historyDirtyRef.current = false;
    } catch (e) {
      console.error("[progressContext] Sync failed:", e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Periodic sync every 5 minutes with countdown
  const SYNC_INTERVAL = 5 * 60; // seconds
  const [nextSyncIn, setNextSyncIn] = useState(0);

  useEffect(() => {
    if (!config) { setNextSyncIn(0); return; }
    setNextSyncIn(SYNC_INTERVAL);
    const tick = setInterval(() => {
      setNextSyncIn((prev) => {
        if (prev <= 1) {
          syncNow();
          return SYNC_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [config, syncNow]);

  // -----------------------------------------------------------------------
  // Record helpers
  // -----------------------------------------------------------------------

  const appendHistory = useCallback(
    (entry: ScoreHistoryEntry) => {
      setScoreHistory((prev) => {
        const hist = prev ? { entries: [...prev.entries] } : emptyHistory();
        hist.entries.push(entry);
        saveHistoryLocal(hist);
        return hist;
      });
      if (configRef.current) {
        historyDirtyRef.current = true;
        scheduleSyncDirty();
      }
    },
    [scheduleSyncDirty]
  );

  // -----------------------------------------------------------------------
  // Record scores
  // -----------------------------------------------------------------------

  const recordDailyScore = useCallback(
    async (dayId: string, tab: string, score: number, maxScore: number, questionResults?: Record<string, boolean>) => {
      const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      const now = new Date().toISOString();

      setFCEProgress((prev) => {
        const data = prev ? { ...prev, dailyCompleted: { ...prev.dailyCompleted }, questCompleted: { ...prev.questCompleted } } : emptyFCEProgress();
        if (!data.dailyCompleted[dayId]) {
          data.dailyCompleted[dayId] = { completedAt: now, scores: {} };
        } else {
          data.dailyCompleted[dayId] = { ...data.dailyCompleted[dayId], scores: { ...data.dailyCompleted[dayId].scores } };
        }
        data.dailyCompleted[dayId].scores[tab as keyof typeof data.dailyCompleted[string]["scores"]] = pct;
        data.dailyCompleted[dayId].completedAt = now;
        if (questionResults) {
          const day = data.dailyCompleted[dayId];
          day.questionResults = { ...(day.questionResults || {}), ...questionResults };
        }
        data.lastUpdated = now;
        saveFCELocal(data);
        return data;
      });

      if (configRef.current) {
        fceDirtyRef.current = true;
        scheduleSyncDirty();
      }

      appendHistory({
        id: `${dayId}-${tab}`,
        subject: "english",
        date: now,
        score,
        maxScore,
      });

      // Sync immediately after scoring
      setTimeout(() => syncNow(), 500);
    },
    [appendHistory, syncNow, scheduleSyncDirty]
  );

  const recordChapterScore = useCallback(
    async (
      chapterId: string,
      type: "exercise" | "examPrep",
      score: number,
      maxScore: number
    ) => {
      const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      const now = new Date().toISOString();

      setMathProgress((prev) => {
        const data = prev ? { ...prev, chapterScores: { ...prev.chapterScores } } : emptyMathProgress();
        if (!data.chapterScores[chapterId]) {
          data.chapterScores[chapterId] = { completedAt: now };
        } else {
          data.chapterScores[chapterId] = { ...data.chapterScores[chapterId] };
        }
        if (type === "exercise") {
          data.chapterScores[chapterId].exerciseScore = pct;
        } else {
          data.chapterScores[chapterId].examPrepScore = pct;
        }
        data.chapterScores[chapterId].completedAt = now;
        data.lastUpdated = now;
        saveMathLocal(data);
        return data;
      });

      if (configRef.current) {
        mathDirtyRef.current = true;
        scheduleSyncDirty();
      }

      appendHistory({
        id: `${chapterId}-${type}`,
        subject: "math",
        date: now,
        score,
        maxScore,
      });

      setTimeout(() => syncNow(), 500);
    },
    [appendHistory, syncNow, scheduleSyncDirty]
  );

  const recordQuestComplete = useCallback(
    async (questId: string) => {
      const now = new Date().toISOString();

      setFCEProgress((prev) => {
        const data = prev ? { ...prev, dailyCompleted: { ...prev.dailyCompleted }, questCompleted: { ...prev.questCompleted } } : emptyFCEProgress();
        data.questCompleted[questId] = { completedAt: now };
        data.lastUpdated = now;
        saveFCELocal(data);
        return data;
      });

      if (configRef.current) {
        fceDirtyRef.current = true;
        scheduleSyncDirty();
      }
    },
    [scheduleSyncDirty]
  );

  // -----------------------------------------------------------------------
  // Read scores
  // -----------------------------------------------------------------------

  const getDailyScores = useCallback(
    (dayId: string): Record<string, number> | null => {
      if (!fceProgress?.dailyCompleted[dayId]) return null;
      const scores = fceProgress.dailyCompleted[dayId].scores;
      const result: Record<string, number> = {};
      for (const [k, v] of Object.entries(scores)) {
        if (v !== undefined) result[k] = v;
      }
      return Object.keys(result).length > 0 ? result : null;
    },
    [fceProgress]
  );

  const getChapterScores = useCallback(
    (
      chapterId: string
    ): { exerciseScore?: number; examPrepScore?: number } | null => {
      if (!mathProgress?.chapterScores[chapterId]) return null;
      const { exerciseScore, examPrepScore } = mathProgress.chapterScores[chapterId];
      if (exerciseScore === undefined && examPrepScore === undefined) return null;
      return { exerciseScore, examPrepScore };
    },
    [mathProgress]
  );

  const getScoreHistory = useCallback(
    (id: string): { date: string; score: number; maxScore: number }[] => {
      if (!scoreHistory) return [];
      return scoreHistory.entries
        .filter((e) => e.id === id)
        .map(({ date, score, maxScore }) => ({ date, score, maxScore }));
    },
    [scoreHistory]
  );

  const isDayCompleted = useCallback((dayId: string): boolean => {
    const day = fceProgress?.dailyCompleted?.[dayId];
    if (!day?.scores) return false;
    const s = day.scores;
    // Completed if at least reading + grammar + uoe have scores
    return s.reading != null && s.grammar != null && s.uoe != null;
  }, [fceProgress]);

  const getDayAverageScore = useCallback((dayId: string): number | null => {
    const day = fceProgress?.dailyCompleted?.[dayId];
    if (!day?.scores) return null;
    const values = Object.values(day.scores).filter((v): v is number => v != null);
    if (values.length === 0) return null;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [fceProgress]);

  // -----------------------------------------------------------------------
  // Context value
  // -----------------------------------------------------------------------

  const value: ProgressContextType = {
    profile,
    scoreHistory,
    isLoggedIn: config !== null || profile?.loginMode === "local",
    isSyncing,
    userName,
    configInfo: config ? { owner: config.owner, repo: config.repo } : null,

    login,
    loginLocal,
    logout,
    setUserName,
    syncNow,
    nextSyncIn,

    recordPageVisit,
    lastVisitedPath: profile?.lastVisitedPath || null,

    recordDailyScore,
    recordChapterScore,
    recordQuestComplete,

    getDailyScores,
    getChapterScores,
    getScoreHistory,

    isDayCompleted,
    getDayAverageScore,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
