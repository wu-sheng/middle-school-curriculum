"use client";

import { useState } from "react";
import type { LessonContent, NumberLineConfig } from "@/lib/loadYaml";
import { useLang, getUi, biField, biArray, biBothArray } from "@/lib/i18n";
import MathText, { MathBlock } from "./MathText";
import { BiBlock } from "./BiText";
import Collapsible from "./Collapsible";
import NumberLine from "./NumberLine";
import GeometryDiagram, { hasGeometryDiagram } from "./GeometryDiagrams";

/** Render content with bilingual support: in "both" mode shows zh + en stacked */
function ContentBlock({ obj, field, className = "", lang }: {
  obj: Record<string, unknown>;
  field: string;
  className?: string;
  lang: string;
}) {
  if (lang === "both") {
    const zh = typeof obj[field] === "string" ? (obj[field] as string) : "";
    const en = typeof obj[field + "En"] === "string" ? (obj[field + "En"] as string) : "";
    return <BiBlock zh={zh} en={en} className={className} />;
  }
  return <MathBlock content={biField(obj, field, lang as "zh" | "en")} className={className} />;
}

/** Render array items with bilingual support */
function ContentList({ obj, field, lang, renderItem }: {
  obj: Record<string, unknown>;
  field: string;
  lang: string;
  renderItem: (zh: string, en: string, i: number) => React.ReactNode;
}) {
  if (lang === "both") {
    const both = biBothArray(obj, field);
    return <>{both.zh.map((zh, i) => renderItem(zh, both.en[i] || "", i))}</>;
  }
  const items = biArray(obj, field, lang as "zh" | "en");
  return <>{items.map((item, i) => renderItem(item, "", i))}</>;
}

/** Bilingual MathText: shows stacked zh/en in "both" mode, or single lang */
function BiMathText({ zh, en, lang }: { zh: string; en: string; lang: string }) {
  if (lang === "both") {
    return (
      <span>
        <MathText content={zh} langOverride="zh" />
        {en && <span className="block text-sm text-gray-400 mt-0.5"><MathText content={en} langOverride="en" /></span>}
      </span>
    );
  }
  return <MathText content={lang === "en" ? (en || zh) : zh} />;
}

function renderNumberLine(config: NumberLineConfig) {
  const points = config.points.map((p) =>
    typeof p === "number" ? { value: p, label: String(p) } : p
  );
  return <NumberLine points={points} min={config.min ?? -5} max={config.max ?? 5} />;
}

/** Shared grading logic for exercises and exam prep */
type QuizQuestion = LessonContent["exercises"]["questions"][0];

function getQuestionResult(
  q: QuizQuestion,
  answers: Record<string, string | string[]>,
  prefix: string,
  graded: boolean
): boolean | null {
  if (!graded) return null;
  const inputType = q.inputType || "open";
  if (inputType === "blank" || inputType === "truefalse") {
    return (answers[`${prefix}${q.number}`] as string || "").trim() === q.correctValue;
  }
  if (inputType === "choice" && q.subInputs) {
    const arr = (answers[`${prefix}${q.number}`] as string[]) || [];
    return q.subInputs.every((si, i) => arr[i] === si.correctValue);
  }
  return null;
}

function getScore(
  questions: QuizQuestion[],
  answers: Record<string, string | string[]>,
  prefix: string
) {
  let correct = 0;
  let total = 0;
  for (const q of questions) {
    if (q.inputType === "blank" || q.inputType === "truefalse") {
      total++;
      if (getQuestionResult(q, answers, prefix, true) === true) correct++;
    } else if (q.inputType === "choice" && q.subInputs) {
      for (let i = 0; i < q.subInputs.length; i++) {
        total++;
        const userVal = ((answers[`${prefix}${q.number}`] as string[]) || [])[i];
        if (userVal === q.subInputs[i].correctValue) correct++;
      }
    }
  }
  return { correct, total };
}

interface QuizTheme {
  submitBtn: string;
  currentBtn: string;
  answeredBtn: string;
  defaultBtn: string;
  navBtn: string;
}

const exerciseTheme: QuizTheme = {
  submitBtn: "bg-gradient-to-r from-pink-400 to-purple-400",
  currentBtn: "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-sm scale-110",
  answeredBtn: "bg-purple-50 text-purple-400 border border-purple-100",
  defaultBtn: "bg-gray-50 text-gray-400 border border-gray-200 hover:border-purple-200",
  navBtn: "text-purple-400 hover:bg-purple-50/50 border border-purple-100",
};

