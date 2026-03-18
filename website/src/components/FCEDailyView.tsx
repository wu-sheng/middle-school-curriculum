"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useLang, biPick } from "@/lib/i18n";
import { BiBlock, BiLabel } from "@/components/BiText";
import Collapsible from "@/components/Collapsible";
import AudioWord from "@/components/AudioWord";

/** Inline vocab popover — click to show, click outside to dismiss */
function VocabPopover({ word, info }: {
  word: string;
  info: { definition: string; definitionZh: string; phonetic: string; partOfSpeech: string };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <span ref={ref} className="relative inline">
      <span
        onClick={() => setOpen(!open)}
        className="text-purple-600 font-semibold underline decoration-dotted decoration-purple-300 cursor-pointer"
      >
        {word}
      </span>
      {open && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white rounded-xl shadow-lg border border-purple-100 p-3 text-left">
          <span className="block font-bold text-purple-700 text-sm">{word}</span>
          <span className="block text-xs text-gray-400 mt-0.5">{info.phonetic} · {info.partOfSpeech}</span>
          <span className="block text-sm text-gray-700 mt-1.5">{info.definition}</span>
          <span className="block text-xs text-gray-400 mt-1">{info.definitionZh}</span>
          {/* Arrow */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface DailyViewProps {
  day: {
    id: string;
    dayOffset: number;
    reading: string | null;
    newVocab: string[];
    reviewVocab: string[];
    grammar: string[];
    useOfEnglish: string[];
    writing: string | null;
  };
  month: number;
  quest: string;
  readingData: {
    id: string; title: string; titleZh: string; level: number; wordCount: number;
    topic: string; passage: string; passageZh: string;
    vocabHighlights: { word: string; ref: string }[];
    questions: {
      id: string; type: string; question: string; questionZh: string;
      options: Record<string, string>; answer: string;
      explanation: string; explanationZh: string;
    }[];
  } | null;
  vocabData: {
    id: string; word: string; phonetic: string; partOfSpeech: string;
    definition: string; definitionZh: string;
    exampleSentence: string; exampleSentenceZh: string;
    wordFamily: { form: string; partOfSpeech: string; note?: string }[];
    collocations: string[]; synonyms: string[]; antonyms: string[];
  }[];
  grammarData: {
    id: string; type: string; question: string; questionZh: string;
    answer: string; explanation: string; explanationZh: string;
    grammarPoint: string; difficulty: number;
    options?: Record<string, string>;
    optionsZh?: Record<string, string>;
    passage?: string; passageZh?: string;
    blanks?: { id: string; answer: string }[];
  }[];
  uoeData: {
    id: string; type: string; sentence: string; sentenceZh: string;
    baseWord: string; answer: string;
    explanation: string; explanationZh: string;
    grammarPoint: string; difficulty: number;
  }[];
  writingData: {
    id: string; type: string; title: string; titleZh: string;
    prompt: string; promptZh: string; targetWords: string;
    scaffold: {
      storyMap: Record<string, string>;
      mustUseWords: string[];
      mustUseStructure: string[];
      mustUseStructureZh: string[];
    };
    selfCheckList: string[]; selfCheckListZh: string[];
    modelAnswer: string; modelAnswerZh: string;
  } | null;
  listeningData: {
    id: string; type: string; title: string; titleZh: string;
    scene: string; sceneZh: string; difficulty: number;
    audioFile: string;
    script: { speaker: string; voice: string; text: string }[];
    question: {
      text: string; textZh: string;
      options: Record<string, string>; answer: string;
      explanation: string; explanationZh: string;
    };
  }[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type TabKey = "reading" | "vocab" | "grammar" | "uoe" | "listening" | "writing";

const TAB_META: { key: TabKey; icon: string; zh: string; en: string }[] = [
  { key: "reading", icon: "📖", zh: "阅读", en: "Reading" },
  { key: "vocab", icon: "📝", zh: "词汇", en: "Vocabulary" },
  { key: "grammar", icon: "🔧", zh: "语法", en: "Grammar" },
  { key: "uoe", icon: "🧩", zh: "词形转换", en: "Use of English" },
  { key: "listening", icon: "🎧", zh: "听力", en: "Listening" },
  { key: "writing", icon: "✍️", zh: "写作", en: "Writing" },
];

function scoreColor(pct: number) {
  if (pct >= 80) return "text-green-600 bg-green-50 border-green-200";
  if (pct >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm border border-pink-100 p-5 mb-4 ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1 : Reading                                                    */
/* ------------------------------------------------------------------ */

function ReadingTab({ data, allVocab }: { data: DailyViewProps["readingData"]; lang: string; allVocab: DailyViewProps["vocabData"] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [graded, setGraded] = useState(false);

  // Reading is always English-only — this is an English immersion exercise
  if (!data) return <Card><p className="text-gray-400 italic">No reading task today.</p></Card>;

  const score = graded
    ? data.questions.reduce((s, q) => s + (answers[q.id] === q.answer ? 1 : 0), 0)
    : 0;
  const pct = graded ? Math.round((score / data.questions.length) * 100) : 0;

  // Build vocab lookup: word → definition
  const vocabMap = new Map<string, { definition: string; definitionZh: string; phonetic: string; partOfSpeech: string }>();
  for (const vh of data.vocabHighlights) {
    const entry = allVocab.find(v => v.id === vh.ref);
    if (entry) vocabMap.set(vh.word.toLowerCase(), entry);
  }
  const highlightWords = new Set(data.vocabHighlights.map(v => v.word.toLowerCase()));

  function highlightPassage(text: string) {
    if (highlightWords.size === 0) return text;
    const regex = new RegExp(`\\b(${[...highlightWords].map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (!highlightWords.has(part.toLowerCase())) return part;
      const info = vocabMap.get(part.toLowerCase());
      if (!info) return <span key={i} className="text-purple-600 font-semibold underline decoration-dotted decoration-purple-300">{part}</span>;
      return <VocabPopover key={i} word={part} info={info} />;
    });
  }

  return (
    <>
      {/* Passage */}
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h3 className="text-lg font-bold text-purple-700">{data.title}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">Level {data.level}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-medium">{data.wordCount} words</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{data.topic}</span>
        </div>
        <div className="leading-7 whitespace-pre-line">{highlightPassage(data.passage)}</div>
        {data.vocabHighlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.vocabHighlights.map(v => (
              <span key={v.word} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{v.word}</span>
            ))}
          </div>
        )}
      </Card>

      {/* Questions — English only */}
      <Card>
        <h4 className="font-semibold text-purple-600 mb-3">Comprehension</h4>
        {data.questions.map((q, qi) => {
          const isCorrect = graded && answers[q.id] === q.answer;
          return (
            <div key={q.id} className={`mb-4 p-3 rounded-xl border ${graded ? (isCorrect ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30") : "border-gray-100"}`}>
              <div className="font-medium mb-2">
                <span className="text-purple-400 mr-1">{qi + 1}.</span>
                {q.question}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 ml-4">
                {Object.entries(q.options).map(([key, val]) => (
                  <label key={key} className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${answers[q.id] === key ? "bg-purple-50" : "hover:bg-gray-50"} ${graded && key === q.answer ? "ring-2 ring-green-300" : ""}`}>
                    <input
                      type="radio"
                      name={`reading-${q.id}`}
                      value={key}
                      checked={answers[q.id] === key}
                      onChange={() => !graded && setAnswers(prev => ({ ...prev, [q.id]: key }))}
                      disabled={graded}
                      className="accent-purple-500"
                    />
                    <span className="text-sm"><span className="font-medium text-gray-500">{key}.</span> {val}</span>
                  </label>
                ))}
              </div>
              {graded && (
                <div className={`mt-2 text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "✓" : `✗ Correct answer: ${q.answer}`}
                  <div className="text-gray-500 mt-1">{q.explanation}</div>
                </div>
              )}
            </div>
          );
        })}

        {!graded ? (
          <button onClick={() => setGraded(true)} className="mt-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium hover:opacity-90 transition-opacity">
            Check Answers
          </button>
        ) : (
          <div className={`mt-3 p-3 rounded-xl border font-medium text-center ${scoreColor(pct)}`}>
            {score}/{data.questions.length} ({pct}%)
          </div>
        )}
      </Card>

      {/* Key Vocabulary — shown after grading */}
      {graded && vocabMap.size > 0 && (
        <Card>
          <h4 className="font-semibold text-purple-600 mb-3">Key Vocabulary</h4>
          <div className="space-y-3">
            {data.vocabHighlights.map(vh => {
              const v = vocabMap.get(vh.word.toLowerCase());
              if (!v) return null;
              return (
                <div key={vh.word} className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/40 border border-purple-100">
                  <AudioWord word={vh.word} className="text-purple-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 mr-1">{v.phonetic}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-pink-50 text-pink-500 font-medium">{v.partOfSpeech}</span>
                    <p className="text-sm text-gray-700 mt-1">{v.definition}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{v.definitionZh}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2 : Vocabulary                                                 */
/* ------------------------------------------------------------------ */

function VocabTab({ vocabData, newIds, reviewIds, lang }: {
  vocabData: DailyViewProps["vocabData"];
  newIds: string[];
  reviewIds: string[];
  lang: string;
}) {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizGraded, setQuizGraded] = useState(false);

  const newWords = useMemo(() => vocabData.filter(v => newIds.includes(v.id)), [vocabData, newIds]);
  const reviewWords = useMemo(() => vocabData.filter(v => reviewIds.includes(v.id)), [vocabData, reviewIds]);

  function VocabCard({ v }: { v: DailyViewProps["vocabData"][0] }) {
    return (
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <AudioWord word={v.word} className="text-lg text-purple-700" />
            <span className="ml-2 text-sm text-gray-400">{v.phonetic}</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-500 font-medium">{v.partOfSpeech}</span>
          </div>
        </div>
        <div className="mt-2">
          {lang === "both"
            ? <BiBlock zh={v.definition} en={v.definitionZh} />
            : <p>{lang === "en" ? v.definition : v.definitionZh}</p>}
        </div>
        <div className="mt-2 text-sm italic text-gray-500 border-l-2 border-purple-200 pl-3">
          {lang === "both"
            ? <BiBlock zh={v.exampleSentence} en={v.exampleSentenceZh} />
            : <p>{lang === "en" ? v.exampleSentence : v.exampleSentenceZh}</p>}
        </div>

        {/* Word Family */}
        {v.wordFamily.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-purple-500 mb-1"><BiLabel zh="词族" en="Word Family" /></p>
            <table className="text-xs w-full border-collapse">
              <tbody>
                {v.wordFamily.map(wf => (
                  <tr key={wf.form} className="border-b border-gray-50">
                    <td className="py-1 pr-2 font-medium text-gray-700">{wf.form}</td>
                    <td className="py-1 pr-2 text-gray-400">{wf.partOfSpeech}</td>
                    {wf.note && <td className="py-1 text-gray-400">{wf.note}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {v.collocations.map(c => (
            <span key={c} className="text-xs bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full">{c}</span>
          ))}
          {v.synonyms.map(s => (
            <span key={s} className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">≈ {s}</span>
          ))}
          {v.antonyms.map(a => (
            <span key={a} className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">≠ {a}</span>
          ))}
        </div>
      </Card>
    );
  }

  // Quick recall quiz uses new words
  const quizWords = newWords.slice(0, 5);
  const quizScore = quizGraded
    ? quizWords.reduce((s, w) => s + ((quizAnswers[w.id] || "").trim().toLowerCase() === w.word.toLowerCase() ? 1 : 0), 0)
    : 0;

  return (
    <>
      {/* Tag Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
        <span>Tags:</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-purple-50 border border-purple-200" /> collocations</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-50 border border-green-200" /> ≈ synonyms</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-50 border border-red-200" /> ≠ antonyms</span>
      </div>

      {/* New Words */}
      {newWords.length > 0 && (
        <div className="mb-6">
          <h4 className="text-base font-bold text-purple-600 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
            <BiLabel zh="新词" en="New Words" />
            <span className="text-xs text-gray-400 font-normal">({newWords.length})</span>
          </h4>
          {newWords.map(v => <VocabCard key={v.id} v={v} />)}
        </div>
      )}

      {/* Review Words */}
      {reviewWords.length > 0 && (
        <div className="mb-6">
          <h4 className="text-base font-bold text-gray-500 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <BiLabel zh="复习词汇" en="Review" />
            <span className="text-xs text-gray-400 font-normal">({reviewWords.length})</span>
          </h4>
          {reviewWords.map(v => <VocabCard key={v.id} v={v} />)}
        </div>
      )}

      {/* Quick Recall Quiz */}
      {quizWords.length > 0 && (
        <Card className="border-purple-100">
          <h4 className="font-semibold text-purple-600 mb-3">
            <BiLabel zh="快速回忆" en="Quick Recall" />
          </h4>
          <p className="text-sm text-gray-400 mb-3">
            <BiLabel zh="看定义，输入单词" en="Read the definition, type the word" />
          </p>
          {quizWords.map(w => {
            const correct = quizGraded && (quizAnswers[w.id] || "").trim().toLowerCase() === w.word.toLowerCase();
            const wrong = quizGraded && !correct;
            return (
              <div key={w.id} className={`mb-3 p-3 rounded-xl border ${quizGraded ? (correct ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30") : "border-gray-100"}`}>
                <p className="text-sm mb-1.5">{lang === "en" ? w.definition : w.definitionZh}</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={quizAnswers[w.id] || ""}
                    onChange={e => !quizGraded && setQuizAnswers(prev => ({ ...prev, [w.id]: e.target.value }))}
                    disabled={quizGraded}
                    placeholder="..."
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                  {wrong && <span className="text-sm text-red-500">✗ {w.word}</span>}
                  {correct && <span className="text-sm text-green-500">✓</span>}
                </div>
              </div>
            );
          })}
          {!quizGraded ? (
            <button onClick={() => setQuizGraded(true)} className="mt-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium hover:opacity-90 transition-opacity">
              Check
            </button>
          ) : (
            <div className={`mt-3 p-3 rounded-xl border font-medium text-center ${scoreColor(Math.round((quizScore / quizWords.length) * 100))}`}>
              {quizScore}/{quizWords.length}
            </div>
          )}
        </Card>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3 : Grammar                                                    */
/* ------------------------------------------------------------------ */

function GrammarTab({ grammarData, lang }: { grammarData: DailyViewProps["grammarData"]; lang: string }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [blanksAnswers, setBlanksAnswers] = useState<Record<string, Record<string, string>>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (grammarData.length === 0) return <Card><p className="text-gray-400 italic"><BiLabel zh="本日无语法练习" en="No grammar exercises today." /></p></Card>;

  const q = grammarData[current];
  const total = grammarData.length;
  const answeredCount = Object.keys(checked).length;
  const correctCount = grammarData.filter(g => {
    if (!checked[g.id]) return false;
    if (g.type === "cloze-passage" && g.blanks) {
      const ba = blanksAnswers[g.id] || {};
      return g.blanks.every(b => (ba[b.id] || "").trim().toLowerCase() === b.answer.toLowerCase());
    }
    return (answers[g.id] || "").trim().toLowerCase() === g.answer.toLowerCase();
  }).length;

  function checkCurrent() {
    setChecked(prev => ({ ...prev, [q.id]: true }));
  }

  function isCurrentCorrect() {
    if (q.type === "cloze-passage" && q.blanks) {
      const ba = blanksAnswers[q.id] || {};
      return q.blanks.every(b => (ba[b.id] || "").trim().toLowerCase() === b.answer.toLowerCase());
    }
    return (answers[q.id] || "").trim().toLowerCase() === q.answer.toLowerCase();
  }

  return (
    <>
      {/* Navigation */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {grammarData.map((g, i) => (
          <button
            key={g.id}
            onClick={() => setCurrent(i)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              i === current
                ? "bg-purple-500 text-white"
                : checked[g.id]
                  ? (
                      // Show green/red based on correctness
                      (g.type === "cloze-passage" && g.blanks
                        ? g.blanks.every(b => ((blanksAnswers[g.id] || {})[b.id] || "").trim().toLowerCase() === b.answer.toLowerCase())
                        : (answers[g.id] || "").trim().toLowerCase() === g.answer.toLowerCase()
                      ) ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    )
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Card>
        {/* Grammar point badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">{q.grammarPoint}</span>
          <span className="text-xs text-gray-400">
            {biPick(lang as "zh" | "en" | "both", "难度", "Difficulty")}: {"★".repeat(q.difficulty)}{"☆".repeat(3 - q.difficulty)}
          </span>
        </div>

        {/* Question */}
        <div className="mb-4">
          {lang === "both"
            ? <BiBlock zh={q.question} en={q.questionZh} className="font-medium" />
            : <p className="font-medium">{lang === "en" ? q.question : q.questionZh}</p>}
        </div>

        {/* Multiple choice */}
        {q.type === "multiple-choice" && q.options && (
          <div className="space-y-2 ml-2">
            {Object.entries(lang === "zh" && q.optionsZh ? q.optionsZh : q.options).map(([key, val]) => (
              <label key={key} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${answers[q.id] === key ? "bg-purple-50" : "hover:bg-gray-50"} ${checked[q.id] && key === q.answer ? "ring-2 ring-green-300" : ""}`}>
                <input
                  type="radio"
                  name={`grammar-${q.id}`}
                  value={key}
                  checked={answers[q.id] === key}
                  onChange={() => !checked[q.id] && setAnswers(prev => ({ ...prev, [q.id]: key }))}
                  disabled={!!checked[q.id]}
                  className="accent-purple-500"
                />
                <span className="text-sm"><span className="font-medium text-gray-500">{key}.</span> {val}</span>
              </label>
            ))}
          </div>
        )}

        {/* Fill in the blank */}
        {q.type === "fill-blank" && (
          <input
            type="text"
            value={answers[q.id] || ""}
            onChange={e => !checked[q.id] && setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
            disabled={!!checked[q.id]}
            placeholder={biPick(lang as "zh" | "en" | "both", "输入答案...", "Type your answer...")}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        )}

        {/* Cloze passage */}
        {q.type === "cloze-passage" && q.passage && q.blanks && (
          <div className="space-y-3">
            <p className="leading-7 whitespace-pre-line text-sm">{lang === "en" ? q.passage : (q.passageZh || q.passage)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {q.blanks.map((b, bi) => {
                const ba = blanksAnswers[q.id] || {};
                const correct = checked[q.id] && (ba[b.id] || "").trim().toLowerCase() === b.answer.toLowerCase();
                const wrong = checked[q.id] && !correct;
                return (
                  <div key={b.id} className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 font-medium">({bi + 1})</span>
                    <input
                      type="text"
                      value={ba[b.id] || ""}
                      onChange={e => !checked[q.id] && setBlanksAnswers(prev => ({
                        ...prev,
                        [q.id]: { ...(prev[q.id] || {}), [b.id]: e.target.value },
                      }))}
                      disabled={!!checked[q.id]}
                      className={`border rounded-lg px-2 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-purple-300 ${correct ? "border-green-300 bg-green-50" : wrong ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    {wrong && <span className="text-xs text-red-500">{b.answer}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Check / feedback */}
        {!checked[q.id] ? (
          <button onClick={checkCurrent} className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium hover:opacity-90 transition-opacity">
            Check
          </button>
        ) : (
          <div className={`mt-3 text-sm ${isCurrentCorrect() ? "text-green-600" : "text-red-600"}`}>
            {isCurrentCorrect() ? "✓ " : "✗ "}
            {!isCurrentCorrect() && q.type !== "cloze-passage" && (
              <span>{biPick(lang as "zh" | "en" | "both", "正确答案", "Answer")}: {q.answer}</span>
            )}
          </div>
        )}

        {checked[q.id] && (
          <Collapsible title={biPick(lang as "zh" | "en" | "both", "讲解", "Explanation")} variant="answer">
            {lang === "both"
              ? <BiBlock zh={q.explanation} en={q.explanationZh} />
              : <p>{lang === "zh" ? q.explanationZh : q.explanation}</p>}
          </Collapsible>
        )}

        {/* Prev / Next */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="text-sm text-purple-500 disabled:text-gray-300"
          >
            ← <BiLabel zh="上一题" en="Previous" />
          </button>
          <button
            onClick={() => setCurrent(Math.min(total - 1, current + 1))}
            disabled={current === total - 1}
            className="text-sm text-purple-500 disabled:text-gray-300"
          >
            <BiLabel zh="下一题" en="Next" /> →
          </button>
        </div>
      </Card>

      {/* Score summary */}
      {answeredCount === total && (
        <div className={`mt-3 p-4 rounded-xl border font-medium text-center ${scoreColor(Math.round((correctCount / total) * 100))}`}>
          <BiLabel zh="语法得分" en="Grammar Score" />: {correctCount}/{total} ({Math.round((correctCount / total) * 100)}%)
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 4 : Use of English                                             */
/* ------------------------------------------------------------------ */

function UoETab({ uoeData, lang }: { uoeData: DailyViewProps["uoeData"]; lang: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [graded, setGraded] = useState(false);

  if (uoeData.length === 0) return <Card><p className="text-gray-400 italic"><BiLabel zh="本日无词形转换练习" en="No word formation exercises today." /></p></Card>;

  const score = graded
    ? uoeData.reduce((s, q) => s + ((answers[q.id] || "").trim().toLowerCase() === q.answer.toLowerCase() ? 1 : 0), 0)
    : 0;
  const pct = graded ? Math.round((score / uoeData.length) * 100) : 0;

  return (
    <>
      {uoeData.map((q, qi) => {
        const isCorrect = graded && (answers[q.id] || "").trim().toLowerCase() === q.answer.toLowerCase();
        const isWrong = graded && !isCorrect;
        return (
          <Card key={q.id} className={graded ? (isCorrect ? "border-green-200" : "border-red-200") : ""}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">{q.grammarPoint}</span>
              <span className="text-xs text-gray-400">{"★".repeat(q.difficulty)}{"☆".repeat(3 - q.difficulty)}</span>
            </div>
            <p className="mb-2">
              <span className="text-purple-400 mr-1 font-medium">{qi + 1}.</span>
              {lang === "both"
                ? <BiBlock zh={q.sentence} en={q.sentenceZh} />
                : <span>{lang === "en" ? q.sentence : q.sentenceZh}</span>}
            </p>
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">{q.baseWord}</span>
              <span className="text-gray-300">→</span>
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={e => !graded && setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                disabled={graded}
                placeholder="..."
                className={`border rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-purple-300 ${isCorrect ? "border-green-300 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-gray-200"}`}
              />
              {isCorrect && <span className="text-green-500">✓</span>}
              {isWrong && <span className="text-sm text-red-500">✗ {q.answer}</span>}
            </div>
            {graded && (
              <Collapsible title={biPick(lang as "zh" | "en" | "both", "讲解", "Explanation")} variant="answer">
                {lang === "both"
                  ? <BiBlock zh={q.explanation} en={q.explanationZh} />
                  : <p>{lang === "zh" ? q.explanationZh : q.explanation}</p>}
              </Collapsible>
            )}
          </Card>
        );
      })}

      {!graded ? (
        <button onClick={() => setGraded(true)} className="mt-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium hover:opacity-90 transition-opacity">
          Check Answers
        </button>
      ) : (
        <div className={`mt-3 p-4 rounded-xl border font-medium text-center ${scoreColor(pct)}`}>
          <BiLabel zh="词形转换得分" en="Word Formation Score" />: {score}/{uoeData.length} ({pct}%)
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 5 : Writing                                                    */
/* ------------------------------------------------------------------ */

function WritingTab({ data, lang }: { data: DailyViewProps["writingData"]; lang: string }) {
  const [text, setText] = useState("");
  const [checkItems, setCheckItems] = useState<Record<number, boolean>>({});

  if (!data) return null;

  const storyMapKeys = ["opening", "development", "climax", "resolution"];
  const storyLabels: Record<string, { zh: string; en: string }> = {
    opening: { zh: "开端", en: "Opening" },
    development: { zh: "发展", en: "Development" },
    climax: { zh: "高潮", en: "Climax" },
    resolution: { zh: "结局", en: "Resolution" },
  };

  const checkList = lang === "en" ? data.selfCheckList : data.selfCheckListZh;

  return (
    <>
      {/* Prompt */}
      <Card>
        <h4 className="font-semibold text-purple-600 mb-2">
          {lang === "both"
            ? <BiBlock zh={data.title} en={data.titleZh} />
            : <span>{lang === "en" ? data.title : data.titleZh}</span>}
        </h4>
        <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-medium">{data.type}</span>
        <span className="text-xs ml-2 text-gray-400">{data.targetWords}</span>
        <div className="mt-3">
          {lang === "both"
            ? <BiBlock zh={data.prompt} en={data.promptZh} className="leading-7" />
            : <p className="leading-7">{lang === "en" ? data.prompt : data.promptZh}</p>}
        </div>
      </Card>

      {/* Story Map Scaffold */}
      <Card>
        <h4 className="font-semibold text-purple-600 mb-3">
          <BiLabel zh="故事地图" en="Story Map" />
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {storyMapKeys.map((key, i) => (
            <div key={key} className="rounded-xl border border-purple-100 p-3 bg-purple-50/20">
              <p className="text-xs font-semibold text-purple-500 mb-1">
                {i + 1}. <BiLabel zh={storyLabels[key]?.zh || key} en={storyLabels[key]?.en || key} />
              </p>
              <p className="text-sm text-gray-600">{data.scaffold.storyMap[key] || ""}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Must-use words and structures */}
      <Card>
        <div className="mb-3">
          <p className="text-xs font-semibold text-pink-500 mb-1.5"><BiLabel zh="必用词汇" en="Must-Use Words" /></p>
          <div className="flex flex-wrap gap-1.5">
            {data.scaffold.mustUseWords.map(w => (
              <span key={w} className="text-sm bg-pink-50 text-pink-600 px-2.5 py-0.5 rounded-full font-medium">{w}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-purple-500 mb-1.5"><BiLabel zh="必用句式" en="Must-Use Structures" /></p>
          <ul className="space-y-1 ml-3">
            {(lang === "en" ? data.scaffold.mustUseStructure : (lang === "zh" ? data.scaffold.mustUseStructureZh : data.scaffold.mustUseStructure)).map((s, i) => (
              <li key={i} className="text-sm text-gray-600 list-disc">
                {lang === "both" ? (
                  <BiBlock zh={data.scaffold.mustUseStructureZh[i] || s} en={s} />
                ) : s}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Writing area */}
      <Card>
        <h4 className="font-semibold text-purple-600 mb-2">
          <BiLabel zh="你的作文" en="Your Writing" />
        </h4>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={12}
          placeholder={biPick(lang as "zh" | "en" | "both", "在这里写作...", "Start writing here...")}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-y"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {text.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </Card>

      {/* Self-check */}
      <Card>
        <h4 className="font-semibold text-purple-600 mb-3">
          <BiLabel zh="自查清单" en="Self-Check List" />
        </h4>
        <div className="space-y-2">
          {checkList.map((item, i) => (
            <label key={i} className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!checkItems[i]}
                onChange={() => setCheckItems(prev => ({ ...prev, [i]: !prev[i] }))}
                className="mt-0.5 accent-purple-500"
              />
              <span className="text-sm text-gray-600">{item}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Model answer */}
      <Collapsible title={biPick(lang as "zh" | "en" | "both", "范文", "Model Answer")} variant="answer">
        {lang === "both"
          ? <BiBlock zh={data.modelAnswer} en={data.modelAnswerZh} className="leading-7 whitespace-pre-line" />
          : <p className="leading-7 whitespace-pre-line">{lang === "en" ? data.modelAnswer : data.modelAnswerZh}</p>}
      </Collapsible>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 6 : Listening                                                  */
/* ------------------------------------------------------------------ */

function speakerColor(voice: string): string {
  switch (voice) {
    case "girl": case "shimmer": return "text-pink-500";
    case "boy": case "echo": return "text-blue-500";
    case "narrator": case "nova": return "text-purple-500";
    case "adult": case "onyx": return "text-gray-500";
    default: return "text-gray-600";
  }
}

function ListeningTab({ listeningData, lang }: { listeningData: DailyViewProps["listeningData"]; lang: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (listeningData.length === 0) return <Card><p className="text-gray-400 italic"><BiLabel zh="本日无听力练习" en="No listening exercises today." /></p></Card>;

  return (
    <>
      {listeningData.map((extract, ei) => {
        const isChecked = !!checked[extract.id];
        const isCorrect = isChecked && answers[extract.id] === extract.question.answer;
        return (
          <Card key={extract.id}>
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-purple-400 font-medium">{ei + 1}.</span>
              <h4 className="font-semibold text-purple-700">
                {lang === "both"
                  ? <BiBlock zh={extract.title} en={extract.titleZh} />
                  : <span>{lang === "en" ? extract.title : extract.titleZh}</span>}
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">{extract.type}</span>
              <span className="text-xs text-gray-400">
                {"★".repeat(extract.difficulty)}{"☆".repeat(3 - extract.difficulty)}
              </span>
            </div>

            {/* Scene description */}
            <div className="text-sm text-gray-500 italic mb-3">
              {lang === "both"
                ? <BiBlock zh={extract.scene} en={extract.sceneZh} />
                : <span>{lang === "en" ? extract.scene : extract.sceneZh}</span>}
            </div>

            {/* Audio player */}
            {extract.audioFile && (
              <div className="mb-3">
                <audio controls className="w-full rounded-lg" preload="none">
                  <source src={extract.audioFile} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Script (collapsible) */}
            <Collapsible title={biPick(lang as "zh" | "en" | "both", "查看原文", "Read Script")} variant="step">
              <div className="space-y-2 py-2">
                <div className="text-sm text-gray-400 italic mb-3">
                  🎭 [{biPick(lang as "zh" | "en" | "both",
                    `场景：${extract.sceneZh || extract.scene}`,
                    `Scene: ${extract.scene}`
                  )}]
                </div>
                {extract.script.map((line, li) => (
                  <div key={li} className="flex gap-2 text-sm">
                    <span className={`font-semibold shrink-0 ${speakerColor(line.voice)}`}>
                      {line.speaker}:
                    </span>
                    <span className="text-gray-700">{line.text}</span>
                  </div>
                ))}
              </div>
            </Collapsible>

            {/* Comprehension question */}
            <div className={`mt-4 p-3 rounded-xl border ${isChecked ? (isCorrect ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30") : "border-gray-100"}`}>
              <div className="font-medium mb-2">
                {lang === "both"
                  ? <BiBlock zh={extract.question.text} en={extract.question.textZh} />
                  : <span>{lang === "en" ? extract.question.text : extract.question.textZh}</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 ml-2">
                {Object.entries(extract.question.options).map(([key, val]) => (
                  <label key={key} className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${answers[extract.id] === key ? "bg-purple-50" : "hover:bg-gray-50"} ${isChecked && key === extract.question.answer ? "ring-2 ring-green-300" : ""}`}>
                    <input
                      type="radio"
                      name={`listening-${extract.id}`}
                      value={key}
                      checked={answers[extract.id] === key}
                      onChange={() => !isChecked && setAnswers(prev => ({ ...prev, [extract.id]: key }))}
                      disabled={isChecked}
                      className="accent-purple-500"
                    />
                    <span className="text-sm"><span className="font-medium text-gray-500">{key}.</span> {val}</span>
                  </label>
                ))}
              </div>

              {!isChecked ? (
                <button
                  onClick={() => setChecked(prev => ({ ...prev, [extract.id]: true }))}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Check
                </button>
              ) : (
                <div className={`mt-2 text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "✓" : `✗ Correct answer: ${extract.question.answer}`}
                  <div className="text-gray-500 mt-1">
                    {lang === "both"
                      ? <BiBlock zh={extract.question.explanation} en={extract.question.explanationZh} />
                      : <span>{lang === "en" ? extract.question.explanation : extract.question.explanationZh}</span>}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function FCEDailyView(props: DailyViewProps) {
  const { day, month, quest, readingData, vocabData, grammarData, uoeData, writingData, listeningData } = props;
  const { lang } = useLang();

  // Build available tabs (writing only if data exists)
  const tabs = useMemo(() => {
    const all = TAB_META.filter(t => {
      if (t.key === "writing") return writingData !== null;
      if (t.key === "listening") return listeningData.length > 0;
      return true;
    });
    return all;
  }, [writingData, listeningData]);

  const [activeTab, setActiveTab] = useState<TabKey>("reading");

  return (
    <div className="max-w-3xl mx-auto">
      {/* Day Header with navigation */}
      <div className="mb-6 flex items-center justify-between">
        <a
          href={day.dayOffset > 1 ? `/fce/daily/D${String(day.dayOffset - 1).padStart(3, "0")}` : undefined}
          className={`text-sm ${day.dayOffset > 1 ? "text-purple-500 hover:text-purple-700" : "text-gray-200 pointer-events-none"} transition-colors`}
        >
          ← Day {day.dayOffset - 1 || ""}
        </a>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-purple-700">
            Day {day.dayOffset}
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600 font-medium">
            {biPick(lang, `第${month}月`, `Month ${month}`)}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-500 font-medium">
            {quest}
          </span>
        </div>
        <a
          href={`/fce/daily/D${String(day.dayOffset + 1).padStart(3, "0")}`}
          className="text-sm text-purple-500 hover:text-purple-700 transition-colors"
        >
          Day {day.dayOffset + 1} →
        </a>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
              activeTab === tab.key
                ? "text-purple-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span>{tab.icon}</span>
            <span><BiLabel zh={tab.zh} en={tab.en} /></span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "reading" && <ReadingTab data={readingData} lang={lang} allVocab={vocabData} />}
        {activeTab === "vocab" && (
          <VocabTab vocabData={vocabData} newIds={day.newVocab} reviewIds={day.reviewVocab} lang={lang} />
        )}
        {activeTab === "grammar" && <GrammarTab grammarData={grammarData} lang={lang} />}
        {activeTab === "uoe" && <UoETab uoeData={uoeData} lang={lang} />}
        {activeTab === "listening" && <ListeningTab listeningData={listeningData} lang={lang} />}
        {activeTab === "writing" && <WritingTab data={writingData} lang={lang} />}
      </div>

      {/* Day Navigation */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
        {day.dayOffset > 1 ? (
          <a href={`/fce/daily/D${String(day.dayOffset - 1).padStart(3, "0")}`} className="text-sm text-purple-500 hover:text-purple-700 transition-colors">
            ← Day {day.dayOffset - 1}
          </a>
        ) : <span />}
        <a href="/fce" className="text-sm text-gray-400 hover:text-purple-500 transition-colors">
          <BiLabel zh="返回总览" en="Back to Overview" />
        </a>
        <a href={`/fce/daily/D${String(day.dayOffset + 1).padStart(3, "0")}`} className="text-sm text-purple-500 hover:text-purple-700 transition-colors">
          Day {day.dayOffset + 1} →
        </a>
      </div>
    </div>
  );
}
