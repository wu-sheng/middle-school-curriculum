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
  const html = renderMathInText(content, langOverride ?? lang, true);
  return (
    <div
      className={`math-block-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function fixMathSymbols(math: string): string {
  return math.replace(/℃/g, "{}^{\\circ}\\text{C}");
}

function renderMathInText(text: string, lang: Lang, blockMode = false): string {
  // 1. Handle keyword highlights <<中文/English>>
  let result = text.replace(/<<([^/]+)\/([^>]+)>>/g, (_, zh, en) => {
    const display = lang === "en" ? en : zh;
    const tooltip = lang === "en" ? zh : en;
    return `<span class="keyword-highlight" tabindex="0" data-zh="${zh}" data-en="${en}" data-tooltip="${tooltip}">${display}</span>`;
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

  // 5. Render Markdown tables (lines starting with |)
  result = result.replace(/((?:(?:^|\n)\|[^\n]+)+)/g, (tableBlock) => {
    const rows = tableBlock.trim().split("\n").map(r => r.trim()).filter(r => r.startsWith("|"));
    if (rows.length < 2) return tableBlock;
    const isSep = (r: string) => /^\|[-|\s:]+\|$/.test(r);
    const parse = (r: string) => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    const header = parse(rows[0]);
    const bodyStart = isSep(rows[1]) ? 2 : 1;
    const body = rows.slice(bodyStart);
    const th = header.map(c => `<th class="px-3 py-2 text-left text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-100 whitespace-nowrap">${c}</th>`).join("");
    const trs = body.map(r => {
      const cells = parse(r);
      const tds = cells.map((c, i) => `<td class="px-3 py-1.5 text-sm border border-gray-100 ${i === 0 ? "font-medium text-gray-700 bg-gray-50/50" : "text-gray-600"}">${c}</td>`).join("");
      return `<tr>${tds}</tr>`;
    }).join("");
    return `<div class="overflow-x-auto my-3"><table class="min-w-full border-collapse rounded-lg overflow-hidden text-sm"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`;
  });

  // 6. Convert markdown bold **...** to <strong>
  result = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 7. Convert newlines to block paragraphs (blockMode) or <br> (inline)
  //    Only outside HTML tags — KaTeX SVG paths contain newlines that must be preserved
  if (blockMode) {
    // Double newlines → paragraph breaks; single newlines → <br/>
    result = result.replace(/\n\n(?![^<]*>)/g, "</p><p>");
    result = `<p>${result}</p>`;
    result = result.replace(/\n(?![^<]*>)/g, "<br/>");
    // Remove empty paragraphs (e.g. from leading/trailing newlines)
    result = result.replace(/<p>\s*<\/p>/g, "");
  } else {
    result = result.replace(/\n(?![^<]*>)/g, "<br/>");
  }

  return result;
}
