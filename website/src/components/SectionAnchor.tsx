"use client";

import { useState, useCallback } from "react";
import { useProgress } from "@/lib/progressContext";

interface SectionAnchorProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "div";
}

/**
 * Wraps a section heading with an anchor ID, a copy-link button, and a bookmark button.
 */
export default function SectionAnchor({ id, children, className = "", as: Tag = "h2" }: SectionAnchorProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { isLoggedIn, recordBookmark } = useProgress();

  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [id]);

  const handleBookmark = useCallback(() => {
    const path = `${window.location.pathname}#${id}`;
    const label = typeof children === "string" ? children : id.replace(/-/g, " ");
    recordBookmark(path, typeof label === "string" ? label : id);
    setBookmarked(true);
    setTimeout(() => setBookmarked(false), 1500);
  }, [id, children, recordBookmark]);

  return (
    <Tag id={id} className={`${className} group relative scroll-mt-24`}>
      {children}
      <span className="ml-2 inline-flex gap-1 opacity-30 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="text-gray-300 hover:text-purple-400 inline-flex items-center"
          aria-label="Copy link to this section"
        >
          {copied ? (
            <span className="text-green-500 text-xs font-normal">Copied!</span>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        </button>
        {isLoggedIn && (
          <button
            onClick={handleBookmark}
            className="text-gray-300 hover:text-pink-400 inline-flex items-center"
            aria-label="Bookmark this section"
          >
            {bookmarked ? (
              <span className="text-pink-500 text-xs font-normal">Saved!</span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
        )}
      </span>
    </Tag>
  );
}
