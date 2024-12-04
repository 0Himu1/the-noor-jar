import { Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Verse } from "../types";

interface VerseCardProps {
  verse: Verse;
  color: string;
}

export function VerseCard({ verse, color }: VerseCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${verse.arabic}\n\n${verse.translation}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); // Reset after 1 second
    });
  };

  return (
    <div
      className={`rounded-lg shadow-lg p-6 space-y-4 max-w-[800px] w-full`}
      style={{
        backgroundColor: color,
        boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="space-y-4">
        <p className="text-xl text-right font-arabic overflow-hidden text-ellipsis">
          {verse.arabic}
        </p>
        <p className="text-gray-800 overflow-hidden text-ellipsis whitespace-normal">
          {verse.translation}
        </p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="p-2 text-gray-600 hover:text-green-600"
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
