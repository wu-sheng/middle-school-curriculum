import { loadCurriculum } from "@/lib/loadYaml";
import { loadAllFceDays } from "@/lib/loadFce";
import Link from "next/link";

export default function FCEDashboard() {
  const curriculum = loadCurriculum();
  const english = curriculum.subjects.find((s) => s.id === "english");
  const fce = english?.grades.find((g) => g.id === "fce");
  const allDays = loadAllFceDays();

  if (!fce) return <div className="p-8">FCE course not found.</div>;

  // Group days by month for the daily practice section
  const months: { month: number; days: typeof allDays }[] = [];
  for (const day of allDays) {
    const m = Math.ceil(day.dayOffset / 30);
    let group = months.find((g) => g.month === m);
    if (!group) {
      group = { month: m, days: [] };
      months.push(group);
    }
    group.days.push(day);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          🏝️ FCE Adventure
        </h1>
        <p className="text-lg text-gray-500 mt-2">FCE 冒险岛</p>
        <p className="text-sm text-gray-400 mt-1">
          15-month journey from B1 to B2 · 25 min/day
        </p>
        <p className="text-sm text-gray-400">
          15个月从 B1 进阶到 B2 · 每天25分钟
        </p>
      </div>

      {/* Two-column layout: Quest Map + Daily Practice */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* Left: Quest Knowledge Modules */}
        <div className="bg-white rounded-2xl border border-purple-100 p-5">
          <h2 className="text-lg font-bold text-purple-700 mb-1 flex items-center gap-2">
            <span>📖</span> Quest Modules
          </h2>
          <p className="text-sm text-gray-400 mb-4">知识模块 · 学习新概念</p>

          <div className="space-y-2">
            {fce.semesters.map((phase) => (
              <div key={phase.id}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-1.5">
                  {phase.nameEn}
                  <span className="ml-1 normal-case text-gray-300">({phase.name})</span>
                </p>
                {phase.chapters.map((ch) => (
                  <Link
                    key={ch.id}
                    href={ch.hasContent ? `/fce/quest/${ch.id}` : "#"}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      ch.hasContent
                        ? "hover:bg-purple-50 text-gray-700"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                      ch.hasContent
                        ? "bg-gradient-to-r from-pink-200 to-purple-200 text-purple-600"
                        : "bg-gray-100 text-gray-300"
                    }`}>
                      {ch.number}
                    </span>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate ${ch.hasContent ? "" : "text-gray-300"}`}>
                        {ch.nameEn}
                      </div>
                      <div className="text-xs text-gray-400 truncate">{ch.name}</div>
                    </div>
                    {ch.hasContent && (
                      <span className="ml-auto text-purple-300 text-xs">→</span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Daily Practice */}
        <div className="bg-white rounded-2xl border border-pink-100 p-5">
          <h2 className="text-lg font-bold text-pink-600 mb-1 flex items-center gap-2">
            <span>📅</span> Daily Practice
          </h2>
          <p className="text-sm text-gray-400 mb-4">每日练习 · 阅读+词汇+语法+写作</p>

          {months.map((group) => (
            <div key={group.month} className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Month {group.month}
                <span className="ml-1 normal-case text-gray-300">(第{group.month}月)</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.days.map((day) => (
                  <Link
                    key={day.id}
                    href={`/fce/daily/${day.id}`}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-xs font-medium bg-pink-50 border border-pink-100 text-pink-500 hover:bg-pink-100 hover:border-pink-300 transition-colors"
                  >
                    {day.dayOffset}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <p className="text-xs text-gray-300 mt-2">
            {allDays.length} days available · 已准备 {allDays.length} 天
          </p>
        </div>
      </div>

      {/* Course Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Quests", labelZh: "知识模块", value: "12", icon: "📖" },
          { label: "Readings", labelZh: "阅读材料", value: "30", icon: "📄" },
          { label: "Vocabulary", labelZh: "核心词汇", value: "300", icon: "📝" },
          { label: "Exercises", labelZh: "练习题", value: "500+", icon: "🧩" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-xl font-bold text-purple-600 mt-1">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
            <div className="text-xs text-gray-300">{stat.labelZh}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
