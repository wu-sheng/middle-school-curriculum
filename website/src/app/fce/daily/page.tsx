import { loadAllFceDays, loadFceDaily } from "@/lib/loadFce";
import Link from "next/link";
import DayBadge from "@/components/DayBadge";

export default function FCEDailyListPage() {
  const allDays = loadAllFceDays();

  // Group days by month
  const months: { month: number; quest: string; days: typeof allDays }[] = [];
  for (const day of allDays) {
    const m = Math.ceil(day.dayOffset / 30);
    let group = months.find((g) => g.month === m);
    if (!group) {
      const schedule = loadFceDaily(m);
      group = { month: m, quest: schedule?.quest ?? "", days: [] };
      months.push(group);
    }
    group.days.push(day);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/fce" className="text-sm text-gray-400 hover:text-purple-500 transition-colors">
            ← FCE Adventure
          </Link>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          📅 Daily Practice
        </h1>
        <p className="text-gray-500 mt-1">每日练习</p>
        <p className="text-sm text-gray-400 mt-1">
          Every day: Reading + Vocabulary + Grammar + Use of English. Writing on weekends.
        </p>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-100 border border-green-300" /> 90+ ★</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-blue-100 border border-blue-300" /> 75-89 ✓</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-amber-100 border border-amber-300" /> 60-74</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-100 border border-red-300" /> &lt;60</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-white border border-purple-100" /> not started</span>
        </div>
      </div>

      {/* Months */}
      {months.map((group) => (
        <div key={group.month} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-semibold text-purple-700">
              Month {group.month}
              <span className="text-sm text-gray-400 font-normal ml-2">第{group.month}月</span>
            </h2>
            {group.quest && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-500 font-medium">
                {group.quest}
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {group.days.map((day) => (
              <DayBadge
                key={day.id}
                dayId={day.id}
                dayOffset={day.dayOffset}
                hasWriting={!!day.writing}
              />
            ))}
          </div>

          <div className="mt-2 text-xs text-gray-300">
            {group.days.length} days · Vocab: {group.days[0]?.newVocab[0]}–{group.days[group.days.length - 1]?.newVocab[group.days[group.days.length - 1].newVocab.length - 1]}
            {group.days.some(d => d.writing) && <span className="ml-2">· ✍️ = writing day</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
