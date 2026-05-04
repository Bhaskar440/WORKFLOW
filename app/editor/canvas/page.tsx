"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type OnConnect,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TextInputNode   from "../_components/nodes/TextInputNode";
import LLMNode         from "../_components/nodes/LLMNode";
import ImageOutputNode from "../_components/nodes/ImageOutputNode";
import VideoOutputNode from "../_components/nodes/VideoOutputNode";
import { useNodeflowStore } from "@/lib/store";

// ── MUST be outside component ──────────────────────────────────────────────
const nodeTypes: NodeTypes = {
  textInput:   TextInputNode,
  llm:         LLMNode,
  imageOutput: ImageOutputNode,
  videoOutput: VideoOutputNode,
};

const initialNodes: Node[] = [
  { id: "n1", type: "textInput",   position: { x: 60,  y: 80  }, data: { prompt: "", width: 1024, height: 1024 } },
  { id: "n2", type: "llm",         position: { x: 440, y: 60  }, data: { model: "flux" } },
  { id: "n3", type: "imageOutput", position: { x: 790, y: 70  }, data: {} },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "n1", target: "n2", animated: true, style: { stroke: "#c8ff57", strokeWidth: 1.5 } },
  { id: "e2", source: "n2", target: "n3", animated: true, style: { stroke: "#57c8ff", strokeWidth: 1.5 } },
];

let nodeCounter = 10;
const newId = () => `n${++nodeCounter}`;

// ── Resolve textInput → llm → output chains from the graph ────────────────
function resolveChains(nodes: Node[], edges: Edge[]) {
  const result: {
    inputNode:  Node;
    llmNode:    Node;
    outputNode: Node;
    outputType: "imageOutput" | "videoOutput";
  }[] = [];

  for (const llm of nodes.filter(n => n.type === "llm")) {
    const inEdge  = edges.find(e => e.target === llm.id);
    const outEdge = edges.find(e => e.source === llm.id);
    if (!inEdge || !outEdge) continue;

    const inputNode  = nodes.find(n => n.id === inEdge.source);
    const outputNode = nodes.find(n => n.id === outEdge.target);
    if (!inputNode || !outputNode) continue;
    if (inputNode.type  !== "textInput") continue;
    if (outputNode.type !== "imageOutput" && outputNode.type !== "videoOutput") continue;

    result.push({
      inputNode,
      llmNode:    llm,
      outputNode,
      outputType: outputNode.type as "imageOutput" | "videoOutput",
    });
  }
  return result;
}

// ── Inner canvas ───────────────────────────────────────────────────────────
function FlowCanvas() {
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Keep live refs so the generate effect always reads latest state
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  const setOutput      = useNodeflowStore(s => s.setOutput);
  const setGenerating  = useNodeflowStore(s => s.setGenerating);
  const trigger        = useNodeflowStore(s => s.generateTrigger);
  const prevTrigger    = useRef(0);

  // ── Listen for trigger fired by GenerateButton in layout ─────────────────
  useEffect(() => {
    if (trigger === 0 || trigger === prevTrigger.current) return;
    prevTrigger.current = trigger;

    const chains = resolveChains(nodesRef.current, edgesRef.current);

    if (chains.length === 0) {
      alert("Connect: Text Prompt → LLM → Image Output (or Video Output) first.");
      return;
    }

    const run = async () => {
      setGenerating(true);

      await Promise.all(
        chains.map(async ({ inputNode, llmNode, outputNode, outputType }) => {
          const { prompt, width, height } = inputNode.data as {
            prompt: string; width: number; height: number;
          };
          const { model } = llmNode.data as { model: string };

          if (!prompt?.trim()) {
            setOutput(outputNode.id, {
              status: "error",
              error:  "Prompt is empty — type something in the Text Prompt node first.",
            });
            return;
          }

          // Show spinner immediately
          setOutput(outputNode.id, { status: "loading" });

          try {
            const res  = await fetch(
              outputType === "imageOutput"
                ? "/api/generate-image"
                : "/api/generate-video",
              {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ prompt, width, height, model }),
              }
            );

            const json = await res.json();

            if (!res.ok || json.error) {
              setOutput(outputNode.id, {
                status: "error",
                error:  json.error ?? "Generation failed",
              });
            } else {
              setOutput(outputNode.id, { status: "success", url: json.url });
            }
          } catch (err) {
            setOutput(outputNode.id, {
              status: "error",
              error:  err instanceof Error ? err.message : "Network error",
            });
          }
        })
      );

      setGenerating(false);
    };

    run();
  }, [trigger, setOutput, setGenerating]);

  // ── Connect ───────────────────────────────────────────────────────────────
  const onConnect: OnConnect = useCallback(
    (conn) => setEdges(eds => addEdge({
      ...conn, animated: true,
      style: { stroke: "#c8ff57", strokeWidth: 1.5 },
    }, eds)),
    [setEdges],
  );

  // ── Drag-to-drop from sidebar ─────────────────────────────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/reactflow");
    if (!type) return;
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const defaults: Record<string, unknown> =
      type === "textInput" ? { prompt: "", width: 1024, height: 1024 }
      : type === "llm"     ? { model: "flux" }
      : {};
    setNodes(nds => [...nds, { id: newId(), type, position, data: defaults }]);
  }, [screenToFlowPosition, setNodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable
        elementsSelectable
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#c8ff57", strokeWidth: 1.5, opacity: 0.8 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28} size={0.85}
          color="rgba(255,255,255,0.04)"
        />
        <Controls
          className="!bg-[#111114] !border-white/10 !rounded-xl
                     [&>button]:!bg-transparent [&>button]:!border-white/10
                     [&>button]:!text-white/40 [&>button:hover]:!text-white/80"
        />
      </ReactFlow>
    </div>
  );
}

// ── Page export ────────────────────────────────────────────────────────────
export default function CanvasPage() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
}