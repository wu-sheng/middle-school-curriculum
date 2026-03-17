"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type Lang = "zh" | "en" | "both";

interface I18nContextType {
  lang: Lang;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
  t: <T>(zh: T, en?: T) => T;
}

const I18nContext = createContext<I18nContextType>({
  lang: "both",
  toggleLang: () => {},
  setLang: () => {},
  t: (zh) => zh,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("both");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "both" ? "zh" : prev === "zh" ? "en" : "both"));
  }, []);

  const t = useCallback(
    <T,>(zh: T, en?: T): T => {
      if (lang === "en" && en !== undefined) return en;
      return zh;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLang() {
  return useContext(I18nContext);
}

/** Pick the right field based on current language.
 *  In "both" mode, returns zh value (use biBoth for paired access). */
export function biField(
  obj: Record<string, unknown>,
  field: string,
  lang: Lang
): string {
  if (lang === "en") {
    const enVal = obj[field + "En"];
    if (typeof enVal === "string" && enVal) return enVal;
  }
  const val = obj[field];
  return typeof val === "string" ? val : "";
}

/** Pick bilingual array */
export function biArray(
  obj: Record<string, unknown>,
  field: string,
  lang: Lang
): string[] {
  if (lang === "en") {
    const enVal = obj[field + "En"];
    if (Array.isArray(enVal) && enVal.length > 0) return enVal;
  }
  const val = obj[field];
  return Array.isArray(val) ? val : [];
}

/** Get both zh and en arrays */
export function biBothArray(
  obj: Record<string, unknown>,
  field: string
): { zh: string[]; en: string[] } {
  const zh = Array.isArray(obj[field]) ? (obj[field] as string[]) : [];
  const enVal = obj[field + "En"];
  const en = Array.isArray(enVal) ? (enVal as string[]) : [];
  return { zh, en };
}

/** Pick zh or en string based on lang. In "both" mode returns zh. */
export function biPick(lang: Lang, zh: string, en: string): string {
  return lang === "en" ? en : zh;
}

/** Static UI text — in "both" mode we use zh as primary */
export function getUi(lang: Lang) {
  return lang === "en" ? uiText.en : uiText.zh;
}

/** Static UI text */
export const uiText = {
  zh: {
    learn: "学习",
    vocabulary: "核心词汇",
    examples: "题型精讲",
    exercises: "练习",
    objectives: "学习目标",
    realLife: "结合日常生活理解",
    commonMistakes: "容易出错的地方",
    summary: "学完后你应该会什么？",
    showSteps: "查看解题步骤",
    showAnswer: "查看答案",
    hideAnswer: "隐藏答案",
    submitGrade: "交卷判分",
    showAll: "显示所有答案",
    hideAll: "隐藏所有答案",
    timeGuide: "时间分配建议",
    fillBlank: "填写答案",
    writeAnswer: "写下你的答案...",
    correctAnswer: "正确答案",
    answer: "答案",
    explanation: "讲解",
    question: "题目",
    type: "类型",
    comingSoon: "即将上线",
    building: "正在准备课程，敬请期待...",
    examplesGuide: "羊驼老师说：每种题型精讲一道，先自己想一想，再点开看解题过程哦！",
    allCorrect: "全对啦！太棒了！🐨🐼🦙 都为你鼓掌！",
    mostCorrect: "做得不错！再看看错题，你会更棒的！",
    keepGoing: "别灰心，考拉陪你再学一遍吧！",
    autoGradeNote: "（仅统计填空题、判断题和选择题的自动评分，✎ 标记的题需自行对照答案）",
    welcome: "欢迎来到",
    tagline: "欣欣绽放的学习花园",
    heroDesc: "考拉、羊驼和熊猫陪你一起学习！\n从小学知识出发，一步步掌握初中数学、物理、化学和生物。",
    encouragement: "每天进步一点点，就是最棒的自己！",
    footer: "Xinbloom · 所有内容均由 AI 生成并经人工校验 · 依据人教版教材大纲 · MIT 开源协议",
    canLearn: "可学习",
    platform: "初中理科自学平台",
    correct: "对",
    wrong: "错",
    chapter: "第",
    chapterSuffix: "章",
    knownNumbers: "小学里我们认识的数：",
    canSolve: "这些数可以解决：",
    cannotSolve: "但是这些情况就不够用了：",
    example: "举例：",
    note: "注意：",
    guidedBy: "带你学",
    examPrep: "章末提升",
    examIntro: "以下题目难度略高于课内练习，帮助你巩固本章知识并提升综合运用能力。",
    session1: "第1课时",
    session2: "第2课时",
    session1Desc: "概念学习 + 题型精讲",
    session2Desc: "快速回顾 + 练习 + 章末提升",
    quickReview: "快速回顾",
    quickReviewDesc: "上节课的核心知识点，做题前先回顾一下：",
  },
  en: {
    learn: "Learn",
    vocabulary: "Vocabulary",
    examples: "Worked Examples",
    exercises: "Practice",
    objectives: "Learning Objectives",
    realLife: "Real-Life Connections",
    commonMistakes: "Common Mistakes",
    summary: "What should you know now?",
    showSteps: "Show solution steps",
    showAnswer: "Show answer",
    hideAnswer: "Hide answer",
    submitGrade: "Submit & Grade",
    showAll: "Show all answers",
    hideAll: "Hide all answers",
    timeGuide: "Time Guide",
    fillBlank: "Your answer",
    writeAnswer: "Write your answer...",
    correctAnswer: "Correct answer",
    answer: "Answer",
    explanation: "Explanation",
    question: "Question",
    type: "Type",
    comingSoon: "Coming soon",
    building: "Content is being prepared, stay tuned...",
    examplesGuide: "Alpaca says: One worked example per type — think first, then check the solution!",
    allCorrect: "Perfect score! 🐨🐼🦙 are cheering for you!",
    mostCorrect: "Well done! Review the mistakes and you'll be even better!",
    keepGoing: "Don't worry, Koala will study with you again!",
    autoGradeNote: "(Auto-grading applies to fill-in, true/false, and choice questions only. ✎ marks need self-review)",
    welcome: "Welcome to",
    tagline: "A blooming garden of learning",
    heroDesc: "Koala, Alpaca and Panda are here to learn with you!\nStarting from primary school, master middle school Math, Physics, Chemistry and Biology.",
    encouragement: "A little progress each day adds up to big results!",
    footer: "Xinbloom · AI-generated content with human review · PEP curriculum · MIT License",
    canLearn: "Ready",
    platform: "Science Self-Study Platform",
    correct: "True",
    wrong: "False",
    chapter: "Ch.",
    chapterSuffix: "",
    knownNumbers: "Numbers we learned in primary school:",
    canSolve: "These numbers can handle:",
    cannotSolve: "But these situations need more:",
    example: "Examples:",
    note: "Note:",
    guidedBy: "guides you",
    examPrep: "Challenge",
    examIntro: "These questions are slightly harder than regular exercises to help you consolidate and apply what you've learned in this chapter.",
    session1: "Session 1",
    session2: "Session 2",
    session1Desc: "Concepts + Worked Examples",
    session2Desc: "Quick Review + Practice + Challenge",
    quickReview: "Quick Review",
    quickReviewDesc: "Key points from last session — review before you practice:",
  },
};
