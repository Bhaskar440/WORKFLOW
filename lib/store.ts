import { create } from "zustand";

export type GenerationStatus = "idle" | "loading" | "success" | "error";

interface OutputState {
  status:  GenerationStatus;
  url?:    string;
  error?:  string;
}

interface NodeflowState {
  // output results keyed by node id
  outputs: Record<string, OutputState>;
  setOutput: (nodeId: string, data: OutputState) => void;
  clearOutput: (nodeId: string) => void;

  // bump this number → canvas picks it up via useEffect and runs generation
  generateTrigger: number;
  fireGenerate: () => void;

  // canvas reports back whether it is currently generating
  generating: boolean;
  setGenerating: (v: boolean) => void;
}

export const useNodeflowStore = create<NodeflowState>((set) => ({
  outputs:    {},
  setOutput:  (nodeId, data) =>
    set((s) => ({ outputs: { ...s.outputs, [nodeId]: data } })),
  clearOutput: (nodeId) =>
    set((s) => {
      const next = { ...s.outputs };
      delete next[nodeId];
      return { outputs: next };
    }),

  generateTrigger: 0,
  fireGenerate: () => set((s) => ({ generateTrigger: s.generateTrigger + 1 })),

  generating:    false,
  setGenerating: (v) => set({ generating: v }),
}));