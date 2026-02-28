import React, { useEffect, useRef } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';

export default function EditableEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the height of the label as text wraps
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data?.label]);

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
          {/* CHANGE: Switched from input to textarea for auto-wrapping.
            Added 'whitespace-pre-wrap' and a 'max-w' to force wrapping.
          */}
          <textarea
            ref={textareaRef}
            className="text-xs font-bold border-2 border-green-200 rounded-lg px-2 py-1 bg-white text-green-700 shadow-sm outline-none focus:border-green-500 text-center resize-none overflow-hidden whitespace-pre-wrap break-words"
            style={{ 
              width: '120px', // Fixed width to trigger wrapping
              minHeight: '24px'
            }}
            value={data?.label || ""}
            onChange={(e) => data?.onEdgeLabelChange(id, e.target.value)}
            rows={1}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}