const examTheme: QuizTheme = {
  submitBtn: "bg-gradient-to-r from-amber-400 to-orange-400",
  currentBtn: "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm scale-110",
  answeredBtn: "bg-amber-50 text-amber-500 border border-amber-200",
  defaultBtn: "bg-gray-50 text-gray-400 border border-gray-200 hover:border-amber-200",
  navBtn: "text-amber-500 hover:bg-amber-50/50 border border-amber-200",
};

interface Props {
  lesson: LessonContent;
  chapterNumber: number;
  chapterNameEn: string;
}

type Tab = "learn" | "examples" | "exercises" | "exam";

export default function LessonView({ lesson, chapterNumber, chapterNameEn }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("learn");
  const { lang } = useLang();
  const ui = getUi(lang);
  const l = lesson as unknown as Record<string, unknown>;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "learn", label: ui.learn, icon: "🌸" },
    { key: "examples", label: ui.examples, icon: "🦙" },
    { key: "exercises", label: ui.exercises, icon: "🐼" },
    ...(lesson.examPrep ? [{ key: "exam" as Tab, label: ui.examPrep, icon: "🎯" }] : []),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-purple-500 mb-2">
          <span>{lang === "en" ? `Ch.${chapterNumber}` : `第${chapterNumber}章`}</span>
          <span>·</span>
          <span>{lang === "en" ? biField(l, "title", lang) : chapterNameEn}</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-3">
          {biField(l, "title", lang)}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
          <span>⏱ {biField(l, "estimatedTime", lang)}</span>
          <span>👤 {biField(l, "targetAudience", lang)}</span>
        </div>
      </div>

      {/* Learning objectives */}
      <div className="bg-gradient-to-r from-pink-50/60 to-purple-50/60 rounded-2xl p-5 mb-6 border border-pink-50">
        <h2 className="font-bold text-purple-500 mb-3 flex items-center gap-2">
          🌸 {ui.objectives}
        </h2>
        <ul className="space-y-2">
          <ContentList obj={l} field="objectives" lang={lang} renderItem={(zh, en, i) => (
            <li key={i} className="flex items-start gap-2 text-base text-gray-700">
              <span className="text-pink-300 mt-0.5">✦</span>
              <BiMathText zh={zh} en={en} lang={lang} />
            </li>
          )} />
        </ul>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-pink-50">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-base font-medium transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-sm"
                : "text-gray-500 hover:text-purple-400 hover:bg-purple-50/50"
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "learn" && <LearnTab lesson={lesson} />}
      {activeTab === "examples" && <ExamplesTab lesson={lesson} />}
      {activeTab === "exercises" && (
        <QuizSection
          questions={lesson.exercises.questions}
          prefix="q"
          sectionField="section"
          theme={exerciseTheme}
          icon="🐼"
        />
      )}
      {activeTab === "exam" && lesson.examPrep && (
        <QuizSection
          questions={lesson.examPrep.questions}
          prefix="exam"
          theme={examTheme}
          icon="🎯"
          intro={
            <div className="bg-gradient-to-r from-amber-50/60 to-orange-50/60 rounded-2xl p-5 border border-amber-100">
              <h3 className="font-bold text-amber-600 mb-2 flex items-center gap-2">
                🎯 {ui.examPrep}
              </h3>
              <p className="text-sm text-gray-500">{ui.examIntro}</p>
            </div>
          }
        />
      )}
    </div>
  );
}

