// Client-safe curriculum data - imported at build time via Next.js bundler
// This avoids fs/path imports in client components

import curriculumRaw from "@/data/curriculum.json";

export interface ClientCurriculum {
  subjects: {
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    grades: {
      id: string;
      name: string;
      nameEn: string;
      semesters: {
        id: string;
        name: string;
        nameEn: string;
        chapters: {
          id: string;
          number: number;
          name: string;
          nameEn: string;
          hasContent: boolean;
        }[];
      }[];
    }[];
  }[];
}

export function loadCurriculumClient(): ClientCurriculum {
  return curriculumRaw as ClientCurriculum;
}
