import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const dataDir = path.join(process.cwd(), "src", "data");

export function loadCurriculum() {
  const filePath = path.join(dataDir, "curriculum.yaml");
  const content = fs.readFileSync(filePath, "utf8");
  return yaml.load(content) as CurriculumData;
}

export function loadLessonContent(
  subject: string,
  grade: string,
  chapterId: string
) {
  const filePath = path.join(dataDir, subject, grade, `${chapterId}.yaml`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf8");
  return yaml.load(content) as LessonContent;
}

// Types
export interface CurriculumData {
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  grades: Grade[];
}

export interface Grade {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  semesters: Semester[];
}

export interface Semester {
  id: string;
  name: string;
  nameEn: string;
  version: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  number: number;
  name: string;
  nameEn: string;
  hasContent: boolean;
  topics: string[];
  topicsEn?: string[];
}

export interface LessonContent {
  title: string;
  titleEn: string;
  chapter: number;
  subject: string;
  grade: string;
  semester: string;
  estimatedTime: string;
  targetAudience: string;
  objectives: string[];
  prerequisites: {
    title: string;
    intro: string;
    knownNumbers: string[];
    canSolve: string[];
    cannotSolve: string[];
    conclusion: string;
  };
  concepts: ConceptSection[];
  realLife: RealLifeExample[];
  examples: ExampleProblem[];
  commonMistakes: string[];
  exercises: {
    timeGuide: {
      total: string;
      sections: { range: string; time: string }[];
    };
    questions: ExerciseQuestion[];
  };
  summary: string[];
  examPrep?: {
    intro: string;
    introEn?: string;
    questions: ExerciseQuestion[];
  };
}

export interface ConceptSection {
  id: string;
  title: string;
  content: string;
  examples?: string[];
  notes?: string[];
  classification?: { name: string; examples: string }[];
  summary?: string;
  rules?: string[];
  purposes?: string[];
  explanation?: string;
  hasVisualization?: boolean;
}

export interface RealLifeExample {
  category: string;
  positive: string;
  negative: string;
}

export interface NumberLineConfig {
  points: (number | { value: number; label?: string })[];
  min?: number;
  max?: number;
}

export interface ExampleProblem {
  type: number;
  title: string;
  question: string;
  steps: string[];
  answer: string;
  numberLine?: NumberLineConfig;
  stepsNumberLine?: NumberLineConfig;
}

export interface SubInput {
  prompt: string;
  options: string[];
  correctValue: string;
}

export interface ExerciseQuestion {
  number: number;
  type: string;
  inputType?: "blank" | "truefalse" | "choice" | "open";
  section: string;
  question: string;
  subQuestions?: string[];
  subInputs?: SubInput[];
  correctValue?: string;
  answer: string;
  explanation: string;
  numberLine?: NumberLineConfig;
}
