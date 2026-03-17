"use client";

import { useCallback, useRef } from "react";

interface AudioWordProps {
  word: string;
  lang?: string;
  className?: string;
}

/**
 * Displays a word with a speaker button that uses the Web Speech API
 * to pronounce it.
 */
export default function AudioWord({ word, lang = "en-US", className = "" }: AudioWordProps) {
  const speakingRef = useRef(false);

  const speak = useCallback(() => {
    if (speakingRef.current || typeof window === "undefined" || !window.speechSynthesis) return;
    speakingRef.current = true;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.onend = () => { speakingRef.current = false; };
    utterance.onerror = () => { speakingRef.current = false; };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [word, lang]);

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
      {word}
      <button
        onClick={speak}
        className="text-gray-300 hover:text-purple-400 transition-colors"
        title={`Pronounce "${word}"`}
        aria-label={`Pronounce ${word}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5.586v12.828a1 1 0 01-1.707.707L5.586 15z" />
        </svg>
      </button>
    </span>
  );
}
