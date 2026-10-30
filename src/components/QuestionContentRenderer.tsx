"use client";

import React, { useMemo } from "react";
import katex from "katex";
import DigrafVisual from "./DigrafVisual";

interface QuestionContentRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export default function QuestionContentRenderer({
  content,
  className = "",
  block = false,
}: QuestionContentRendererProps) {
  // Check if content contains [VISUAL:...] markers
  // Handles both DIGRAF: [...] and MATRIX: [VISUAL:MATRIX:...:[[...]]] with nested brackets
  const visualRegex = /(\[VISUAL:(?:DIGRAF:[^\]]+\]|MATRIX:[\s\S]*?\]\]\]))/g;
  const segments = content.split(visualRegex);

  return (
    <div className={`space-y-2 ${className}`}>
      {segments.map((seg, idx) => {
        if (!seg) return null;

        // Visual: Matrix format: [VISUAL:MATRIX:3x2:[[0,0],[1,0],[1,1]]]
        if (seg.startsWith("[VISUAL:MATRIX:")) {
          try {
            const raw = seg.slice(15, -1); // e.g. 3x2:[[0,0],[1,0],[1,1]]
            const parts = raw.split(":");
            const matrixJson = parts.slice(1).join(":");
            const matrixData = JSON.parse(matrixJson);
            return <DigrafVisual key={idx} type="matrix" matrixData={matrixData} />;
          } catch (e) {
            return null;
          }
        }

        // Visual: Digraf format: [VISUAL:DIGRAF:4nodes:edges:1-1,1-3,...]
        if (seg.startsWith("[VISUAL:DIGRAF:")) {
          try {
            const raw = seg.slice(15, -1); // 4nodes:edges:1-1,1-3...
            const edgePart = raw.split("edges:")[1] || "";
            const edgeList = edgePart.split(",").filter(Boolean);
            const edges = edgeList.map((e) => {
              const [from, to] = e.trim().split("-");
              return {
                from,
                to,
                isSelfLoop: from === to,
                curved: (from === "1" && to === "3") || (from === "2" && to === "4"),
              };
            });
            return <DigrafVisual key={idx} type="digraf" edges={edges} />;
          } catch (e) {
            return null;
          }
        }

        // Standard text/math segment
        return (
          <LatexRendererSection key={idx} text={seg} block={block} />
        );
      })}
    </div>
  );
}

function LatexRendererSection({ text, block }: { text: string; block?: boolean }) {
  const renderedElements = useMemo(() => {
    if (!text) return null;

    // Preserve LaTeX commands starting with \n (such as \ne, \neg, \nabla, \notin, \nu, \not)
    // Only convert literal escaped \n that is NOT followed by a letter into a newline
    const raw = text.replace(/\\r\\n/g, "\n").replace(/\\n(?![a-zA-Z])/g, "\n");

    // Matches $$...$$, \[...\], $...$, \(...\)
    const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\([\s\S]*?\\\))/g;
    const parts = raw.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Display math $$ ... $$
      if (part.startsWith("$$") && part.endsWith("$$") && part.length >= 4) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
            output: "html",
          });
          return (
            <div
              key={index}
              className="my-3 overflow-x-auto py-1 text-center text-slate-100 font-serif"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <div key={index} className="my-1 font-mono text-xs text-rose-400">{part}</div>;
        }
      }

      // Display math \[ ... \]
      if (part.startsWith("\\[") && part.endsWith("\\]") && part.length >= 4) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
            output: "html",
          });
          return (
            <div
              key={index}
              className="my-3 overflow-x-auto py-1 text-center text-slate-100 font-serif"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <div key={index} className="my-1 font-mono text-xs text-rose-400">{part}</div>;
        }
      }

      // Inline math $ ... $
      if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
            output: "html",
          });
          return (
            <span
              key={index}
              className="inline-block px-1 align-baseline text-slate-100 font-medium"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={index} className="font-mono text-xs text-rose-400">{part}</span>;
        }
      }

      // Inline math \( ... \)
      if (part.startsWith("\\(") && part.endsWith("\\)") && part.length >= 4) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
            output: "html",
          });
          return (
            <span
              key={index}
              className="inline-block px-1 align-baseline text-slate-100 font-medium"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={index} className="font-mono text-xs text-rose-400">{part}</span>;
        }
      }

      // Plain text (handles bold **...**)
      const lines = part.split("\n");
      return (
        <span key={index}>
          {lines.map((line, lIdx) => {
            const boldRegex = /(\*\*.*?\*\*)/g;
            const segments = line.split(boldRegex);

            return (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {segments.map((seg, sIdx) => {
                  if (seg.startsWith("**") && seg.endsWith("**") && seg.length >= 4) {
                    return (
                      <strong key={sIdx} className="font-semibold text-orange-400">
                        {seg.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={sIdx}>{seg}</span>;
                })}
              </React.Fragment>
            );
          })}
        </span>
      );
    });
  }, [text]);

  if (block) {
    return <div className="leading-relaxed text-slate-200">{renderedElements}</div>;
  }
  return <span className="leading-relaxed text-slate-200">{renderedElements}</span>;
}

