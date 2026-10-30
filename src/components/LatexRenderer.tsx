"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface LatexRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export default function LatexRenderer({
  content,
  className = "",
  block = false,
}: LatexRendererProps) {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // DO NOT use .replace(/\\n/g) which damages commands like \ne, \neg, \nabla
    const raw = content;

    // Regular expressions for LaTeX segments
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
              className="my-3 overflow-x-auto py-1 text-center text-slate-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return (
            <div key={index} className="my-1 font-mono text-xs text-rose-400">
              {part}
            </div>
          );
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
              className="my-3 overflow-x-auto py-1 text-center text-slate-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return (
            <div key={index} className="my-1 font-mono text-xs text-rose-400">
              {part}
            </div>
          );
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
              className="inline-block px-0.5 align-baseline text-slate-100 font-medium"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return (
            <span key={index} className="font-mono text-xs text-rose-400">
              {part}
            </span>
          );
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
              className="inline-block px-0.5 align-baseline text-slate-100 font-medium"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return (
            <span key={index} className="font-mono text-xs text-rose-400">
              {part}
            </span>
          );
        }
      }

      // Plain text part (handle real newlines and bold **text**)
      const lines = part.split("\n");
      return (
        <span key={index}>
          {lines.map((line, lineIdx) => {
            const boldRegex = /(\*\*.*?\*\*)/g;
            const segments = line.split(boldRegex);

            return (
              <React.Fragment key={lineIdx}>
                {lineIdx > 0 && <br />}
                {segments.map((seg, segIdx) => {
                  if (seg.startsWith("**") && seg.endsWith("**") && seg.length >= 4) {
                    return (
                      <strong key={segIdx} className="font-semibold text-orange-400">
                        {seg.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={segIdx}>{seg}</span>;
                })}
              </React.Fragment>
            );
          })}
        </span>
      );
    });
  }, [content]);

  if (block) {
    return <div className={`latex-block leading-relaxed ${className}`}>{renderedElements}</div>;
  }

  return <span className={`latex-inline leading-relaxed ${className}`}>{renderedElements}</span>;
}
