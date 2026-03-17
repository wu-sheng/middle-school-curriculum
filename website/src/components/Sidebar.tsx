"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang, getUi, biPick, type Lang } from "@/lib/i18n";

interface SidebarChapter {
  id: string;
  number: number;
  name: string;
  nameEn: string;
  hasContent: boolean;
}

interface SidebarSemester {
  id: string;
  name: string;
  nameEn: string;
  chapters: SidebarChapter[];
}

interface SidebarGrade {
  id: string;
  name: string;
  nameEn: string;
  semesters: SidebarSemester[];
}

interface SidebarSubject {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  grades: SidebarGrade[];
}

interface SidebarProps {
  subjects: SidebarSubject[];
  currentPath?: string;
}

export default function Sidebar({ subjects, currentPath }: SidebarProps) {
  const { lang, setLang } = useLang();
  const ui = getUi(lang);

  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    new Set(["math"])
  );
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(
    new Set(["grade7"])
  );
  const [expandedSemesters, setExpandedSemesters] = useState<Set<string>>(
    new Set(["semester1"])
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (
    set: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string
  ) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const n = (zh: string, en: string) => biPick(lang, zh, en);

  const nav = (
    <nav className="py-4">
      <div className="px-4 mb-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🌸</span>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              Xinbloom
            </h1>
            <p className="text-sm text-gray-400">{ui.tagline}</p>
          </div>
        </Link>
      </div>

      {/* Language toggle - segmented control */}
      <div className="px-4 mb-4">
        <div className="flex rounded-lg border border-purple-100 overflow-hidden">
          {([["both", "双语"], ["zh", "中文"], ["en", "EN"]] as [Lang, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setLang(key)}
              className={`flex-1 py-1.5 text-sm font-medium transition-colors ${
                lang === key
                  ? "bg-gradient-to-r from-pink-200 to-purple-200 text-purple-700"
                  : "text-gray-400 hover:bg-purple-50/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {subjects.map((subject) => (
        <div key={subject.id} className="mb-2">
          <button
            onClick={() =>
              toggle(expandedSubjects, setExpandedSubjects, subject.id)
            }
            className="w-full px-4 py-2 flex items-center gap-2 text-left hover:bg-pink-50/50 transition-colors rounded-r-xl"
          >
            <span>{subject.icon}</span>
            <span className="font-medium text-gray-600">
              {n(subject.name, subject.nameEn)}
            </span>
            <span
              className={`ml-auto text-xs text-gray-400 transition-transform ${
                expandedSubjects.has(subject.id) ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
          </button>

          {expandedSubjects.has(subject.id) &&
            subject.grades.map((grade) => (
              <div key={grade.id} className="ml-4">
                <button
                  onClick={() =>
                    toggle(expandedGrades, setExpandedGrades, grade.id)
                  }
                  className="w-full px-4 py-1.5 flex items-center gap-2 text-left text-sm hover:bg-purple-50/50 transition-colors rounded-r-xl"
                >
                  <span className="text-purple-300">📚</span>
                  <span className="text-gray-500">
                    {n(grade.name, grade.nameEn)}
                  </span>
                  <span
                    className={`ml-auto text-xs text-gray-400 transition-transform ${
                      expandedGrades.has(grade.id) ? "rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                </button>

                {expandedGrades.has(grade.id) &&
                  grade.semesters.map((semester) => (
                    <div key={semester.id} className="ml-4">
                      <button
                        onClick={() =>
                          toggle(
                            expandedSemesters,
                            setExpandedSemesters,
                            semester.id
                          )
                        }
                        className="w-full px-4 py-1.5 flex items-center gap-2 text-left text-sm hover:bg-pink-50/30 transition-colors rounded-r-xl"
                      >
                        <span className="text-pink-200">📖</span>
                        <span className="text-gray-500">
                          {n(semester.name, semester.nameEn)}
                        </span>
                        <span
                          className={`ml-auto text-xs text-gray-400 transition-transform ${
                            expandedSemesters.has(semester.id)
                              ? "rotate-90"
                              : ""
                          }`}
                        >
                          ▶
                        </span>
                      </button>

                      {expandedSemesters.has(semester.id) && (
                        <div className="ml-4 py-1">
                          {semester.chapters.map((ch) => {
                            const href = ch.hasContent
                              ? `/lesson/${subject.id}/${grade.id}/${ch.id}`
                              : "#";
                            const isActive =
                              currentPath ===
                              `/lesson/${subject.id}/${grade.id}/${ch.id}`;
                            return (
                              <Link
                                key={ch.id}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-1.5 text-sm rounded-r-xl transition-colors ${
                                  isActive
                                    ? "bg-gradient-to-r from-pink-50 to-purple-50 text-purple-500 font-medium border-l-2 border-purple-300"
                                    : ch.hasContent
                                    ? "text-gray-500 hover:bg-gray-50 hover:text-purple-400"
                                    : "text-gray-300 cursor-not-allowed"
                                }`}
                              >
                                {lang === "en"
                                  ? `Ch.${ch.number} ${ch.nameEn}`
                                  : `第${ch.number}章 ${ch.name}`}
                                {!ch.hasContent && (
                                  <span className="ml-1 text-xs text-gray-300">
                                    {ui.comingSoon}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}

          {subject.grades.length === 0 && expandedSubjects.has(subject.id) && (
            <div className="ml-8 px-4 py-2 text-sm text-gray-300">
              {ui.building}
            </div>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white rounded-full shadow-lg p-2 border border-pink-100"
      >
        <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-pink-50 z-40 overflow-y-auto transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </aside>
    </>
  );
}
