"use client";

import { useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export interface LLMNode extends Record<string, unknown> {
  model?: string;
}

const MODELS = [
  { id: "flux",   label: "FLUX.1",              badge: "Image" },
  { id: "gpt4o",  label: "GPT-4o",              badge: "Text"  },
  { id: "claude", label: "Claude 3.5 Sonnet",   badge: "Text"  },
  { id: "sdxl",   label: "Stable Diffusion XL", badge: "Image" },
  { id: "gemini", label: "Gemini 1.5 Pro",      badge: "Text"  },
];

const C = "#57c8ff";

// Safe fallback so active is never undefined
const DEFAULT_MODEL = MODELS[0];

export default function LLMNode({ data, selected }: NodeProps<LLMNode>) {
  // Ensure the incoming model id actually exists in our list; fall back to first
  const resolvedId = MODELS.find(m => m.id === data.model)?.id ?? DEFAULT_MODEL.id;
  const [modelId, setModelId] = useState<string>(resolvedId);

  // Always defined — never undefined
  const active = MODELS.find(m => m.id === modelId) ?? DEFAULT_MODEL;

  return (
    <div className={[
      "w-[260px] rounded-2xl flex flex-col bg-[#13131a] border transition-all duration-200 shadow-2xl",
      selected
        ? "border-[#57c8ff]/70 shadow-[0_0_30px_rgba(87,200,255,0.12)]"
        : "border-white/[0.08] hover:border-white/[0.16]",
    ].join(" ")}>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]">
        <div
          className="w-6 h-6 rounded-lg grid place-items-center"
          style={{ background: `${C}20`, border: `1px solid ${C}35` }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="5.5" r="3.5" stroke={C} strokeWidth="1.4" />
            <circle cx="5.5" cy="5.5" r="1.4" fill={C} />
          </svg>
        </div>
        <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: C }}>
          LLM Model
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[9px] text-white/20 tracking-widest uppercase">Process</span>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: C, boxShadow: `0 0 6px ${C}` }} />
        </div>
      </div>

      {/* Active model pill */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-white/20 mb-2">Active Model</p>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0a0a10] border border-white/[0.07]">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C }} />
          <span className="text-[12px] text-white/80 font-medium">{active.label}</span>
          <span
            className="ml-auto text-[9px] px-1.5 py-0.5 rounded-md font-mono"
            style={{ background: `${C}15`, color: C, border: `1px solid ${C}25` }}
          >
            {active.badge}
          </span>
        </div>
      </div>

      {/* Model selector */}
      <div className="px-4 pb-4" onMouseDown={e => e.stopPropagation()}>
        <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-white/20 mb-2">Select</p>
        <div className="flex flex-col gap-1">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => setModelId(m.id)}
              className={[
                "nodrag nopan w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all",
                modelId === m.id
                  ? "bg-[#57c8ff]/10 border-[#57c8ff]/35 text-white/90"
                  : "bg-white/[0.02] border-white/[0.05] text-white/35 hover:text-white/65 hover:border-white/[0.12]",
              ].join(" ")}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all"
                style={{ background: modelId === m.id ? C : "rgba(255,255,255,0.15)" }}
              />
              <span className="text-[11px] font-medium">{m.label}</span>
              <span className="ml-auto text-[9px] font-mono text-white/20">{m.badge}</span>
            </button>
          ))}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{
          left: -7, width: 14, height: 14,
          borderRadius: "50%", border: `2.5px solid ${C}`,
          background: "#13131a", cursor: "crosshair",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          right: -7, width: 14, height: 14,
          borderRadius: "50%", border: `2.5px solid ${C}`,
          background: "#13131a", cursor: "crosshair",
        }}
      />
    </div>
  );
}