import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const fceDir = path.join(process.cwd(), "src", "data", "english", "fce");

// ── Loaders ──────────────────────────────────────────────

export function loadFceQuest(questId: string): FCEQuest | null {
  const filePath = path.join(fceDir, "quests", `${questId}.yaml`);
  if (!fs.existsSync(filePath)) return null;
  return yaml.load(fs.readFileSync(filePath, "utf8")) as FCEQuest;
}

export function loadFceReadings(batchFile: string): FCEReading[] {
  const filePath = path.join(fceDir, "readings", batchFile);
  if (!fs.existsSync(filePath)) return [];
  const data = yaml.load(fs.readFileSync(filePath, "utf8")) as { readings: FCEReading[] };
  return data.readings || [];
}

export function loadAllFceReadings(): FCEReading[] {
  const dir = path.join(fceDir, "readings");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
  const all: FCEReading[] = [];
  for (const f of files) {
    const data = yaml.load(fs.readFileSync(path.join(dir, f), "utf8")) as { readings: FCEReading[] };
    if (data.readings) all.push(...data.readings);
  }
  return all;
}

export function loadFceVocab(topicFile: string): FCEVocabEntry[] {
  const filePath = path.join(fceDir, "vocab", topicFile);
  if (!fs.existsSync(filePath)) return [];
  const data = yaml.load(fs.readFileSync(filePath, "utf8")) as { vocab: FCEVocabEntry[] };
  return data.vocab || [];
}

export function loadAllFceVocab(): FCEVocabEntry[] {
  const dir = path.join(fceDir, "vocab");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
  const all: FCEVocabEntry[] = [];
  for (const f of files) {
    const data = yaml.load(fs.readFileSync(path.join(dir, f), "utf8")) as { vocab: FCEVocabEntry[] };
    if (data.vocab) all.push(...data.vocab);
  }
  return all;
}

export function loadFceGrammar(): FCEGrammarQuestion[] {
  const dir = path.join(fceDir, "grammar");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
  const all: FCEGrammarQuestion[] = [];
  for (const f of files) {
    const data = yaml.load(fs.readFileSync(path.join(dir, f), "utf8")) as { questions: FCEGrammarQuestion[] };
    if (data.questions) all.push(...data.questions);
  }
  return all;
}

export function loadFceUoE(): FCEUoEQuestion[] {
  const dir = path.join(fceDir, "use-of-english");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
  const all: FCEUoEQuestion[] = [];
  for (const f of files) {
    const data = yaml.load(fs.readFileSync(path.join(dir, f), "utf8")) as { questions: FCEUoEQuestion[] };
    if (data.questions) all.push(...data.questions);
  }
  return all;
}

export function loadFceWriting(): FCEWritingTask[] {
  const dir = path.join(fceDir, "writing");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
  const all: FCEWritingTask[] = [];
  for (const f of files) {
    const data = yaml.load(fs.readFileSync(path.join(dir, f), "utf8")) as { tasks: FCEWritingTask[] };
    if (data.tasks) all.push(...data.tasks);
  }
  return all;
}

export function loadFceDaily(monthNum: number): FCEDailySchedule | null {
  const padded = String(monthNum).padStart(2, "0");
  const filePath = path.join(fceDir, "daily", `month-${padded}.yaml`);
  if (!fs.existsSync(filePath)) return null;
  return yaml.load(fs.readFileSync(filePath, "utf8")) as FCEDailySchedule;
}

export function loadAllFceDays(): FCEDayEntry[] {
  const dir = path.join(fceDir, "daily");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
  const all: FCEDayEntry[] = [];
  for (const f of files) {
    const data = yaml.load(fs.readFileSync(path.join(dir, f), "utf8")) as FCEDailySchedule;
    if (data.days) all.push(...data.days);
  }
  return all;
}

