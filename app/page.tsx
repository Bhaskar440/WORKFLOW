import Link from "next/link";

export default function Home() {
  return (
    // 1. The main container: full screen, dark background, centered flexbox
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white">
      
      {/* 2. Centralized Content Area */}
      <div className="text-center">
        
        {/* 3. Logo and Title Section */}
        <div className="flex items-center justify-center gap-4 mb-3">
          {/* Simulated logo icon (can be replaced with an SVG or image) */}
          <div className="bg-[#1C1C1E] border border-stone-800 text-stone-300 rounded-xl size-14 flex items-center justify-center text-2xl font-mono font-bold select-none">
            NF
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">NextFlow</h1>
        </div>

        {/* 4. Subtitle / Description */}
        <p className="text-stone-400 text-xl font-medium tracking-tight mb-8">
          Visual AI Workflow Builder
        </p>

        {/* 5. CTA Buttons Container */}
        <div className="flex items-center justify-center gap-4">
          {/* Outlined Button (Sign In) */}
          <Link
            href="/sign-in"
            className="px-6 py-3 rounded-lg border border-stone-800 bg-stone-900 text-stone-300 font-semibold text-lg hover:border-stone-700 hover:bg-stone-800 transition-colors"
          >
            Sign In
          </Link>
          
          {/* Filled Purple Button (Get Started) */}
          <Link
            href="/(auth)/sign-up" // Linking directly to your existing auth group folder
            className="px-6 py-3 rounded-lg bg-fuchsia-600 text-white font-semibold text-lg hover:bg-fuchsia-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* 6. The bottom-left logo watermark (Fixed Position) */}
      <div className="fixed bottom-6 left-6 flex items-center gap-2">
        <div className="border border-stone-800 text-stone-500 rounded-lg size-10 flex items-center justify-center font-mono font-extrabold text-sm select-none">
          N
        </div>
      </div>
      
    </main>
  );
}