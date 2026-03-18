import { loadFceQuest } from "@/lib/loadFce";
import { notFound } from "next/navigation";
import FCEQuestView from "@/components/FCEQuestView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FCEQuestPage({ params }: Props) {
  const { id } = await params;
  const quest = loadFceQuest(id);
  if (!quest) notFound();
  return <FCEQuestView quest={quest} />;
}

export async function generateStaticParams() {
  // List available quest files
  const fs = await import("fs");
  const path = await import("path");
  const dir = path.join(process.cwd(), "src", "data", "english", "fce", "quests");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f: string) => f.endsWith(".yaml"))
    .map((f: string) => ({ id: f.replace(".yaml", "") }));
}
