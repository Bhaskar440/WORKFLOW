"use client";

import { useCallback, useRef, useState } from "react";
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

import TextInputNode   from "./_components/nodes/TextInputNode";
import LLMNode         from "./_components/nodes/LLMNode";
import ImageOutputNode from "./_components/nodes/ImageOutputNode";
import VideoOutputNode from "./_components/nodes/VideoOutputNode";

// ── MUST be outside component ─────────────────────────────────────────────
const nodeTypes: NodeTypes = {
  textInput:   TextInputNode,
  llm:         LLMNode,
  imageOutput: ImageOutputNode,
  videoOutput: VideoOutputNode,
};

const initialNodes: Node[] = [
  {
    id: "text-1",
    type: "textInput",
    position: { x: 120, y: 100 },
    data: { prompt: "", width: 1024, height: 1024 },
  },
];

const initialEdges: Edge[] = [];
let nodeId = 10;
const getId = () => `node-${nodeId++}`;

// ── Inner Flow (needs ReactFlowProvider above it) ─────────────────────────
function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "#c8ff57", strokeWidth: 1.5, opacity: 0.8 },
          },
          eds
        )
      ),
    [setEdges]
  );

  // ── Drop handler: sidebar item dragged onto canvas ────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      const defaultData: Record<string, unknown> = {};
      if (type === "textInput") { defaultData.prompt = ""; defaultData.width = 1024; defaultData.height = 1024; }
      if (type === "llm")       { defaultData.model = "FLUX.1 Dev"; }

      setNodes((nds) => [
        ...nds,
        { id: getId(), type, position, data: defaultData },
      ]);
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div ref={reactFlowWrapper} style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
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
          gap={28}
          size={0.9}
          color="rgba(255,255,255,0.05)"
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

export default function CanvasPage() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}