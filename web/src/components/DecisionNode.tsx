import React, { memo, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Trophy, X } from 'lucide-react';

const DecisionNode = ({ data }: NodeProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic: Adjust height to match scrollHeight
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0px"; 
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [data.label]);

  return (
    <div 
      onDoubleClick={() => data.onToggleOutcome(data.id, !data.is_outcome)}
      className={`px-4 py-3 shadow-sm rounded-xl border-2 bg-white transition-all duration-300 select-none min-w-[320px] max-w-[320px] relative flex flex-col h-auto ${
        data.is_outcome 
          ? 'border-green-500 ring-4 ring-green-50' 
          : 'border-slate-200 hover:border-blue-400 shadow-slate-100'
      }`}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); data.onDeleteNode(data.id); }}
        className="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-full p-1 shadow-sm z-10 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Connection points centered vertically relative to the dynamic height */}
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-400 border-none !top-1/2 -translate-y-1/2" />
      
      <div className="flex flex-col gap-1 w-full h-full pointer-events-none">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[9px] font-black uppercase tracking-widest ${
            data.is_outcome ? 'text-green-600' : 'text-slate-400'
          }`}>
            {data.is_outcome ? 'Final Outcome' : 'Decision Step'}
          </span>
          {data.is_outcome && <Trophy className="w-3 h-3 text-green-500" />}
        </div>

        <textarea
          ref={textAreaRef}
          className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none resize-none w-full leading-relaxed overflow-hidden focus:ring-0 p-0 pointer-events-auto"
          value={data.label}
          onChange={(e) => data.onChange(data.id, e.target.value)}
          rows={1}
          spellCheck={false}
        />
      </div>

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-slate-400 border-none !top-1/2 -translate-y-1/2" />
    </div>
  );
};

export default memo(DecisionNode);