"use client";

export default function RightSidebar() {
  return (
    <aside className="w-[260px] h-full bg-[#101013] border-l border-white/[0.06] flex flex-col flex-shrink-0">
      <div className="px-4 py-5 border-b border-white/[0.05]">
        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/25">Properties</p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[11px] text-white/15 text-center px-6 leading-relaxed">
          Select a node on the canvas to edit its properties here.
        </p>
      </div>
    </aside>
  );
}