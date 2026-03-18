// GitHub sync service for reading/writing progress data to a private repo
// Uses the GitHub Contents API (https://docs.github.com/en/rest/repos/contents)

const STORAGE_KEY = "xinbloom-github-config";
const API_BASE = "https://api.github.com";

export interface GitHubConfig {
  token: string;
  repo: string; // e.g. "xinbloom-progress"
  owner: string; // auto-detected from token
}

/** Save config to localStorage */
export function saveGitHubConfig(config: GitHubConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    console.error("[githubSync] Failed to save config to localStorage");
  }
}

/** Load config from localStorage. Returns null if not configured. */
export function loadGitHubConfig(): GitHubConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.token && parsed.repo && parsed.owner) {
      return parsed as GitHubConfig;
    }
    return null;
  } catch {
    return null;
  }
}

/** Clear config from localStorage */
export function clearGitHubConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error("[githubSync] Failed to clear config from localStorage");
  }
}

/** Fetch the authenticated user's login name (to auto-detect owner) */
export async function fetchGitHubUser(token: string): Promise<string> {
  const res = await fetch(`${API_BASE}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch GitHub user (${res.status}): ${body}`
    );
  }

  const user = await res.json();
  if (!user.login) {
    throw new Error("GitHub API did not return a login name");
  }
  return user.login as string;
}

/**
 * Read a JSON file from the repo.
 * Returns { data, sha } on success, or null if the file doesn't exist (404).
 */
export async function readProgressFile(
  config: GitHubConfig,
  path: string
): Promise<{ data: unknown; sha: string } | null> {
  const url = `${API_BASE}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to read ${path} (${res.status}): ${body}`
    );
  }

  const file = await res.json();

  if (file.type !== "file" || !file.content) {
    throw new Error(`Path ${path} is not a file or has no content`);
  }

  // GitHub returns base64-encoded content (may contain newlines)
  const decoded = atob(file.content.replace(/\n/g, ""));
  const data = JSON.parse(decoded);

  return { data, sha: file.sha as string };
}

/**
 * Write (create or update) a JSON file in the repo.
 * Pass sha for updates (required to prevent conflicts), or null for new files.
 * Returns the new SHA after write.
 */
export async function writeProgressFile(
  config: GitHubConfig,
  path: string,
  data: unknown,
  sha: string | null
): Promise<string> {
  const url = `${API_BASE}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${path}`;

  const jsonStr = JSON.stringify(data, null, 2);
  const encoded = btoa(unescape(encodeURIComponent(jsonStr)));

  const body: Record<string, unknown> = {
    message: sha
      ? `Update ${path} — Xinbloom progress sync`
      : `Create ${path} — Xinbloom progress sync`,
    content: encoded,
  };
  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(
      `Failed to write ${path} (${res.status}): ${errBody}`
    );
  }

  const result = await res.json();
  return result.content.sha as string;
}
