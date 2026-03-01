import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Trophy, Circle } from 'lucide-react';

const DecisionNode = ({ data }: NodeProps) => {
  return (
    <div 
      // Double-click to toggle outcome state - fast and keeps UI clean
      onDoubleClick={() => data.onToggleOutcome(data.id, !data.is_outcome)}
      className={`px-4 py-3 shadow-sm rounded-xl border-2 bg-white transition-all duration-300 select-none min-w-[250px] ${
        data.is_outcome 
          ? 'border-green-500 ring-4 ring-green-50' 
          : 'border-slate-200 hover:border-blue-400'
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-slate-400 border-none" />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-black uppercase tracking-widest ${
            data.is_outcome ? 'text-green-600' : 'text-slate-400'
          }`}>
            {data.is_outcome ? 'Final Outcome' : 'Decision Step'}
          </span>
          {data.is_outcome && <Trophy className="w-3 h-3 text-green-500" />}
        </div>

        {/* Standard input without forced scrolling */}
        <textarea
          className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none resize-none w-full leading-snug overflow-hidden"
          value={data.label}
          rows={2}
          onChange={(e) => data.onChange(data.id, e.target.value)}
          placeholder="Enter legal instruction..."
        />
        
        <p className="text-[8px] text-slate-300 italic text-right mt-1">
          Double-click to toggle outcome
        </p>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-slate-400 border-none" />
    </div>
  );
};

export default memo(DecisionNode);