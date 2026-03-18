"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLang, biPick } from "@/lib/i18n";
import { useProgress } from "@/lib/progressContext";
import { BiLabel, BiBlock } from "./BiText";
import Collapsible from "./Collapsible";
import AudioWord from "./AudioWord";

/* ---------- Types ---------- */

interface RuleExample {
  base?: string;
  transformed?: string;
  sentence: string;
  sentenceZh: string;
  highlight?: string;
}

interface Rule {
  // Q01 format
  pattern?: string;
  meaning?: string;
  meaningZh?: string;
  // Q02 format
  name?: string;
  nameZh?: string;
  structure?: string;
  usage?: string;
  usageZh?: string;
  examples: RuleExample[];
}

interface PracticeQuestion {
  id: string;
  question: string;
  questionZh: string;
  answer: string;
  explanation: string;
  explanationZh: string;
}

interface FCELesson {
  id: string;
  title: string;
  titleZh: string;
  introduction: string;
  introductionZh: string;
  rules: Rule[];
  tips: string[];
  tipsZh: string[];
  practicePreview: PracticeQuestion[];
}

interface FCEQuest {
  id: string;
  title: string;
  titleZh: string;
  subtitle: string;
  subtitleZh: string;
  month: number;
  fceMapping: string;
  theme: {
    setting: string;
    settingZh: string;
    mascot: string;
    mascotZh: string;
  };
  objectives: string[];
  objectivesZh: string[];
  lessons: FCELesson[];
}

/* ---------- Sub-components ---------- */

/** Renders the quest header with gradient background */
function QuestHeader({ quest, lang }: { quest: FCEQuest; lang: string }) {
  const title = biPick(lang as "zh" | "en" | "both", quest.titleZh, quest.title);
  const subtitle = biPick(lang as "zh" | "en" | "both", quest.subtitleZh, quest.subtitle);
  const mascot = biPick(
    lang as "zh" | "en" | "both",
    quest.theme.mascotZh,
    quest.theme.mascot
  );
  const setting = biPick(
    lang as "zh" | "en" | "both",
    quest.theme.settingZh,
    quest.theme.setting
  );

  return (
    <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-200/60 text-purple-700 text-sm font-medium">
          Month {quest.month}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-200/60 text-pink-700 text-sm font-medium">
          {quest.fceMapping}
        </span>
        <span className="text-lg">{mascot}</span>
      </div>

      {lang === "both" ? (
        <>
          <h1 className="text-2xl font-bold text-purple-800 mb-1">{quest.title}</h1>
          <p className="text-sm text-gray-400 mb-2">{quest.titleZh}</p>
          <p className="text-purple-700">{quest.subtitle}</p>
          <p className="text-sm text-gray-400 mt-0.5">{quest.subtitleZh}</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-purple-800 mb-1">{title}</h1>
          <p className="text-purple-700 mt-1">{subtitle}</p>
        </>
      )}

      <p className="mt-3 text-sm text-purple-600/70 italic">
        {lang === "both" ? (
          <>
            {quest.theme.setting}
            <span className="block text-gray-400 text-xs mt-0.5">{quest.theme.settingZh}</span>
          </>
        ) : (
          setting
        )}
      </p>
    </div>
  );
}

