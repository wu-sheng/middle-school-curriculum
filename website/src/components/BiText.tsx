"use client";

import { useLang } from "@/lib/i18n";
import MathText, { MathBlock } from "./MathText";

/** Renders bilingual text stacked (zh on top, en below) in "both" mode,
 *  or single language in zh/en modes. */
export function BiText({ zh, en, className = "" }: { zh: string; en: string; className?: string }) {
  const { lang } = useLang();
  if (lang === "zh") return <MathText content={zh} className={className} />;
  if (lang === "en") return <MathText content={en || zh} className={className} />;
  // both mode
  return (
    <span className={className}>
      <MathText content={zh} langOverride="zh" />
      {en && <span className="block text-sm text-gray-400 mt-0.5"><MathText content={en} langOverride="en" /></span>}
    </span>
  );
}

/** Block version of BiText */
export function BiBlock({ zh, en, className = "" }: { zh: string; en: string; className?: string }) {
  const { lang } = useLang();
  if (lang === "zh") return <MathBlock content={zh} className={className} />;
  if (lang === "en") return <MathBlock content={en || zh} className={className} />;
  // both mode
  return (
    <div className={className}>
      <MathBlock content={zh} langOverride="zh" />
      {en && <div className="text-sm text-gray-400 mt-1"><MathBlock content={en} langOverride="en" /></div>}
    </div>
  );
}

/** Renders a simple string pair (no math parsing) in bilingual mode */
export function BiLabel({ zh, en }: { zh: string; en: string }) {
  const { lang } = useLang();
  if (lang === "zh") return <>{zh}</>;
  if (lang === "en") return <>{en || zh}</>;
  return (
    <span>
      {zh}
      {en && <span className="text-sm text-gray-400 ml-1">({en})</span>}
    </span>
  );
}
