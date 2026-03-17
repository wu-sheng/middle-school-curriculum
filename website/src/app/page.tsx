"use client";

import Link from "next/link";
import { useLang, getUi, biPick } from "@/lib/i18n";

// Duplicated here since this is a client component - curriculum is small enough
// In production we'd use server component + client wrapper pattern
import { loadCurriculumClient } from "@/lib/curriculumClient";

const animalGuides: Record<string, { emoji: string; zh: string; en: string }> = {
  math: { emoji: "🐨", zh: "考拉老师", en: "Koala" },
  physics: { emoji: "🦙", zh: "羊驼老师", en: "Alpaca" },
  chemistry: { emoji: "🐼", zh: "熊猫老师", en: "Panda" },
  biology: { emoji: "🐨", zh: "考拉老师", en: "Koala" },
};

export default function HomePage() {
  const { lang } = useLang();
  const ui = getUi(lang);
  const curriculum = loadCurriculumClient();

  const n = (zh: string, en: string) => biPick(lang, zh, en);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="flex justify-center gap-3 text-5xl mb-4">
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>🐨</span>
          <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>🦙</span>
          <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>🐼</span>
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            Xinbloom
          </span>
        </h1>
        <p className="text-lg text-purple-300 mb-4">{ui.tagline} 🌸</p>
        <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed whitespace-pre-line">
          {ui.heroDesc}
        </p>
      </div>

      {/* Subject cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {curriculum.subjects.map((subject) => {
          const guide = animalGuides[subject.id] ?? animalGuides.math;
          const guideName = lang === "en" ? guide.en : guide.zh;
          return (
            <div
              key={subject.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <span className="absolute -bottom-2 -right-2 text-7xl opacity-[0.06] pointer-events-none select-none">
                {guide.emoji}
              </span>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{guide.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-600">
                    {n(subject.name, subject.nameEn)}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {n(subject.nameEn, subject.name)} · {guideName}{lang === "zh" ? "带你学" : " guides you"}
                  </p>
                </div>
              </div>

              {subject.grades.length > 0 ? (
                <div className="space-y-3">
                  {subject.grades.map((grade) =>
                    grade.semesters.map((semester) => (
                      <div key={semester.id}>
                        <h3 className="text-base font-medium text-purple-400 mb-2">
                          {n(grade.name, grade.nameEn)} · {n(semester.name, semester.nameEn)}
                        </h3>
                        <div className="space-y-1">
                          {semester.chapters.map((ch) => (
                            <Link
                              key={ch.id}
                              href={
                                ch.hasContent
                                  ? `/lesson/${subject.id}/${grade.id}/${ch.id}`
                                  : "#"
                              }
                              className={`block text-base px-3 py-2 rounded-xl transition-colors ${
                                ch.hasContent
                                  ? "text-gray-500 hover:bg-gradient-to-r hover:from-pink-50/60 hover:to-purple-50/60 hover:text-purple-400"
                                  : "text-gray-300 cursor-not-allowed"
                              }`}
                            >
                              <span className="mr-2">
                                {ui.chapter}{ch.number}{ui.chapterSuffix}
                              </span>
                              {n(ch.name, ch.nameEn)}
                              {ch.hasContent && (
                                <span className="ml-2 text-sm text-pink-300">
                                  ✦ {ui.canLearn}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-base text-gray-300 py-4 text-center">
                  {ui.building}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-pink-50/60 to-purple-50/60 rounded-2xl p-6 mb-8 text-center border border-pink-50">
        <p className="text-2xl mb-2">🐨 🌸 🦙 🌸 🐼</p>
        <p className="text-base text-purple-400 font-medium">{ui.encouragement}</p>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 border-t border-pink-50 pt-6">
        <p>{ui.footer}</p>
      </div>
    </div>
  );
}
