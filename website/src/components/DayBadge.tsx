"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progressContext";

interface DayBadgeProps {
  dayId: string;
  dayOffset: number;
  hasWriting: boolean;
}

/**
 * Score-based color:
 * - 90+   green
 * - 75-89 blue
 * - 60-74 amber
 * - <60   red
 * - no score: default (white/pink)
 */
function scoreStyle(avg: number | null, hasWriting: boolean) {
  if (avg === null) {
    // Not completed
    return hasWriting
      ? "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 text-pink-600 hover:border-pink-400"
      : "bg-white border-purple-100 text-purple-500 hover:border-purple-300";
  }
  if (avg >= 90) return "bg-green-50 border-green-300 text-green-700 hover:border-green-500";
  if (avg >= 75) return "bg-blue-50 border-blue-300 text-blue-700 hover:border-blue-500";
  if (avg >= 60) return "bg-amber-50 border-amber-300 text-amber-700 hover:border-amber-500";
  return "bg-red-50 border-red-300 text-red-700 hover:border-red-500";
}

function scoreIcon(avg: number | null) {
  if (avg === null) return null;
  if (avg >= 90) return "★";
  if (avg >= 75) return "✓";
  if (avg >= 60) return "·";
  return "✗";
}

export default function DayBadge({ dayId, dayOffset, hasWriting }: DayBadgeProps) {
  const { isDayCompleted, getDayAverageScore } = useProgress();
  const completed = isDayCompleted(dayId);
  const avg = completed ? getDayAverageScore(dayId) : null;

  return (
    <Link
      href={`/fce/daily/${dayId}`}
      className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium border transition-colors hover:shadow-sm ${scoreStyle(avg, hasWriting)}`}
    >
      <span className="text-base font-bold">{dayOffset}</span>
      {avg !== null ? (
        <span className="text-[10px] -mt-0.5">{scoreIcon(avg)}</span>
      ) : hasWriting ? (
        <span className="text-[10px] text-pink-400 -mt-0.5">✍️</span>
      ) : null}
    </Link>
  );
}
