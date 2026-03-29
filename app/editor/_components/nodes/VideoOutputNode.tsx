"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useNodeflowStore } from "@/lib/store";

export interface VideoOutputNode extends Record<string, unknown> {}

const C = "#ff7a57";

export default function VideoOutputNode({ id, selected }: NodeProps<VideoOutputNode>) {
  const output = useNodeflowStore(s => s.outputs[id]);

  const status = output?.status ?? "idle";
  const url    = output?.url;
  const error  = output?.error;

  return (
    <div className={[
      "w-[260px] rounded-2xl flex flex-col bg-[#13131a] border transition-all duration-200 shadow-2xl",
      selected
        ? "border-[#ff7a57]/70 shadow-[0_0_30px_rgba(255,122,87,0.12)]"
        : "border-white/[0.08] hover:border-white/[0.16]",
    ].join(" ")}>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]">
        <div className="w-6 h-6 rounded-lg grid place-items-center"
          style={{ background: `${C}20`, border: `1px solid ${C}35` }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1.5 3h5a1 1 0 011 1v3a1 1 0 01-1 1h-5a1 1 0 01-1-1V4a1 1 0 011-1z"
              stroke={C} strokeWidth="1.4"/>
            <path d="M7.5 4.5l2.5-1.5v5L7.5 6.5" stroke={C} strokeWidth="1.4"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: C }}>
          Video Output
        </span>
        <div className="ml-auto flex items-center gap-1.5">
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
          "w-full rounded-xl overflow-hidden border relative",
          status === "loading" ? "border-yellow-400/20 bg-[#0a0a10]" :
          status === "success" ? "border-white/[0.1]" :
          status === "error"   ? "border-red-500/20 bg-[#0a0a10]" :
          "border-white/[0.06] bg-[#0a0a10]",
        ].join(" ")} style={{ aspectRatio: "16/9" }}>

          {/* Idle */}
          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="w-10 h-10 rounded-full border border-white/10 grid place-items-center opacity-25">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4 3l8 4-8 4V3z" fill="white"/>
                </svg>
              </div>
              <span className="text-[9px] text-white/20 tracking-[0.1em] uppercase">Awaiting input</span>
            </div>
          )}

          {/* Loading */}
          {status === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="relative w-10 h-10">
                <svg className="animate-spin w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
                  <circle cx="20" cy="20" r="16" stroke={C} strokeWidth="3"
                    strokeDasharray="60" strokeDashoffset="40" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[9px] text-white/30 tracking-widest uppercase">Generating video…</span>
              <span className="text-[8px] text-white/15">This may take 30–60 seconds</span>
            </div>
          )}

          {/* Success — native video player */}
          {status === "success" && url && (
            <video
              src={url}
              controls
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              onMouseDown={e => e.stopPropagation()}
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

        {/* Footer */}
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
            <span className="text-[9px] font-mono text-white/15">MP4 / WEBM</span>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="input"
        style={{ left: -7, width: 14, height: 14, borderRadius: "50%",
          border: `2.5px solid ${C}`, background: "#13131a", cursor: "crosshair" }} />
    </div>
  );
}