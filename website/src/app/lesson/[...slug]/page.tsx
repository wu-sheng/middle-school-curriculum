import { loadCurriculum, loadLessonContent } from "@/lib/loadYaml";
import { notFound } from "next/navigation";
import LessonView from "@/components/LessonView";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  if (slug.length !== 3) notFound();

  const [subject, grade, chapterId] = slug;
  const curriculum = loadCurriculum();
  const lesson = loadLessonContent(subject, grade, chapterId);

  if (!lesson) notFound();

  // Find chapter info from curriculum
  const subjectData = curriculum.subjects.find((s) => s.id === subject);
  const gradeData = subjectData?.grades.find((g) => g.id === grade);
  let chapterData = null;
  if (gradeData) {
    for (const sem of gradeData.semesters) {
      const found = sem.chapters.find((ch) => ch.id === chapterId);
      if (found) {
        chapterData = found;
        break;
      }
    }
  }

  return (
    <LessonView
      lesson={lesson}
      chapterNumber={chapterData?.number ?? lesson.chapter}
      chapterNameEn={chapterData?.nameEn ?? lesson.titleEn}
    />
  );
}

export async function generateStaticParams() {
  const curriculum = loadCurriculum();
  const params: { slug: string[] }[] = [];

  for (const subject of curriculum.subjects) {
    for (const grade of subject.grades) {
      for (const semester of grade.semesters) {
        for (const chapter of semester.chapters) {
          if (chapter.hasContent) {
            params.push({
              slug: [subject.id, grade.id, chapter.id],
            });
          }
        }
      }
    }
  }

  return params;
}
