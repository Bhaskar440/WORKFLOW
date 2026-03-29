"use client";

import { useState, useCallback } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export interface TextInputNodeData extends Record<string, unknown> {
  prompt?: string;
  width?: number;
  height?: number;
}

type Preset = { label: string; w: number; h: number; tag: string };

const PRESETS: Preset[] = [
  { label: "1:1",  w: 1024, h: 1024, tag: "Square"    },
  { label: "16:9", w: 1344, h: 768,  tag: "Landscape" },
  { label: "9:16", w: 768,  h: 1344, tag: "Portrait"  },
  { label: "4:3",  w: 1024, h: 768,  tag: "Standard"  },
];

const MAX = 500;

export default function TextInputNode({ data, selected }: NodeProps<TextInputNodeData>) {
  const [prompt, setPrompt] = useState(data.prompt ?? "");
  const [width,  setWidth]  = useState(data.width  ?? 1024);
  const [height, setHeight] = useState(data.height ?? 1024);
  const [preset, setPreset] = useState<string>("1:1");
  const [wErr,   setWErr]   = useState(false);
  const [hErr,   setHErr]   = useState(false);

  const applyPreset = useCallback((p: Preset) => {
    setWidth(p.w); setHeight(p.h); setPreset(p.label);
    setWErr(false); setHErr(false);
  }, []);

  const handleDim = (axis: "w" | "h", raw: string) => {
    const n = parseInt(raw, 10);
    const ok = !isNaN(n) && n >= 64 && n <= 4096;
    if (axis === "w") { setWidth(isNaN(n) ? 0 : n); setWErr(!ok); }
    else              { setHeight(isNaN(n) ? 0 : n); setHErr(!ok); }
    setPreset("");
  };

  const pct = (prompt.length / MAX) * 100;

  return (
    <div className={[
      "w-[300px] rounded-2xl flex flex-col bg-[#13131a]",
      "border transition-all duration-200 shadow-2xl",
      selected
        ? "border-[#c8ff57]/70 shadow-[0_0_30px_rgba(200,255,87,0.15)]"
        : "border-white/[0.08] hover:border-white/[0.16]",
    ].join(" ")}>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]">
        <div className="w-6 h-6 rounded-lg bg-[#c8ff57]/20 border border-[#c8ff57]/30 grid place-items-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 2h8M1 5h5M1 8h7" stroke="#c8ff57" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#c8ff57]">Text Prompt</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[9px] text-white/20 tracking-widest uppercase">Input</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#c8ff57] shadow-[0_0_6px_#c8ff57]" />
        </div>
      </div>

      {/* Prompt */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-white/20 mb-1.5">Prompt</p>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={e => { if (e.target.value.length <= MAX) setPrompt(e.target.value); }}
            onMouseDown={e => e.stopPropagation()}
            placeholder="Describe what you want to generate…"
            rows={4}
            spellCheck={false}
            className="nodrag nopan w-full resize-none rounded-xl px-3 py-2.5 text-[12px] leading-relaxed
                       bg-[#0a0a10] border border-white/[0.07] text-white/75 placeholder:text-white/15
                       outline-none transition-colors focus:border-[#c8ff57]/50 focus:bg-[#0d0d14]"
          />
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
            <div className="w-14 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: pct > 85 ? "#ff7a57" : "#c8ff57" }}
              />
            </div>
            <span className="text-[9px] tabular-nums text-white/15">{prompt.length}/{MAX}</span>
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="px-4 pb-4 pt-1">
        <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-white/20 mb-2">Dimensions</p>

        {/* Presets */}
        <div className="flex gap-1.5 mb-3" onMouseDown={e => e.stopPropagation()}>
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              title={p.tag}
              className={[
                "nodrag nopan flex-1 py-1.5 rounded-lg text-[10px] font-mono font-semibold border transition-all",
                preset === p.label
                  ? "bg-[#c8ff57]/15 border-[#c8ff57]/50 text-[#c8ff57]"
                  : "bg-white/[0.03] border-white/[0.07] text-white/25 hover:text-white/60 hover:border-white/20",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* W × H — fixed: no map with Fragment, written out explicitly */}
        <div className="flex items-center gap-2" onMouseDown={e => e.stopPropagation()}>
          {/* Width */}
          <div className="flex-1">
            <p className="text-[9px] text-white/20 mb-1 tracking-widest uppercase">W</p>
            <div className={[
              "flex items-center rounded-lg border px-2.5 py-1.5 gap-1 transition-colors",
              wErr ? "border-[#ff7a57]/50 bg-[#ff7a57]/5" : "border-white/[0.07] bg-[#0a0a10]",
            ].join(" ")}>
              <input
                type="number"
                value={width || ""}
                min={64} max={4096}
                onChange={e => handleDim("w", e.target.value)}
                placeholder="1024"
                className="nodrag nopan w-full bg-transparent text-[12px] font-mono text-white/75 outline-none
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-[9px] text-white/15 shrink-0">px</span>
            </div>
            {wErr && <p className="text-[9px] text-[#ff7a57] mt-0.5">64–4096</p>}
          </div>

          {/* Separator */}
          <div className="flex flex-col items-center gap-0.5 mt-4">
            <div className="w-2.5 h-px bg-white/10" />
            <span className="text-[10px] text-white/15">×</span>
            <div className="w-2.5 h-px bg-white/10" />
          </div>

          {/* Height */}
          <div className="flex-1">
            <p className="text-[9px] text-white/20 mb-1 tracking-widest uppercase">H</p>
            <div className={[
              "flex items-center rounded-lg border px-2.5 py-1.5 gap-1 transition-colors",
              hErr ? "border-[#ff7a57]/50 bg-[#ff7a57]/5" : "border-white/[0.07] bg-[#0a0a10]",
            ].join(" ")}>
              <input
                type="number"
                value={height || ""}
                min={64} max={4096}
                onChange={e => handleDim("h", e.target.value)}
                placeholder="1024"
                className="nodrag nopan w-full bg-transparent text-[12px] font-mono text-white/75 outline-none
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-[9px] text-white/15 shrink-0">px</span>
            </div>
            {hErr && <p className="text-[9px] text-[#ff7a57] mt-0.5">64–4096</p>}
          </div>
        </div>

        {/* Size label */}
        {!wErr && !hErr && width > 0 && height > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            <div className="h-px flex-1 bg-white/[0.04]" />
            <span className="text-[9px] font-mono text-white/15">{width} × {height} px</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          right: -7, width: 14, height: 14,
          borderRadius: "50%", border: "2.5px solid #c8ff57",
          background: "#13131a", cursor: "crosshair",
        }}
      />
    </div>
  );
}