// web/src/components/DecisionNode.tsx
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Trophy, X } from 'lucide-react';

const DecisionNode = ({ data }: NodeProps) => {
  return (
    <div 
      onDoubleClick={() => data.onToggleOutcome(data.id, !data.is_outcome)}
      className={`px-4 py-3 shadow-sm rounded-xl border-2 bg-white transition-all duration-300 select-none min-w-[280px] relative ${
        data.is_outcome 
          ? 'border-green-500 ring-4 ring-green-50' 
          : 'border-slate-200 hover:border-blue-400'
      }`}
    >
      {/* Delete Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          data.onDeleteNode(data.id);
        }}
        className="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-full p-1 shadow-sm z-10 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>

      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-400 border-none" />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[9px] font-black uppercase tracking-widest ${
            data.is_outcome ? 'text-green-600' : 'text-slate-400'
          }`}>
            {data.is_outcome ? 'Final Outcome' : 'Decision Step'}
          </span>
          {data.is_outcome && <Trophy className="w-3 h-3 text-green-500" />}
        </div>

        <textarea
          className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none resize-none w-full leading-snug overflow-hidden"
          value={data.label}
          rows={2}
          onChange={(e) => data.onChange(data.id, e.target.value)}
        />
      </div>

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-slate-400 border-none" />
    </div>
  );
};

export default memo(DecisionNode);