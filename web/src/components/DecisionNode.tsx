import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Trophy, MessageSquare } from 'lucide-react';

const DecisionNode = ({ data, id }: NodeProps) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-xl border-2 bg-white min-w-[200px] ${
      data.is_outcome ? 'border-green-500 bg-green-50' : 'border-blue-200'
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-400" />
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {data.is_outcome ? (
              <Trophy className="w-4 h-4 text-green-600" />
            ) : (
              <MessageSquare className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {data.is_outcome ? 'Outcome' : 'Decision Step'}
            </span>
          </div>
          
          {/* NEW: Toggle Switch for Outcome */}
          <button 
            onClick={() => data.onToggleOutcome(data.id, !data.is_outcome)}
            className={`text-[9px] px-2 py-0.5 rounded-full font-bold transition-all ${
              data.is_outcome 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {data.is_outcome ? 'Set as Step' : 'Set as Outcome'}
          </button>
        </div>

        <textarea
          className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none resize-none w-full"
          value={data.label}
          rows={2}
          onChange={(e) => data.onChange(data.id, e.target.value)}
        />
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-400" />
    </div>
  );
};

export default memo(DecisionNode);