/** Resolve a daily entry's references into actual content objects */
export function resolveDailyContent(day: FCEDayEntry) {
  const readings = loadAllFceReadings();
  const vocab = loadAllFceVocab();
  const grammar = loadFceGrammar();
  const uoe = loadFceUoE();
  const writing = loadFceWriting();

  const readingMap = new Map(readings.map((r) => [r.id, r]));
  const vocabMap = new Map(vocab.map((v) => [v.id, v]));
  const grammarMap = new Map(grammar.map((g) => [g.id, g]));
  const uoeMap = new Map(uoe.map((u) => [u.id, u]));
  const writingMap = new Map(writing.map((w) => [w.id, w]));

  return {
    readingData: day.reading ? readingMap.get(day.reading) ?? null : null,
    vocabData: [...day.newVocab, ...day.reviewVocab]
      .map((id) => vocabMap.get(id))
      .filter((v): v is FCEVocabEntry => !!v),
    newVocabIds: new Set(day.newVocab),
    grammarData: day.grammar
      .map((id) => grammarMap.get(id))
      .filter((g): g is FCEGrammarQuestion => !!g),
    uoeData: day.useOfEnglish
      .map((id) => uoeMap.get(id))
      .filter((u): u is FCEUoEQuestion => !!u),
    writingData: day.writing ? writingMap.get(day.writing) ?? null : null,
  };
}

// ── Types ────────────────────────────────────────────────

export interface FCEQuest {
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

export interface FCELesson {
  id: string;
  title: string;
  titleZh: string;
  introduction: string;
  introductionZh: string;
  rules: FCERule[];
  tips: string[];
  tipsZh: string[];
  practicePreview: FCEPracticeQuestion[];
}

export interface FCERule {
  pattern: string;
  meaning: string;
  meaningZh: string;
  examples: {
    base: string;
    transformed: string;
    sentence: string;
    sentenceZh: string;
  }[];
}

export interface FCEPracticeQuestion {
  id: string;
  question: string;
  questionZh: string;
  answer: string;
  explanation: string;
  explanationZh: string;
}

export interface FCEReading {
  id: string;
  title: string;
  titleZh: string;
  level: number;
  wordCount: number;
  topic: string;
  tags: string[];
  passage: string;
  passageZh: string;
  vocabHighlights: { word: string; ref: string }[];
  questions: FCEReadingQuestion[];
}

export interface FCEReadingQuestion {
  id: string;
  type: string;
  question: string;
  questionZh: string;
  options: Record<string, string>;
  answer: string;
  explanation: string;
  explanationZh: string;
}

export interface FCEVocabEntry {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  definitionZh: string;
  exampleSentence: string;
  exampleSentenceZh: string;
  wordFamily: { form: string; partOfSpeech: string; note?: string }[];
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  level: number;
  firstAppear: string;
  reviewSchedule: string[];
}

export interface FCEGrammarQuestion {
  id: string;
  type: string;
  tags: string[];
  context: string;
  question: string;
  questionZh: string;
  answer: string;
  explanation: string;
  explanationZh: string;
  grammarPoint: string;
  relatedQuest: string;
  difficulty: number;
  // multiple-choice
  options?: Record<string, string>;
  optionsZh?: Record<string, string>;
  // cloze-passage
  passage?: string;
  passageZh?: string;
  blanks?: { id: string; answer: string }[];
}

export interface FCEUoEQuestion {
  id: string;
  type: string;
  tags: string[];
  context: string;
  sentence: string;
  sentenceZh: string;
  baseWord: string;
  answer: string;
  targetPartOfSpeech: string;
  explanation: string;
  explanationZh: string;
  grammarPoint: string;
  relatedQuest: string;
  difficulty: number;
}

export interface FCEWritingTask {
  id: string;
  type: string;
  title: string;
  titleZh: string;
  prompt: string;
  promptZh: string;
  targetWords: string;
  difficulty: number;
  relatedQuest: string;
  scaffold: {
    storyMap: Record<string, string>;
    mustUseWords: string[];
    mustUseStructure: string[];
    mustUseStructureZh: string[];
  };
  selfCheckList: string[];
  selfCheckListZh: string[];
  modelAnswer: string;
  modelAnswerZh: string;
}

export interface FCEDayEntry {
  id: string;
  dayOffset: number;
  reading: string | null;
  newVocab: string[];
  reviewVocab: string[];
  grammar: string[];
  useOfEnglish: string[];
  writing: string | null;
}

export interface FCEDailySchedule {
  month: number;
  quest: string;
  days: FCEDayEntry[];
}
