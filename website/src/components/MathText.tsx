"use client";

import katex from "katex";
import "katex/dist/katex.min.css";
import { useLang, type Lang } from "@/lib/i18n";

interface MathTextProps {
  content: string;
  className?: string;
}

export default function MathText({ content, className = "", langOverride }: MathTextProps & { langOverride?: "zh" | "en" }) {
  const { lang } = useLang();
  const html = renderMathInText(content, langOverride ?? lang);
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function MathBlock({ content, className = "", langOverride }: MathTextProps & { langOverride?: "zh" | "en" }) {
  const { lang } = useLang();
  const html = renderMathInText(content, langOverride ?? lang);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function fixMathSymbols(math: string): string {
  return math.replace(/℃/g, "{}^{\\circ}\\text{C}");
}

function renderMathInText(text: string, lang: Lang): string {
  // 1. Handle keyword highlights <<中文/English>>
  let result = text.replace(/<<([^/]+)\/([^>]+)>>/g, (_, zh, en) => {
    const display = lang === "en" ? en : zh;
    const tooltip = lang === "en" ? zh : en;
    return `<span class="keyword-highlight" title="${tooltip}" tabindex="0" data-zh="${zh}" data-en="${en}">${display}</span>`;
  });

  // 2. Handle display math $$...$$
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(fixMathSymbols(math.trim()), {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return `<span class="text-red-500">${math}</span>`;
    }
  });

  // 3. Handle inline math $...$
  result = result.replace(/\$([^\$]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(fixMathSymbols(math.trim()), {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return `<span class="text-red-500">${math}</span>`;
    }
  });

  // 4. Replace ℃ outside math with plain °C
  result = result.replace(/℃/g, "°C");

  // 6. Convert markdown bold **...** to <strong>
  result = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 7. Convert newlines to <br>, but only outside HTML tags
  //    (KaTeX SVG paths contain newlines that must be preserved)
  result = result.replace(/\n(?![^<]*>)/g, "<br/>");

  return result;
}
