import React, { memo, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

const DecisionNode = ({ data, selected }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.label]);

  return (
    <div className={`p-4 rounded-xl shadow-lg border-2 bg-white min-w-[240px] max-w-[360px] ${
      selected ? 'border-blue-500 ring-4 ring-blue-50' : 
      data.is_outcome ? 'border-purple-500 bg-purple-50' : 'border-green-500'
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-gray-400" />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Node #{data.id}</span>
        <textarea 
          ref={textareaRef}
          className="text-sm font-semibold w-full border-none focus:ring-0 resize-none bg-transparent text-gray-900 p-0 overflow-hidden leading-relaxed"
          value={data.label}
          onChange={(e) => data.onChange(data.id, e.target.value)}
        />
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-gray-400" />
    </div>
  );
};

export default memo(DecisionNode);