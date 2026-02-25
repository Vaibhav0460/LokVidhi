import React from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';

export default function EditableEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} strokeWidth={3} stroke="#10b981" fill="none" />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <input
            className="text-xs font-bold border-2 border-green-200 rounded-lg px-2 py-1 bg-white text-green-700 shadow-sm outline-none focus:border-green-500 text-center"
            style={{ width: `${Math.max(80, (data?.label?.length || 0) * 8)}px` }}
            value={data?.label || ""}
            onChange={(e) => data?.onEdgeLabelChange(id, e.target.value)}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}