/** Renders learning objectives */
function ObjectivesSection({ quest, lang }: { quest: FCEQuest; lang: string }) {
  const labelZh = "学习目标";
  const labelEn = "Learning Objectives";

  // FCE: English is primary in "both" mode
  const items =
    lang === "zh"
      ? (quest.objectivesZh || quest.objectives || [])
      : (quest.objectives || []);

  const itemsSecondary = lang === "both" ? (quest.objectivesZh || []) : [];

  return (
    <div className="bg-white border border-purple-100 rounded-xl p-5 mb-6">
      <h2 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
        <span>🎯</span>
        <BiLabel zh={labelZh} en={labelEn} />
      </h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 leading-relaxed">
            <span className="text-pink-400 mt-1 shrink-0">●</span>
            <div>
              <span>{item}</span>
              {lang === "both" && itemsSecondary[i] && (
                <span className="block text-sm text-gray-400 mt-0.5">{itemsSecondary[i]}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Rules table for a lesson */
function RulesTable({ rules, lang }: { rules: Rule[]; lang: string }) {
  return (
    <div className="space-y-4">
      {rules.map((rule, ri) => {
        // Support both Q01 format (pattern/meaning) and Q02 format (name/structure/usage)
        const heading = rule.pattern || rule.name || rule.structure || "";
        const descZh = rule.meaningZh || rule.usageZh || "";
        const descEn = rule.meaning || rule.usage || "";
        const hasStructure = !!rule.structure && !!rule.name;

        return (
        <div key={ri} className="border border-purple-100 rounded-xl overflow-hidden">
          {/* Rule header */}
          <div className="bg-purple-50/50 px-4 py-3 border-b border-purple-100">
            <span className="font-semibold text-purple-700 mr-3">{heading}</span>
            {hasStructure && rule.nameZh && (
              <span className="text-sm text-gray-400 mr-2">({rule.nameZh})</span>
            )}
            {hasStructure && rule.structure && (
              <div className="mt-1 text-sm text-purple-500 font-mono bg-purple-50 px-2 py-1 rounded inline-block">{rule.structure}</div>
            )}
            <div className="mt-1">
            {lang === "both" ? (
              <>
                <span className="text-gray-700">{descEn}</span>
                {descZh && <span className="block text-sm text-gray-400 mt-0.5">{descZh}</span>}
              </>
            ) : (
              <span className="text-gray-700">
                {biPick(lang as "zh" | "en" | "both", descZh, descEn)}
              </span>
            )}
            </div>
          </div>

          {/* Examples */}
          <div className="divide-y divide-gray-50">
            {rule.examples.map((ex, ei) => (
              <div
                key={ei}
                className={`px-4 py-3 ${ei % 2 === 0 ? "bg-white" : "bg-pink-50/20"}`}
              >
                {/* Q01 format: base → transformed */}
                {ex.base && ex.transformed && (
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <AudioWord word={ex.base} className="text-gray-700" />
                    <span className="text-purple-400">→</span>
                    <AudioWord word={ex.transformed} className="text-purple-700" />
                  </div>
                )}
                {/* Q02 format: highlight the tense form */}
                {ex.highlight && (
                  <div className="mb-1">
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-mono">{ex.highlight}</span>
                  </div>
                )}
                {lang === "both" ? (
                  <>
                    <p className="text-sm text-gray-600 italic">{ex.sentence}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{ex.sentenceZh}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 italic">
                    {biPick(lang as "zh" | "en" | "both", ex.sentenceZh, ex.sentence)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        );
      })}
    </div>
  );
}

/** Tips section */
function TipsSection({ tips, tipsZh, lang }: { tips: string[]; tipsZh: string[]; lang: string }) {
  // FCE: English primary in "both" mode
  const items = lang === "zh" ? tipsZh : tips;
  const itemsSecondary = lang === "both" ? tipsZh : [];

  return (
    <div className="space-y-2 mt-4">
      {items.map((tip, i) => (
        <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200/50 rounded-lg px-4 py-3">
          <span className="shrink-0 mt-0.5">⚡</span>
          <div className="leading-relaxed">
            <span>{tip}</span>
            {lang === "both" && itemsSecondary[i] && (
              <span className="block text-sm text-gray-400 mt-0.5">{itemsSecondary[i]}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Single practice question with answer checking */
function PracticeItem({ q, lang }: { q: PracticeQuestion; lang: string }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);

  const isCorrect =
    checked && userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
  const isWrong = checked && !isCorrect;

  const handleCheck = () => {
    if (userAnswer.trim()) setChecked(true);
  };

  const handleRetry = () => {
    setUserAnswer("");
    setChecked(false);
  };

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white">
      {/* Question */}
      <div className="mb-3">
        {lang === "both" ? (
          <>
            <p className="text-gray-800 font-medium">{q.question}</p>
            <p className="text-sm text-gray-400 mt-0.5">{q.questionZh}</p>
          </>
        ) : (
          <p className="text-gray-800 font-medium">
            {biPick(lang as "zh" | "en" | "both", q.questionZh, q.question)}
          </p>
        )}
      </div>

      {/* Input + Check */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            if (checked) setChecked(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCheck();
          }}
          placeholder={biPick(lang as "zh" | "en" | "both", "输入答案...", "Type your answer...")}
          className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${
            isCorrect
              ? "border-green-300 bg-green-50"
              : isWrong
              ? "border-red-300 bg-red-50"
              : "border-gray-200 focus:border-purple-300"
          }`}
          disabled={isCorrect}
        />
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!userAnswer.trim()}
            className="px-4 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <BiLabel zh="检查" en="Check" />
          </button>
        ) : isWrong ? (
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors"
          >
            <BiLabel zh="重试" en="Retry" />
          </button>
        ) : null}
      </div>

      {/* Result feedback */}
      {isCorrect && (
        <p className="text-green-600 text-sm font-medium flex items-center gap-1 mb-2">
          <span>✓</span>
          <BiLabel zh="正确！" en="Correct!" />
        </p>
      )}
      {isWrong && (
        <p className="text-red-500 text-sm font-medium flex items-center gap-1 mb-2">
          <span>✗</span>
          <BiLabel zh="再想想..." en="Try again..." />
          <span className="text-gray-400 ml-2 font-normal">
            <BiLabel zh="正确答案：" en="Answer: " />
            <span className="text-purple-600 font-medium">{q.answer}</span>
          </span>
        </p>
      )}

      {/* Explanation (collapsible, shown after checking) */}
      {checked && (
        <Collapsible
          title={biPick(lang as "zh" | "en" | "both", "查看讲解", "View Explanation")}
          variant="answer"
        >
          <BiBlock zh={q.explanation} en={q.explanationZh} />
        </Collapsible>
      )}
    </div>
  );
}

/** Single lesson card */
function LessonCard({ lesson, lang, index }: { lesson: FCELesson; lang: string; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);

  const lessonTitle = lang === "both"
    ? `${lesson.titleZh}`
    : biPick(lang as "zh" | "en" | "both", lesson.titleZh, lesson.title);
  const lessonTitleEn = lang === "both" ? lesson.title : "";

  return (
    <div className="border border-purple-100/70 rounded-xl overflow-hidden mb-4 bg-white/80">
      {/* Lesson header (clickable) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-purple-50/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm font-bold shrink-0">
            {index + 1}
          </span>
          <div>
            <span className="font-semibold text-purple-800">{lessonTitle}</span>
            {lessonTitleEn && (
              <span className="block text-sm text-gray-400 mt-0.5">{lessonTitleEn}</span>
            )}
          </div>
        </div>
        <span
          className={`text-purple-400 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Lesson content */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-purple-50 pt-4 space-y-6">
          {/* Introduction */}
          <div>
            <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2 flex items-center gap-2">
              <span>📖</span>
              <BiLabel zh="故事引入" en="Story Introduction" />
            </h3>
            <div className="bg-purple-50/30 rounded-lg p-4 leading-relaxed">
              <BiBlock zh={lesson.introduction} en={lesson.introductionZh} />
            </div>
          </div>

          {/* Rules */}
          <div>
            <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span>📐</span>
              <BiLabel zh="规则详解" en="Rules" />
            </h3>
            <RulesTable rules={lesson.rules} lang={lang} />
          </div>

          {/* Tips */}
          {((lesson.tips && lesson.tips.length > 0) ||
            (lesson.tipsZh && lesson.tipsZh.length > 0)) && (
            <div>
              <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span>💡</span>
                <BiLabel zh="小贴士" en="Tips" />
              </h3>
              <TipsSection tips={lesson.tips || []} tipsZh={lesson.tipsZh || []} lang={lang} />
            </div>
          )}

          {/* Practice Preview */}
          {lesson.practicePreview && lesson.practicePreview.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span>✏️</span>
                <BiLabel zh="练习预览" en="Practice Preview" />
              </h3>
              <div className="space-y-3">
                {(lesson.practicePreview || []).map((q) => (
                  <PracticeItem key={q.id} q={q} lang={lang} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function FCEQuestView({ quest }: { quest: FCEQuest }) {
  const { lang } = useLang();
  // Page visit recorded by AutoRedirect after 60s

  return (
    <div className="max-w-3xl mx-auto" style={{ fontSize: 16, lineHeight: 1.7 }}>
      {/* Header */}
      <QuestHeader quest={quest} lang={lang} />

      {/* Objectives */}
      <ObjectivesSection quest={quest} lang={lang} />

      {/* Lessons */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
          <span>📚</span>
          <BiLabel zh="课程内容" en="Lessons" />
          <span className="text-sm font-normal text-gray-400 ml-1">
            ({quest.lessons.length})
          </span>
        </h2>
        {quest.lessons.map((lesson, i) => (
          <LessonCard key={lesson.id} lesson={lesson} lang={lang} index={i} />
        ))}
      </div>
    </div>
  );
}
