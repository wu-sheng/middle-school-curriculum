"use client";

import { useCallback, useRef } from "react";

interface AudioWordProps {
  word: string;
  /** Optional path to a pre-generated .mp3 file (e.g. "/audio/english/fce/vocab/V0001.mp3") */
  audioSrc?: string;
  lang?: string;
  className?: string;
}

/**
 * Displays a word with a speaker button.
 * Plays pre-generated .mp3 if audioSrc is provided, otherwise falls back to Web Speech API.
 */
export default function AudioWord({ word, audioSrc, lang = "en-US", className = "" }: AudioWordProps) {
  const playingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(() => {
    if (playingRef.current) return;
    playingRef.current = true;

    // Try .mp3 file first
    if (audioSrc) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioSrc);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.onended = () => { playingRef.current = false; };
      audioRef.current.onerror = () => {
        // Fallback to Web Speech API if mp3 fails
        playingRef.current = false;
        speakWithTTS();
      };
      audioRef.current.play().catch(() => {
        playingRef.current = false;
        speakWithTTS();
      });
      return;
    }

    speakWithTTS();

    function speakWithTTS() {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        playingRef.current = false;
        return;
      }
      playingRef.current = true;
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.onend = () => { playingRef.current = false; };
      utterance.onerror = () => { playingRef.current = false; };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [word, audioSrc, lang]);

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
      {word}
      <button
        onClick={speak}
        className="text-gray-300 hover:text-purple-400 transition-colors"
        aria-label={`Pronounce ${word}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5.586v12.828a1 1 0 01-1.707.707L5.586 15z" />
        </svg>
      </button>
    </span>
  );
}
