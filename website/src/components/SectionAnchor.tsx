"use client";

import { useState, useCallback } from "react";

interface SectionAnchorProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "div";
}

/**
 * Wraps a section heading with an anchor ID and a copy-link button.
 * Clicking the link icon copies the full URL (with hash) to clipboard.
 */
export default function SectionAnchor({ id, children, className = "", as: Tag = "h2" }: SectionAnchorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [id]);

  return (
    <Tag id={id} className={`${className} group relative scroll-mt-24`}>
      {children}
      <button
        onClick={handleCopy}
        className="ml-2 opacity-30 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-gray-300 hover:text-purple-400 inline-flex items-center"
        title="Copy link"
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
    </Tag>
  );
}
