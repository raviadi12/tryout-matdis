"use client";

import React from "react";
import LatexRenderer from "./LatexRenderer";

export interface DigrafVisualProps {
  type?: "digraf" | "hasse" | "matrix";
  matrixData?: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  nodes?: { id: string; label: string; x: number; y: number }[];
  edges?: { from: string; to: string; label?: string; isSelfLoop?: boolean; curved?: boolean }[];
  className?: string;
}

export default function DigrafVisual({
  type = "digraf",
  matrixData,
  nodes,
  edges,
  className = "",
}: DigrafVisualProps) {
  // If Matrix visualization: Render in true LaTeX syntax with pmatrix / bmatrix
  if (type === "matrix" && matrixData) {
    const latexRows = matrixData
      .map((row) => row.join(" & "))
      .join(" \\\\ ");
    const latexString = `M_R = \\begin{pmatrix} ${latexRows} \\end{pmatrix}`;

    return (
      <div className={`my-3 flex flex-col items-center justify-center p-3 bg-[#111419] border border-[#222731] ${className}`}>
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
          Matriks Representasi Relasi
        </span>
        <div className="text-base py-1">
          <LatexRenderer content={`$${latexString}$`} />
        </div>
      </div>
    );
  }

  // Digraf SVG representation
  const defaultNodes = nodes || [
    { id: "1", label: "1", x: 55, y: 50 },
    { id: "2", label: "2", x: 195, y: 50 },
    { id: "3", label: "3", x: 195, y: 165 },
    { id: "4", label: "4", x: 55, y: 165 },
  ];

  const nodeMap = new Map(defaultNodes.map((n) => [n.id, n]));
  const activeEdges = edges || [];

  return (
    <div className={`my-3 flex flex-col items-center justify-center p-3 bg-[#111419] border border-[#222731] ${className}`}>
      <div className="flex items-center justify-between w-full max-w-[260px] mb-2 px-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Graf Berarah (Digraf)
        </span>
        <span className="text-[10px] text-orange-400 font-mono bg-[#171b22] px-1.5 py-0.5 border border-[#28303e]">
          V={defaultNodes.length} &bull; E={activeEdges.length}
        </span>
      </div>

      <svg width="250" height="215" viewBox="0 0 250 215" className="overflow-visible select-none">
        <defs>
          <marker
            id="arrowhead-orange"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
          </marker>
        </defs>

        {/* Edges */}
        {activeEdges.map((edge, idx) => {
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;

          // Self loop
          if (edge.from === edge.to || edge.isSelfLoop) {
            const rx = fromNode.x;
            const ry = fromNode.y;
            return (
              <g key={`loop-${idx}`}>
                <path
                  d={`M ${rx - 5} ${ry - 13} C ${rx - 22} ${ry - 40}, ${rx + 22} ${ry - 40}, ${rx + 5} ${ry - 13}`}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="1.75"
                  markerEnd="url(#arrowhead-orange)"
                />
              </g>
            );
          }

          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const r = 16;

          const startX = fromNode.x + (dx / dist) * r;
          const startY = fromNode.y + (dy / dist) * r;
          const endX = toNode.x - (dx / dist) * (r + 4);
          const endY = toNode.y - (dy / dist) * (r + 4);

          if (edge.curved) {
            const midX = (startX + endX) / 2 - (dy / dist) * 15;
            const midY = (startY + endY) / 2 + (dx / dist) * 15;
            return (
              <path
                key={`edge-${idx}`}
                d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                fill="none"
                stroke="#f97316"
                strokeWidth="1.75"
                markerEnd="url(#arrowhead-orange)"
              />
            );
          }

          return (
            <line
              key={`edge-${idx}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#f97316"
              strokeWidth="1.75"
              markerEnd="url(#arrowhead-orange)"
            />
          );
        })}

        {/* Nodes */}
        {defaultNodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="15"
              fill="#171b22"
              stroke="#2e3541"
              strokeWidth="1.5"
            />
            <text
              x={node.x}
              y={node.y + 4}
              fill="#f8fafc"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
