"use client";

import { useState } from "react";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: "answer" | "step" | "default";
}

export default function Collapsible({
  title,
  children,
  defaultOpen = false,
  variant = "default",
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variantStyles = {
    answer:
      "border-pink-100 bg-pink-50/30 hover:bg-pink-50/50",
    step:
      "border-purple-100 bg-purple-50/30 hover:bg-purple-50/50",
    default:
      "border-gray-100 bg-gray-50/30 hover:bg-gray-50/50",
  };

  const iconColor = {
    answer: "text-pink-400",
    step: "text-purple-400",
    default: "text-gray-400",
  };

  return (
    <div className={`border rounded-xl overflow-hidden my-3 ${variantStyles[variant]}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left font-medium transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className={iconColor[variant]}>
            {variant === "answer" ? "🐨" : variant === "step" ? "🦙" : "🐼"}
          </span>
          {title}
        </span>
        <span
          className={`transform transition-transform duration-200 ${iconColor[variant]} ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-inherit">
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  );
}
