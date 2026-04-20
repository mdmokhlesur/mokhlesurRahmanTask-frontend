import React from 'react';
import type { ScreenNode, SplitType } from '../utils';

export interface PartitionProps {
  node: ScreenNode;
  onSplit: (id: string, type: SplitType) => void;
  onDelete: (id: string) => void;
  onStartResize: (id: string) => void;
  isRoot: boolean;
  resizingId: string | null;
}

// Partition component for recursive rendering
const Partition: React.FC<PartitionProps> = ({ node, onSplit, onDelete, onStartResize, isRoot, resizingId }) => {
  if (node.splitType && node.children) {
    const isVertical = node.splitType === 'v';
    const direction = isVertical ? 'flex-row' : 'flex-col';
    const isThisResizing = resizingId === node.id;

    return (
      <div className={`w-full h-full flex overflow-hidden ${direction}`}>
        <div style={{ [isVertical ? 'width' : 'height']: `${node.ratio}%` }} className="overflow-hidden">
          <Partition node={node.children[0]} onSplit={onSplit} onDelete={onDelete} onStartResize={onStartResize} isRoot={false} resizingId={resizingId} />
        </div>
        
        <div 
          id={`divider-${node.id}`}
          data-type={node.splitType}
          onMouseDown={() => onStartResize(node.id)}
          className={`relative flex items-center justify-center transition-colors duration-200 z-10 ${
            isVertical ? 'w-1 cursor-col-resize h-full' : 'h-1 cursor-row-resize w-full'
          } ${isThisResizing ? 'bg-primary' : 'bg-white hover:bg-primary/50'}`}
        >
          {isThisResizing && (
            <div className="absolute bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-50">
              {Math.round(node.ratio)}%
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <Partition node={node.children[1]} onSplit={onSplit} onDelete={onDelete} onStartResize={onStartResize} isRoot={false} resizingId={resizingId} />
        </div>
      </div>
    );
  } 

  return (
    <div 
      className="w-full h-full flex items-center justify-center relative"
      style={{ backgroundColor: node.color }}
    >
      {/* Control buttons */}
      <div className="flex gap-2 p-1 transition-all duration-200 ">
        <button 
          onClick={() => onSplit(node.id, 'v')} 
          className="size-7 flex items-center cursor-pointer justify-center text-black/90 bg-white/10 rounded hover:bg-white/20 transition-colors text-xs"
          title="Split V"
        >
          v
        </button>
        <button 
          onClick={() => onSplit(node.id, 'h')} 
        className="size-7 flex items-center cursor-pointer justify-center text-black/90 bg-white/10 rounded hover:bg-white/20 transition-colors text-xs"
          title="Split H"
        >
          h
        </button>
        {!isRoot && (
          <button 
            onClick={() => onDelete(node.id)} 
        className="size-7 flex items-center cursor-pointer justify-center text-black/90 bg-white/10 rounded hover:bg-white/20 transition-colors text-xs"
            title="Remove"
          >
            -
          </button>
        )}
      </div>
    </div>
  );
};

export default Partition;
