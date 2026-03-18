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

export interface SubjectProgress {
  /** FCE Daily Practice */
  dailyCompleted: {
    [dayId: string]: {
      completedAt: string; // ISO date
      scores: {
        reading?: number; // 0-100 percentage
        vocab?: number;
        grammar?: number;
        useOfEnglish?: number;
        listening?: number;
      };
    };
  };
  /** FCE Quest completion */
  questCompleted: {
    [questId: string]: {
      completedAt: string;
    };
  };
  /** Math chapter scores */
  chapterScores: {
    [chapterId: string]: {
      completedAt: string;
      exerciseScore?: number; // 0-100
      examPrepScore?: number; // 0-100
    };
  };
}

export interface ProgressData {
  userName: string;
  lastUpdated: string; // ISO date
  subjects: {
    [subjectId: string]: SubjectProgress;
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
  progress: ProgressData | null;
  scoreHistory: ScoreHistory | null;
  isLoggedIn: boolean;
  isSyncing: boolean;
  userName: string;
  configInfo: { owner: string; repo: string } | null;

  // Actions
  login: (token: string, repo: string) => Promise<boolean>;
  logout: () => void;
  setUserName: (name: string) => void;

  // Record scores
  recordDailyScore: (
    dayId: string,
    tab: string,
    score: number,
    maxScore: number
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
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROGRESS_LOCAL_KEY = "xinbloom-progress";
const HISTORY_LOCAL_KEY = "xinbloom-score-history";
const PROGRESS_FILE = "progress.json";
const HISTORY_FILE = "score-history.json";
const SYNC_DEBOUNCE_MS = 2000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emptyProgress(userName: string): ProgressData {
  return {
    userName,
    lastUpdated: new Date().toISOString(),
    subjects: {},
  };
}

function emptyHistory(): ScoreHistory {
  return { entries: [] };
}

function ensureSubject(progress: ProgressData, subjectId: string): SubjectProgress {
  if (!progress.subjects[subjectId]) {
    progress.subjects[subjectId] = {
      dailyCompleted: {},
      questCompleted: {},
      chapterScores: {},
    };
  }
  return progress.subjects[subjectId];
}

function saveProgressLocal(data: ProgressData): void {
  try {
    localStorage.setItem(PROGRESS_LOCAL_KEY, JSON.stringify(data));
  } catch {
    /* quota exceeded — ignore */
  }
}

function loadProgressLocal(): ProgressData | null {
  try {
    const raw = localStorage.getItem(PROGRESS_LOCAL_KEY);
    return raw ? (JSON.parse(raw) as ProgressData) : null;
  } catch {
    return null;
  }
}

function saveHistoryLocal(data: ScoreHistory): void {
  try {
    localStorage.setItem(HISTORY_LOCAL_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function loadHistoryLocal(): ScoreHistory | null {
  try {
    const raw = localStorage.getItem(HISTORY_LOCAL_KEY);
    return raw ? (JSON.parse(raw) as ScoreHistory) : null;
  } catch {
    return null;
  }
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
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory | null>(null);
  const [config, setConfig] = useState<GitHubConfig | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userName, setUserNameState] = useState("");

  // SHA tracking for conflict-free updates
  const progressShaRef = useRef<string | null>(null);
  const historyShaRef = useRef<string | null>(null);

  // Debounce timer refs
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep a ref to latest state for async callbacks
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const historyRef = useRef(scoreHistory);
  historyRef.current = scoreHistory;
  const configRef = useRef(config);
  configRef.current = config;

  // -----------------------------------------------------------------------
  // GitHub sync helpers
  // -----------------------------------------------------------------------

  const syncProgressToGitHub = useCallback(async () => {
    const cfg = configRef.current;
    const data = progressRef.current;
    if (!cfg || !data) return;

    setIsSyncing(true);
    try {
      const newSha = await writeProgressFile(
        cfg,
        PROGRESS_FILE,
        data,
        progressShaRef.current
      );
      progressShaRef.current = newSha;
    } catch (err) {
      console.error("[progressContext] Failed to sync progress to GitHub:", err);
      // On 409 conflict, re-read to get latest sha, then retry once
      if (err instanceof Error && err.message.includes("409")) {
        try {
          const remote = await readProgressFile(cfg, PROGRESS_FILE);
          if (remote) {
            progressShaRef.current = remote.sha;
            const newSha = await writeProgressFile(
              cfg,
              PROGRESS_FILE,
              data,
              remote.sha
            );
            progressShaRef.current = newSha;
          }
        } catch (retryErr) {
          console.error("[progressContext] Retry also failed:", retryErr);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const syncHistoryToGitHub = useCallback(async () => {
    const cfg = configRef.current;
    const data = historyRef.current;
    if (!cfg || !data) return;

    setIsSyncing(true);
    try {
      const newSha = await writeProgressFile(
        cfg,
        HISTORY_FILE,
        data,
        historyShaRef.current
      );
      historyShaRef.current = newSha;
    } catch (err) {
      console.error("[progressContext] Failed to sync history to GitHub:", err);
      if (err instanceof Error && err.message.includes("409")) {
        try {
          const remote = await readProgressFile(cfg, HISTORY_FILE);
          if (remote) {
            historyShaRef.current = remote.sha;
            const newSha = await writeProgressFile(
              cfg,
              HISTORY_FILE,
              data,
              remote.sha
            );
            historyShaRef.current = newSha;
          }
        } catch (retryErr) {
          console.error("[progressContext] History retry also failed:", retryErr);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  /** Schedule a debounced sync for progress.json */
  const scheduleSyncProgress = useCallback(() => {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }
    progressTimerRef.current = setTimeout(() => {
      progressTimerRef.current = null;
      syncProgressToGitHub();
    }, SYNC_DEBOUNCE_MS);
  }, [syncProgressToGitHub]);

  /** Schedule a debounced sync for score-history.json */
  const scheduleSyncHistory = useCallback(() => {
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
    }
    historyTimerRef.current = setTimeout(() => {
      historyTimerRef.current = null;
      syncHistoryToGitHub();
    }, SYNC_DEBOUNCE_MS);
  }, [syncHistoryToGitHub]);

  // -----------------------------------------------------------------------
  // Load from GitHub
  // -----------------------------------------------------------------------

  const loadFromGitHub = useCallback(async (cfg: GitHubConfig) => {
    setIsSyncing(true);
    try {
      // Load progress
      const progressResult = await readProgressFile(cfg, PROGRESS_FILE);
      let prog: ProgressData;
      if (progressResult) {
        prog = progressResult.data as ProgressData;
        progressShaRef.current = progressResult.sha;
      } else {
        // First time — create initial progress file in repo
        prog = emptyProgress(cfg.owner);
        try {
          const sha = await writeProgressFile(cfg, PROGRESS_FILE, prog, null);
          progressShaRef.current = sha;
        } catch (e) {
          console.error("[progressContext] Failed to create initial progress.json:", e);
          progressShaRef.current = null;
        }
      }
      setProgress(prog);
      setUserNameState(prog.userName || cfg.owner);
      saveProgressLocal(prog);

      // Load score history
      const historyResult = await readProgressFile(cfg, HISTORY_FILE);
      let hist: ScoreHistory;
      if (historyResult) {
        hist = historyResult.data as ScoreHistory;
        historyShaRef.current = historyResult.sha;
      } else {
        // First time — create initial history file in repo
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
      const localProg = loadProgressLocal();
      const localHist = loadHistoryLocal();
      setProgress(localProg || emptyProgress(cfg.owner));
      setScoreHistory(localHist || emptyHistory());
      setUserNameState(localProg?.userName || cfg.owner);
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
      // Load from localStorage only (offline mode)
      const localProg = loadProgressLocal();
      const localHist = loadHistoryLocal();
      if (localProg) {
        setProgress(localProg);
        setUserNameState(localProg.userName || "");
      }
      if (localHist) {
        setScoreHistory(localHist);
      }
    }
    // Cleanup debounce timers on unmount
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
    };
  }, [loadFromGitHub]);

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------

  const login = useCallback(
    async (token: string, repo: string): Promise<boolean> => {
      try {
        const owner = await fetchGitHubUser(token);
        const cfg: GitHubConfig = { token, repo, owner };
        saveGitHubConfig(cfg);
        setConfig(cfg);
        await loadFromGitHub(cfg);
        return true;
      } catch (err) {
        console.error("[progressContext] Login failed:", err);
        return false;
      }
    },
    [loadFromGitHub]
  );

  const logout = useCallback(() => {
    // Flush any pending syncs
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
      historyTimerRef.current = null;
    }

    clearGitHubConfig();
    setConfig(null);
    setProgress(null);
    setScoreHistory(null);
    setUserNameState("");
    progressShaRef.current = null;
    historyShaRef.current = null;

    try {
      localStorage.removeItem(PROGRESS_LOCAL_KEY);
      localStorage.removeItem(HISTORY_LOCAL_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setUserName = useCallback(
    (name: string) => {
      setUserNameState(name);
      setProgress((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, userName: name, lastUpdated: new Date().toISOString() };
        saveProgressLocal(updated);
        return updated;
      });
      if (config) scheduleSyncProgress();
    },
    [config, scheduleSyncProgress]
  );

  // -----------------------------------------------------------------------
  // Record helpers (shared pattern)
  // -----------------------------------------------------------------------

  const updateProgress = useCallback(
    (updater: (draft: ProgressData) => void) => {
      setProgress((prev) => {
        const data = prev ? { ...prev } : emptyProgress(userName);
        // Deep-clone subjects to avoid mutation
        data.subjects = { ...data.subjects };
        updater(data);
        data.lastUpdated = new Date().toISOString();
        saveProgressLocal(data);
        return data;
      });
      if (configRef.current) scheduleSyncProgress();
    },
    [userName, scheduleSyncProgress]
  );

  const appendHistory = useCallback(
    (entry: ScoreHistoryEntry) => {
      setScoreHistory((prev) => {
        const hist = prev ? { entries: [...prev.entries] } : emptyHistory();
        hist.entries.push(entry);
        saveHistoryLocal(hist);
        return hist;
      });
      if (configRef.current) scheduleSyncHistory();
    },
    [scheduleSyncHistory]
  );

  // -----------------------------------------------------------------------
  // Record scores
  // -----------------------------------------------------------------------

  const recordDailyScore = useCallback(
    async (dayId: string, tab: string, score: number, maxScore: number) => {
      const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      const now = new Date().toISOString();

      updateProgress((data) => {
        const subj = ensureSubject(data, "english");
        if (!subj.dailyCompleted[dayId]) {
          subj.dailyCompleted[dayId] = {
            completedAt: now,
            scores: {},
          };
        }
        subj.dailyCompleted[dayId].scores[tab as keyof typeof subj.dailyCompleted[string]["scores"]] = pct;
        subj.dailyCompleted[dayId].completedAt = now;
        data.subjects["english"] = { ...subj };
      });

      appendHistory({
        id: `${dayId}-${tab}`,
        subject: "english",
        date: now,
        score,
        maxScore,
      });
    },
    [updateProgress, appendHistory]
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

      updateProgress((data) => {
        const subj = ensureSubject(data, "math");
        if (!subj.chapterScores[chapterId]) {
          subj.chapterScores[chapterId] = { completedAt: now };
        }
        if (type === "exercise") {
          subj.chapterScores[chapterId].exerciseScore = pct;
        } else {
          subj.chapterScores[chapterId].examPrepScore = pct;
        }
        subj.chapterScores[chapterId].completedAt = now;
        data.subjects["math"] = { ...subj };
      });

      appendHistory({
        id: `${chapterId}-${type}`,
        subject: "math",
        date: now,
        score,
        maxScore,
      });
    },
    [updateProgress, appendHistory]
  );

  const recordQuestComplete = useCallback(
    async (questId: string) => {
      const now = new Date().toISOString();

      updateProgress((data) => {
        const subj = ensureSubject(data, "english");
        subj.questCompleted[questId] = { completedAt: now };
        data.subjects["english"] = { ...subj };
      });
    },
    [updateProgress]
  );

  // -----------------------------------------------------------------------
  // Read scores
  // -----------------------------------------------------------------------

  const getDailyScores = useCallback(
    (dayId: string): Record<string, number> | null => {
      const subj = progress?.subjects?.["english"];
      if (!subj?.dailyCompleted[dayId]) return null;
      const scores = subj.dailyCompleted[dayId].scores;
      // Return only defined scores
      const result: Record<string, number> = {};
      for (const [k, v] of Object.entries(scores)) {
        if (v !== undefined) result[k] = v;
      }
      return Object.keys(result).length > 0 ? result : null;
    },
    [progress]
  );

  const getChapterScores = useCallback(
    (
      chapterId: string
    ): { exerciseScore?: number; examPrepScore?: number } | null => {
      const subj = progress?.subjects?.["math"];
      if (!subj?.chapterScores[chapterId]) return null;
      const { exerciseScore, examPrepScore } = subj.chapterScores[chapterId];
      if (exerciseScore === undefined && examPrepScore === undefined) return null;
      return { exerciseScore, examPrepScore };
    },
    [progress]
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

  // -----------------------------------------------------------------------
  // Context value
  // -----------------------------------------------------------------------

  const value: ProgressContextType = {
    progress,
    scoreHistory,
    isLoggedIn: config !== null,
    isSyncing,
    userName,
    configInfo: config ? { owner: config.owner, repo: config.repo } : null,

    login,
    logout,
    setUserName,

    recordDailyScore,
    recordChapterScore,
    recordQuestComplete,

    getDailyScores,
    getChapterScores,
    getScoreHistory,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
