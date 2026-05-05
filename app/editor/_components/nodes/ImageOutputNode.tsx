"use client";

import Image from "next/image";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useNodeflowStore } from "@/lib/store";


const C = "#ff57c8";

// After
export default function ImageOutputNode({ id, selected }: NodeProps) {
  const output = useNodeflowStore(s => s.outputs[id]);

  const status = output?.status ?? "idle";
  const url    = output?.url;
  const error  = output?.error;

  return (
    <div className={[
      "w-[260px] rounded-2xl flex flex-col bg-[#13131a] border transition-all duration-200 shadow-2xl",
      selected
        ? "border-[#ff57c8]/70 shadow-[0_0_30px_rgba(255,87,200,0.12)]"
        : "border-white/[0.08] hover:border-white/[0.16]",
    ].join(" ")}>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]">
        <div className="w-6 h-6 rounded-lg grid place-items-center"
          style={{ background: `${C}20`, border: `1px solid ${C}35` }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <rect x="1" y="1" width="9" height="9" rx="1.5" stroke={C} strokeWidth="1.4"/>
            <path d="M1 7.5l2.5-2.5 2 2 2-2.5 2.5 3" stroke={C} strokeWidth="1.1"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: C }}>
          Image Output
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {/* Status dot */}
          <div className={[
            "w-1.5 h-1.5 rounded-full transition-all",
            status === "loading" ? "animate-pulse bg-yellow-400" :
            status === "success" ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" :
            status === "error"   ? "bg-red-400"   : "",
          ].join(" ")}
            style={status === "idle" ? { background: C, boxShadow: `0 0 6px ${C}` } : {}}
          />
          <span className="text-[9px] text-white/20 tracking-widest uppercase">
            {status === "loading" ? "Working…" :
             status === "success" ? "Done" :
             status === "error"   ? "Error"  : "Output"}
          </span>
        </div>
      </div>

      {/* Preview */}
      <div className="px-4 py-4">
        <div className={[
          "w-full aspect-square rounded-xl overflow-hidden border relative",
          status === "loading" ? "border-yellow-400/20 bg-[#0a0a10]" :
          status === "success" ? "border-white/[0.1]" :
          status === "error"   ? "border-red-500/20 bg-[#0a0a10]" :
          "border-white/[0.06] bg-[#0a0a10]",
        ].join(" ")}>

          {/* Idle */}
          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="opacity-15">
                <rect x="2" y="2" width="24" height="24" rx="4" stroke="white" strokeWidth="1.5"/>
                <path d="M2 19l6-6 5 5 5-6 10 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="20" cy="9" r="2" fill="white" opacity="0.5"/>
              </svg>
              <span className="text-[9px] text-white/20 tracking-[0.1em] uppercase">Awaiting input</span>
            </div>
          )}

          {/* Loading spinner */}
          {status === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="relative w-10 h-10">
                <svg className="animate-spin w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
                  <circle cx="20" cy="20" r="16" stroke={C} strokeWidth="3"
                    strokeDasharray="60" strokeDashoffset="40" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[9px] text-white/30 tracking-widest uppercase">Generating…</span>
            </div>
          )}

          {/* Success — show image */}
          {status === "success" && url && (
            <Image
              src={url}
              alt="Generated"
              fill
              className="object-cover"
              unoptimized
            />
          )}

          {/* Error */}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="opacity-60">
                <circle cx="11" cy="11" r="9" stroke="#f87171" strokeWidth="1.5"/>
                <path d="M11 7v5M11 15h.01" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-[9px] text-red-400/80 text-center leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        {status === "success" && url && (
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-mono text-white/30">Generated</span>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseDown={e => e.stopPropagation()}
              className="nodrag nopan text-[9px] font-mono text-white/20 hover:text-white/60 transition-colors underline underline-offset-2"
            >
              Open ↗
            </a>
          </div>
        )}

        {status === "idle" && (
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[9px] font-mono text-white/15">— idle</span>
            <span className="text-[9px] font-mono text-white/15">PNG / WEBP</span>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="input"
        style={{ left: -7, width: 14, height: 14, borderRadius: "50%",
          border: `2.5px solid ${C}`, background: "#13131a", cursor: "crosshair" }} />
    </div>
  );
}