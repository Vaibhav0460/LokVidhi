"use client";
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback, use } from 'react';
import ReactFlow, { 
  addEdge, Background, Controls, MiniMap, 
  useNodesState, useEdgesState, Connection, MarkerType
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import DecisionNode from '@/components/DecisionNode';
import EditableEdge from '@/components/EditableEdge';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

const edgeTypes = { editable: EditableEdge };
const nodeTypes = { decision: DecisionNode };

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 120, 
    ranksep: 100 
  });

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: 320, height: 150 }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return { ...node, position: { x: nodeWithPosition.x - 125, y: nodeWithPosition.y - 50 } };
    }),
    edges,
  };
};

export default function ScenarioVisualEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id: scenarioId } = use(params);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000").replace(/\/$/, "");

  const updateNodeText = useCallback(async (nodeId: number, newText: string) => {
    setNodes((nds) => nds.map((node) => 
      node.id === nodeId.toString() ? { ...node, data: { ...node.data, label: newText } } : node
    ));
    await fetch(`${apiUrl}/api/admin/nodes/${nodeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_text: newText })
    });
  }, [apiUrl, setNodes]);

  // CHANGE 1: Added toggleNodeOutcome handler to sync is_outcome state with backend
  const toggleNodeOutcome = useCallback(async (nodeId: number, isOutcome: boolean) => {
    // Optimistic UI update
    setNodes((nds) => nds.map((node) => 
      node.id === nodeId.toString() ? { ...node, data: { ...node.data, is_outcome: isOutcome } } : node
    ));

    try {
      await fetch(`${apiUrl}/api/admin/nodes/${nodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_outcome: isOutcome })
      });
    } catch (err) {
      console.error("Failed to toggle outcome:", err);
      fetchData(); // Revert on failure
    }
  }, [apiUrl, setNodes]);

  const updateEdgeLabel = useCallback(async (edgeId: string, newLabel: string) => {
    setEdges((eds) => eds.map((edge) => 
      edge.id === edgeId ? { ...edge, data: { ...edge.data, label: newLabel } } : edge
    ));

    const id = edgeId.replace('e', ''); 
    try {
      await fetch(`${apiUrl}/api/admin/options/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_text: newLabel })
      });
    } catch (err) {
      console.error("Failed to sync edge label:", err);
      fetchData();
    }
  }, [apiUrl, setEdges]);

  const fetchData = useCallback(async () => {
    if (!scenarioId || scenarioId === "undefined") return;
    try {
      const [nRes, eRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/scenarios/${scenarioId}/nodes`),
        fetch(`${apiUrl}/api/admin/scenarios/${scenarioId}/edges`)
      ]);
      const nodesData = await nRes.json();
      const edgesData = await eRes.json();

      if (Array.isArray(nodesData) && Array.isArray(edgesData)) {
        const initialNodes = nodesData.map((n: any) => ({
          id: n.id.toString(),
          type: 'decision',
          data: { 
            id: n.id, 
            label: n.content_text, 
            is_outcome: n.is_outcome, 
            onChange: updateNodeText,
            // CHANGE 2: Passing the toggle function to the DecisionNode
            onToggleOutcome: toggleNodeOutcome 
          },
          position: { x: 0, y: 0 } 
        }));
        const mappedEdges = edgesData.map((e: any) => ({
          id: `e${e.id}`, 
          source: e.current_node_id.toString(),
          target: e.next_node_id.toString(),
          type: 'editable', 
          data: { label: e.option_text, onEdgeLabelChange: updateEdgeLabel },
        }));
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, mappedEdges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    } catch (err) { console.error("Load failed:", err); }
  }, [scenarioId, apiUrl, updateNodeText, toggleNodeOutcome, updateEdgeLabel]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onConnect = useCallback(async (params: Connection) => {
    const res = await fetch(`${apiUrl}/api/admin/options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_node_id: params.source,
        next_node_id: params.target,
        option_text: "New Option"
      })
    });
  
    if (res.ok) {
      const newOption = await res.json();
      
      const newEdge = {
        ...params,
        id: `e${newOption.id}`,
        type: 'editable',
        data: { 
          label: "New Option", 
          onEdgeLabelChange: updateEdgeLabel 
        },
        markerEnd: { type: MarkerType.ArrowClosed }
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
    }
  }, [apiUrl, setEdges, updateEdgeLabel]);

  const addNewNode = async () => {
    const res = await fetch(`${apiUrl}/api/admin/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_id: scenarioId, content_text: "New Step", is_outcome: false })
    });
    if (res.ok) fetchData();
  };

  return (
    <main className="fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden">
      <header className="h-16 shrink-0 border-b bg-white flex justify-between items-center px-6 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/scenarios" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Visual Scenario Editor</h1>
        </div>
        <button onClick={addNewNode} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-md">
          <Plus className="w-4 h-4 mr-1 inline" /> Add Node
        </button>
      </header>

      <div className="flex-grow relative w-full h-full bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          panOnScroll={true} 
          selectionOnDrag={false}
          zoomOnScroll={true}
          panOnDrag={true}
          style={{width:'100%', height:"100%"}}
        >
          <Background color="#e2e8f0" gap={25} size={1} />
          <Controls position="bottom-right" />
          <MiniMap style={{ height: 120, width: 200 }} />
        </ReactFlow>
      </div>

      <style jsx global>{`
        body { overflow: hidden !important; position: fixed; width: 100%; }
      `}</style>
    </main>
  );
}