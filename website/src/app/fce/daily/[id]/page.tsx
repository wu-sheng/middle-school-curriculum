import {
  loadAllFceDays,
  resolveDailyContent,
  loadFceDaily,
} from "@/lib/loadFce";
import { notFound } from "next/navigation";
import FCEDailyView from "@/components/FCEDailyView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FCEDailyPage({ params }: Props) {
  const { id } = await params;
  const allDays = loadAllFceDays();
  const day = allDays.find((d) => d.id === id);
  if (!day) notFound();

  const monthNum = Math.ceil(day.dayOffset / 30);
  const schedule = loadFceDaily(monthNum);
  const quest = schedule?.quest ?? "Q01";

  const resolved = resolveDailyContent(day);

  return (
    <FCEDailyView
      day={day}
      month={monthNum}
      quest={quest}
      readingData={resolved.readingData}
      vocabData={resolved.vocabData}
      grammarData={resolved.grammarData}
      uoeData={resolved.uoeData}
      writingData={resolved.writingData}
    />
  );
}

export async function generateStaticParams() {
  const allDays = loadAllFceDays();
  return allDays.map((d) => ({ id: d.id }));
}
