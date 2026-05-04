"use client";

import { UserButton } from "@clerk/nextjs";

const NODES = [
  {
    type: "textInput",
    label: "Text Prompt",
    desc: "Write a prompt + dimensions",
    color: "#c8ff57",
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M1.5 2.5h10M1.5 6.5h7M1.5 10.5h9" stroke="#c8ff57" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    type: "llm",
    label: "LLM Model",
    desc: "Connect an AI language model",
    color: "#57c8ff",
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="#57c8ff" strokeWidth="1.5"/>
        <circle cx="6.5" cy="6.5" r="1.8" fill="#57c8ff"/>
      </svg>
    ),
  },
  {
    type: "imageOutput",
    label: "Image Output",
    desc: "Render generated image",
    color: "#ff57c8",
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect x="1.5" y="1.5" width="10" height="10" rx="2" stroke="#ff57c8" strokeWidth="1.5"/>
        <path d="M1.5 9l3-3 2.5 2.5 2-2.5 3.5 4.5" stroke="#ff57c8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    type: "videoOutput",
    label: "Video Output",
    desc: "Render generated video",
    color: "#ff7a57",
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M2 3.5h6a1 1 0 011 1v4a1 1 0 01-1 1H2a1 1 0 01-1-1v-4a1 1 0 011-1z" stroke="#ff7a57" strokeWidth="1.5"/>
        <path d="M9 5.5l3-2v6l-3-2" stroke="#ff7a57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

interface Props { userName: string }

export default function LeftSidebar({ userName }: Props) {
  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    // This is what canvas/page.tsx reads on drop
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-[240px] h-full flex flex-col flex-shrink-0 bg-[#0e0e12] border-r border-white/[0.06]">

      {/* Header */}
      <div className="px-4 py-5 border-b border-white/[0.05]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#c8ff57] grid place-items-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" fill="#0e0e12"/>
              </svg>
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-white/90">
              node<span className="text-[#c8ff57]">flow</span>
            </span>
          </div>
          <UserButton/>
        </div>

        <p className="text-[11px] text-white/25 mb-3.5 truncate">
          Hey, <span className="text-white/55 font-medium">{userName}</span> 👋
        </p>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="4" stroke="white" strokeWidth="1.5"/>
            <path d="M8.5 8.5L11 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            placeholder="Search nodes…"
            className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]
                       text-[11px] text-white/50 placeholder:text-white/20 outline-none
                       focus:border-white/[0.14] transition-colors"
          />
        </div>
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-white/18 px-2 pb-2.5 pt-1">
          Components
        </p>

        <div className="flex flex-col gap-1">
          {NODES.map((n) => (
            <div
              key={n.type}
              draggable
              onDragStart={(e) => onDragStart(e, n.type)}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl
                         border border-transparent cursor-grab active:cursor-grabbing
                         hover:bg-white/[0.04] hover:border-white/[0.08]
                         active:scale-[0.97] transition-all duration-150 select-none"
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0 transition-all
                           group-hover:scale-105"
                style={{ background: `${n.color}12`, border: `1px solid ${n.color}28` }}
              >
                {n.icon}
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-white/60 group-hover:text-white/85
                              transition-colors leading-snug truncate">
                  {n.label}
                </p>
                <p className="text-[10px] text-white/22 leading-snug truncate mt-0.5">
                  {n.desc}
                </p>
              </div>

              {/* Drag hint */}
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: n.color }}>
                  <circle cx="3" cy="3" r="1" fill="currentColor" opacity="0.5"/>
                  <circle cx="7" cy="3" r="1" fill="currentColor" opacity="0.5"/>
                  <circle cx="3" cy="7" r="1" fill="currentColor" opacity="0.5"/>
                  <circle cx="7" cy="7" r="1" fill="currentColor" opacity="0.5"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.05]">
        <p className="text-[9px] text-white/15 leading-relaxed">
          Drag a node onto the canvas · Connect ports to wire
        </p>
      </div>
    </aside>
  );
}