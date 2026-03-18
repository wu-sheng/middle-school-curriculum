import { loadAllFceDays, loadFceDaily } from "@/lib/loadFce";
import Link from "next/link";

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
    <div className="max-w-3xl mx-auto px-4 py-8">
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
        <p className="text-sm text-gray-400">
          每天：阅读 + 词汇 + 语法 + 词形转换，周末加写作。
        </p>
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
            {group.days.map((day) => {
              const hasWriting = !!day.writing;
              return (
                <Link
                  key={day.id}
                  href={`/fce/daily/${day.id}`}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium border transition-colors hover:shadow-sm ${
                    hasWriting
                      ? "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 text-pink-600 hover:border-pink-400"
                      : "bg-white border-purple-100 text-purple-500 hover:border-purple-300"
                  }`}
                >
                  <span className="text-base font-bold">{day.dayOffset}</span>
                  {hasWriting && <span className="text-[10px] text-pink-400 -mt-0.5">✍️</span>}
                </Link>
              );
            })}
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