function LearnTab({ lesson }: { lesson: LessonContent }) {
  const { lang } = useLang();
  const ui = getUi(lang);
  const pre = lesson.prerequisites as unknown as Record<string, unknown>;

  return (
    <div className="space-y-6">
      {/* Prerequisites */}
      <section className="bg-white rounded-2xl p-6 border border-pink-50">
        <h2 className="text-lg font-bold text-purple-500 mb-4 flex items-center gap-2">
          🦙 {biField(pre, "title", lang)}
        </h2>
        <ContentBlock obj={pre} field="intro" lang={lang} className="text-base text-gray-700 mb-4" />

        <div className="bg-green-50 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-green-600 mb-2">{ui.knownNumbers}</p>
          <div className="flex flex-wrap gap-2">
            <ContentList obj={pre} field="knownNumbers" lang={lang} renderItem={(zh, en, i) => (
              <span key={i} className="bg-white px-3 py-1 rounded-full text-sm border border-green-200">
                <BiMathText zh={zh} en={en} lang={lang} />
              </span>
            )} />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-green-600 mb-2">{ui.canSolve}</p>
          <ul className="space-y-1">
            <ContentList obj={pre} field="canSolve" lang={lang} renderItem={(zh, en, i) => (
              <li key={i} className="text-base text-gray-700 flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <BiMathText zh={zh} en={en} lang={lang} />
              </li>
            )} />
          </ul>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-orange-400 mb-2">{ui.cannotSolve}</p>
          <ul className="space-y-1">
            <ContentList obj={pre} field="cannotSolve" lang={lang} renderItem={(zh, en, i) => (
              <li key={i} className="text-base text-gray-700 flex items-start gap-2">
                <span className="text-orange-400">?</span>
                <BiMathText zh={zh} en={en} lang={lang} />
              </li>
            )} />
          </ul>
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <ContentBlock obj={pre} field="conclusion" lang={lang} className="text-base text-purple-500 font-medium" />
        </div>
      </section>

      {/* Concepts */}
      {lesson.concepts.map((concept) => {
        const c = concept as unknown as Record<string, unknown>;
        return (
          <section key={concept.id} className="bg-white rounded-2xl p-6 border border-pink-50">
            <h2 className="text-lg font-bold text-purple-500 mb-4 flex items-center gap-2">
              📌 {biField(c, "title", lang)}
            </h2>
            <ContentBlock obj={c} field="content" lang={lang} className="text-base text-gray-700 mb-4 leading-relaxed" />

            {concept.classification && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {concept.classification.map((cls, i) => {
                  const clsR = cls as unknown as Record<string, unknown>;
                  return (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
                      <span className="text-xs font-medium text-purple-500 whitespace-nowrap">
                        {biField(clsR, "name", lang)}
                      </span>
                      <span className="text-base text-gray-700">
                        <MathText content={cls.examples} />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {concept.rules && (
              <ul className="space-y-2 mb-4">
                <ContentList obj={c} field="rules" lang={lang} renderItem={(zh, en, i) => (
                  <li key={i} className="text-base text-gray-700 flex items-start gap-2">
                    <span className="text-pink-400 mt-0.5">•</span>
                    <BiMathText zh={zh} en={en} lang={lang} />
                  </li>
                )} />
              </ul>
            )}

            {concept.purposes && (
              <ul className="space-y-2 mb-4">
                <ContentList obj={c} field="purposes" lang={lang} renderItem={(zh, en, i) => (
                  <li key={i} className="text-base text-gray-700 flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">✦</span>
                    <BiMathText zh={zh} en={en} lang={lang} />
                  </li>
                )} />
              </ul>
            )}

            {concept.hasVisualization && concept.id === "number-line" && <NumberLine />}
            {concept.hasVisualization && hasGeometryDiagram(concept.id) && <GeometryDiagram conceptId={concept.id} />}

            {concept.examples && (
              <div className="bg-pink-50/50 rounded-xl p-4 mb-3">
                <p className="text-sm font-medium text-pink-400 mb-2">{ui.example}</p>
                <ul className="space-y-1">
                  <ContentList obj={c} field="examples" lang={lang} renderItem={(zh, en, i) => (
                    <li key={i} className="text-base text-gray-700">
                      <BiMathText zh={zh} en={en} lang={lang} />
                    </li>
                  )} />
                </ul>
              </div>
            )}

            {concept.notes && (
              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="text-xs font-medium text-yellow-600 mb-2">{ui.note}</p>
                <ul className="space-y-1">
                  <ContentList obj={c} field="notes" lang={lang} renderItem={(zh, en, i) => (
                    <li key={i} className="text-base text-gray-700 flex items-start gap-2">
                      <span className="text-yellow-500">⚠</span>
                      <BiMathText zh={zh} en={en} lang={lang} />
                    </li>
                  )} />
                </ul>
              </div>
            )}

            {concept.explanation && (
              <div className="bg-blue-50 rounded-xl p-4 mt-3">
                <ContentBlock obj={c} field="explanation" lang={lang} className="text-base text-blue-500" />
              </div>
            )}

            {concept.summary && (
              <div className="bg-gray-50 rounded-xl p-4 mt-3">
                <ContentBlock obj={c} field="summary" lang={lang} className="text-base text-gray-700 italic" />
              </div>
            )}
          </section>
        );
      })}

      {/* Real life */}
      <section className="bg-white rounded-2xl p-6 border border-pink-50">
        <h2 className="text-lg font-bold text-purple-500 mb-4 flex items-center gap-2">
          🐼 {ui.realLife}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lesson.realLife.map((rl, i) => {
            const r = rl as unknown as Record<string, unknown>;
            return (
              <div key={i} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4">
                <p className="text-sm font-medium text-purple-500 mb-2">{biField(r, "category", lang)}</p>
                <div className="space-y-1 text-base text-gray-700">
                  <p><span className="text-green-500 mr-1">+</span>
                    <ContentBlock obj={r} field="positive" lang={lang} className="inline" />
                  </p>
                  <p><span className="text-red-400 mr-1">−</span>
                    <ContentBlock obj={r} field="negative" lang={lang} className="inline" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Common mistakes */}
      <section className="bg-white rounded-2xl p-6 border border-red-100">
        <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
          ⚠️ {ui.commonMistakes}
        </h2>
        <ul className="space-y-3">
          <ContentList obj={lesson as unknown as Record<string, unknown>} field="commonMistakes" lang={lang} renderItem={(zh, en, i) => (
            <li key={i} className="flex items-start gap-3 text-base text-gray-700 bg-red-50/50 rounded-xl p-3">
              <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
              <BiMathText zh={zh} en={en} lang={lang} />
            </li>
          )} />
        </ul>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-purple-50">
        <h2 className="text-lg font-bold text-purple-500 mb-4 flex items-center gap-2">
          🌸 {ui.summary}
        </h2>
        <ul className="space-y-2">
          <ContentList obj={lesson as unknown as Record<string, unknown>} field="summary" lang={lang} renderItem={(zh, en, i) => (
            <li key={i} className="flex items-start gap-2 text-base text-gray-700">
              <span className="text-green-500 mt-0.5">✓</span>
              <BiMathText zh={zh} en={en} lang={lang} />
            </li>
          )} />
        </ul>
      </section>
    </div>
  );
}

function ExamplesTab({ lesson }: { lesson: LessonContent }) {
  const { lang } = useLang();
  const ui = getUi(lang);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4 bg-white rounded-xl p-3 border border-pink-50">
        <span className="text-2xl">🦙</span>
        <p>{ui.examplesGuide}</p>
      </div>

      {lesson.examples.map((ex, i) => {
        const e = ex as unknown as Record<string, unknown>;
        return (
          <div key={i} className="bg-white rounded-2xl p-6 border border-pink-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                {ui.type} {ex.type}
              </span>
              <span className="text-sm font-medium text-gray-700">{biField(e, "title", lang)}</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-400 mb-1">{ui.question}：</p>
              <ContentBlock obj={e} field="question" lang={lang} className="text-base text-gray-700" />
              {ex.numberLine && renderNumberLine(ex.numberLine)}
            </div>

            <Collapsible title={ui.showSteps} variant="step">
              <ol className="space-y-2">
                <ContentList obj={e} field="steps" lang={lang} renderItem={(zh, en, j) => (
                  <li key={j} className="flex items-start gap-2 text-base text-gray-700">
                    <span className="bg-purple-100 text-purple-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    <BiMathText zh={zh} en={en} lang={lang} />
                  </li>
                )} />
              </ol>
              {ex.stepsNumberLine && (
                <div className="mt-3 bg-purple-50/50 rounded-xl p-2">
                  {renderNumberLine(ex.stepsNumberLine)}
                </div>
              )}
            </Collapsible>

            <Collapsible title={ui.showAnswer} variant="answer">
              <div className="bg-green-50 rounded-xl p-3">
                <ContentBlock obj={e} field="answer" lang={lang} className="text-base text-green-600 font-medium" />
              </div>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}

/** Unified quiz section for both exercises and exam prep */
function QuizSection({
  questions,
  prefix,
  sectionField,
  theme,
  icon,
  intro,
}: {
  questions: QuizQuestion[];
  prefix: string;
  sectionField?: string;
  theme: QuizTheme;
  icon: string;
  intro?: React.ReactNode;
}) {
  const { lang } = useLang();
  const ui = getUi(lang);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [graded, setGraded] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const currentQ = questions[currentIndex];

  const setAnswer = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (graded) setGraded(false);
  };

  const score = graded ? getScore(questions, answers, prefix) : null;
  const sectionName = sectionField
    ? biField(currentQ as unknown as Record<string, unknown>, sectionField, lang)
    : null;

  return (
    <div className="space-y-4">
      {intro}

      {/* Question navigator */}
      <div className="bg-white rounded-2xl p-4 border border-pink-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">
            {lang === "en" ? `${questions.length} questions` : `共 ${questions.length} 题`}
          </span>
          <button
            onClick={() => setGraded(true)}
            className={`${theme.submitBtn} text-white text-sm font-medium px-4 py-1.5 rounded-xl hover:shadow-md transition-shadow`}
          >
            {icon} {ui.submitGrade}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const result = getQuestionResult(q, answers, prefix, graded);
            const isCurrent = idx === currentIndex;
            const hasAnswer = !!answers[`${prefix}${q.number}`];
            const isOpen = (q.inputType || "open") === "open";
            return (
              <button
                key={q.number}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                  isCurrent
                    ? theme.currentBtn
                    : graded && result === true
                    ? "bg-green-100 text-green-600 border border-green-200"
                    : graded && result === false
                    ? "bg-red-50 text-red-400 border border-red-200"
                    : graded && isOpen
                    ? "bg-blue-50 text-blue-400 border border-blue-200"
                    : hasAnswer
                    ? theme.answeredBtn
                    : theme.defaultBtn
                }`}
              >
                {graded && result === true ? "✓" : graded && result === false ? "✕" : graded && isOpen ? "✎" : q.number}
              </button>
            );
          })}
        </div>
      </div>

      {/* Score card */}
      {score && (
        <div className={`rounded-2xl p-4 border text-center ${
          score.correct === score.total
            ? "bg-green-50 border-green-200"
            : score.correct >= score.total * 0.7
            ? "bg-yellow-50 border-yellow-200"
            : "bg-pink-50 border-pink-200"
        }`}>
          <div className="text-3xl mb-1">
            {score.correct === score.total ? "🎉" : score.correct >= score.total * 0.7 ? "💪" : "🤗"}
          </div>
          <p className="text-xl font-bold text-purple-500">{score.correct} / {score.total}</p>
          <p className="text-sm text-gray-500">
            {score.correct === score.total ? ui.allCorrect : score.correct >= score.total * 0.7 ? ui.mostCorrect : ui.keepGoing}
          </p>
          <p className="text-xs text-gray-400 mt-1">{ui.autoGradeNote}</p>
        </div>
      )}

      {/* Section label */}
      {sectionName && (
        <div className="text-sm text-purple-400 font-medium px-1">
          {sectionName}
        </div>
      )}

      {/* Current question */}
      <ExerciseCard
        key={`${prefix}-${currentQ.number}`}
        question={currentQ}
        forceShowAnswer={false}
        graded={graded}
        userAnswer={answers[`${prefix}${currentQ.number}`]}
        onAnswer={(val) => setAnswer(`${prefix}${currentQ.number}`, val)}
      />

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            currentIndex === 0
              ? "text-gray-300 cursor-not-allowed"
              : theme.navBtn
          }`}
        >
          ← {lang === "en" ? "Prev" : "上一题"}
        </button>
        <span className="text-sm text-gray-400">
          {currentIndex + 1} / {questions.length}
        </span>
        <button
          onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
          disabled={currentIndex === questions.length - 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            currentIndex === questions.length - 1
              ? "text-gray-300 cursor-not-allowed"
              : theme.navBtn
          }`}
        >
          {lang === "en" ? "Next" : "下一题"} →
        </button>
      </div>
    </div>
  );
}

function ExerciseCard({
  question,
  forceShowAnswer,
  graded,
  userAnswer,
  onAnswer,
}: {
  question: QuizQuestion;
  forceShowAnswer: boolean;
  graded: boolean;
  userAnswer?: string | string[];
  onAnswer: (val: string | string[]) => void;
}) {
  const { lang } = useLang();
  const ui = getUi(lang);
  const [showAnswer, setShowAnswer] = useState(false);
  const isRevealed = showAnswer || forceShowAnswer;
  const inputType = question.inputType || "open";
  const q = question as unknown as Record<string, unknown>;

  const isCorrect = (() => {
    if (!graded) return null;
    if (inputType === "blank" || inputType === "truefalse") {
      return (userAnswer as string || "").trim() === question.correctValue;
    }
    if (inputType === "choice" && question.subInputs) {
      const arr = (userAnswer as string[]) || [];
      return question.subInputs.every((si, i) => arr[i] === si.correctValue);
    }
    return null;
  })();

  const borderColor = graded && isCorrect !== null
    ? isCorrect ? "border-green-300" : "border-red-300"
    : "border-pink-100";

  return (
    <div className={`bg-white rounded-2xl p-5 border ${borderColor} transition-colors`}>
      <div className="flex items-start gap-3 mb-3">
        <span className={`text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 ${
          graded && isCorrect !== null
            ? isCorrect ? "bg-green-500" : "bg-red-400"
            : "bg-gradient-to-r from-pink-300 to-purple-300"
        }`}>
          {graded && isCorrect !== null ? (isCorrect ? "✓" : "✕") : question.number}
        </span>
        <div className="flex-1">
          <ContentBlock obj={q} field="question" lang={lang} className="text-base text-gray-700" />
          {question.numberLine && renderNumberLine(question.numberLine)}
        </div>
      </div>

      {/* Input area */}
      <div className="ml-9 mb-3">
        {inputType === "blank" && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={(userAnswer as string) || ""}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder={ui.fillBlank}
              className={`border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200 w-40 ${
                graded && isCorrect !== null
                  ? isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50/50"
              }`}
            />
            {graded && isCorrect === false && (
              <span className="text-xs text-red-400">{ui.correctAnswer}：{question.correctValue}</span>
            )}
          </div>
        )}

        {inputType === "truefalse" && (
          <div className="flex gap-3">
            {["对", "错"].map((opt) => {
              const label = opt === "对" ? ui.correct : ui.wrong;
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-colors text-sm ${
                    (userAnswer as string) === opt
                      ? graded
                        ? opt === question.correctValue
                          ? "border-green-400 bg-green-50 text-green-700"
                          : "border-red-400 bg-red-50 text-red-700"
                        : "border-purple-400 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-purple-200 text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${question.number}`}
                    value={opt}
                    checked={(userAnswer as string) === opt}
                    onChange={() => onAnswer(opt)}
                    className="accent-purple-500"
                  />
                  {opt === "对" ? "✅" : "❌"} {label}
                </label>
              );
            })}
            {graded && isCorrect === false && (
              <span className="text-xs text-red-400 flex items-center">
                {ui.correctAnswer}：{question.correctValue === "对" ? ui.correct : ui.wrong}
              </span>
            )}
          </div>
        )}

        {inputType === "choice" && question.subInputs && (
          <div className="space-y-3">
            {question.subInputs.map((si, idx) => {
              const arr = (userAnswer as string[]) || [];
              const selected = arr[idx];
              const subCorrect = graded ? selected === si.correctValue : null;
              return (
                <div key={idx}>
                  <div className="text-base text-gray-700 mb-1.5">
                    <MathText content={si.prompt} />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {si.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          const next = [...arr];
                          next[idx] = opt;
                          onAnswer(next);
                        }}
                        className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                          selected === opt
                            ? graded
                              ? opt === si.correctValue
                                ? "border-green-400 bg-green-50 text-green-700"
                                : "border-red-400 bg-red-50 text-red-700"
                              : "border-purple-400 bg-purple-100 text-purple-700"
                            : "border-gray-200 hover:border-purple-200 text-gray-500"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                    {graded && subCorrect === false && (
                      <span className="text-xs text-red-400 flex items-center">→ {si.correctValue}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {inputType === "open" && (
          <textarea
            value={(userAnswer as string) || ""}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder={ui.writeAnswer}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200 resize-none bg-gray-50/50"
            rows={3}
          />
        )}
      </div>

      {/* Show answer */}
      {!forceShowAnswer && (
        <div className="ml-9">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`text-xs px-4 py-1.5 rounded-lg transition-colors ${
              showAnswer ? "bg-pink-100 text-pink-600" : "bg-purple-50 text-purple-400 hover:bg-purple-100"
            }`}
          >
            {showAnswer ? ui.hideAnswer : `🌸 ${ui.showAnswer}`}
          </button>
        </div>
      )}

      {/* Answer & explanation */}
      {(isRevealed || (graded && isCorrect === false) || (graded && inputType === "open")) && (
        <div className="ml-9 mt-3 space-y-2">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm font-medium text-green-500 mb-1">{ui.answer}：</p>
            <ContentBlock obj={q} field="answer" lang={lang} className="text-base text-green-600" />
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-medium text-blue-600 mb-1">{ui.explanation}：</p>
            <ContentBlock obj={q} field="explanation" lang={lang} className="text-base text-blue-500" />
          </div>
        </div>
      )}
    </div>
  );
}
