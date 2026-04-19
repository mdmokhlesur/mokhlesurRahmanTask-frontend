import { LogOut, Save } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { ScreenNode, SplitType } from '../utils';
import { generateId, getRandomColor, lightenColor } from '../utils';

const Splitter: React.FC = () => {
  const [root, setRoot] = useState<ScreenNode>(() => ({
    id: generateId(),
    color: getRandomColor(),
    splitType: null,
    ratio: 50,
    children: null,
  }));

  const [resizingId, setResizingId] = useState<string | null>(null);
  const [layoutId, setLayoutId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { logout, token } = useAuth();

  // Load layout from backend on mount
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/layouts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          // Load the first saved layout
          const savedLayout = data.data[0];
          setRoot(savedLayout.structure);
          setLayoutId(savedLayout._id);
        }
      } catch (err) {
        console.error('Failed to load layout:', err);
      }
    };

    if (token) {
      fetchLayouts();
    }
  }, [token]);

  const handleSave = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/layouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'My Custom Layout',
          structure: root
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Layout saved successfully!');
        setLayoutId(data.data._id);
      } else {
        alert('Failed to save layout: ' + data.message);
      }
    } catch (err) {
      alert('Connection to backend failed');
    }
  };

  const splitNode = useCallback((id: string, type: SplitType) => {
    const updateTree = (node: ScreenNode): ScreenNode => {
      if (node.id === id) {
        return {
          ...node,
          splitType: type,
          ratio: 50,
          children: [
            { id: generateId(), color: node.color, splitType: null, ratio: 50, children: null },
            { id: generateId(), color: getRandomColor(), splitType: null, ratio: 50, children: null },
          ],
        };
      }
      if (node.children) {
        return { ...node, children: [updateTree(node.children[0]), updateTree(node.children[1])] };
      }
      return node;
    };
    setRoot(prev => updateTree(prev));
  }, []);

  const deleteNode = useCallback((id: string) => {
    const removeFromTree = (node: ScreenNode): ScreenNode | null => {
      if (node.children) {
        const [c1, c2] = node.children;
        if (c1.id === id) return c2;
        if (c2.id === id) return c1;
        const newC1 = removeFromTree(c1);
        const newC2 = removeFromTree(c2);
        if (newC1 !== c1 || newC2 !== c2) return { ...node, children: [newC1!, newC2!] };
      }
      return node;
    };
    setRoot(prev => removeFromTree(prev) || prev);
  }, []);

  const updateRatio = useCallback((id: string, newRatio: number, snap: boolean = false) => {
    let finalRatio = Math.max(5, Math.min(95, newRatio));
    
    if (snap) {
      if (Math.abs(finalRatio - 25) < 5) finalRatio = 25;
      else if (Math.abs(finalRatio - 50) < 5) finalRatio = 50;
      else if (Math.abs(finalRatio - 75) < 5) finalRatio = 75;
    }

    const updateInTree = (node: ScreenNode): ScreenNode => {
      if (node.id === id) return { ...node, ratio: finalRatio };
      if (node.children) return { ...node, children: [updateInTree(node.children[0]), updateInTree(node.children[1])] };
      return node;
    };
    setRoot(prev => updateInTree(prev));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingId) return;
    const divider = document.getElementById(`divider-${resizingId}`);
    const parent = divider?.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const isVertical = divider.dataset.type === 'v';
    
    let newRatio: number;
    if (isVertical) {
      newRatio = ((e.clientX - rect.left) / rect.width) * 100;
    } else {
      newRatio = ((e.clientY - rect.top) / rect.height) * 100;
    }
    
    updateRatio(resizingId, newRatio);
  }, [resizingId, updateRatio]);

  const handleMouseUp = useCallback(() => {
    if (resizingId) {
      const nodeToSnap = (function findNode(node: ScreenNode): ScreenNode | null {
        if (node.id === resizingId) return node;
        if (node.children) return findNode(node.children[0]) || findNode(node.children[1]);
        return null;
      })(root);

      if (nodeToSnap) {
        updateRatio(resizingId, nodeToSnap.ratio, true);
      }
      setResizingId(null);
    }
  }, [resizingId, root, updateRatio]);

  useEffect(() => {
    if (resizingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingId, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="w-screen h-screen overflow-hidden bg-white select-none flex flex-col">
      {/* Top Bar */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="text-white font-bold tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-[12px]">S</div>
          Splitter
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            <Save size={14} /> Save
          </button>
          <div className="w-[1px] h-4 bg-slate-700 mx-1" />
          <button 
            onClick={logout}
            className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-xs font-medium transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <Partition 
          node={root} 
          onSplit={splitNode} 
          onDelete={deleteNode} 
          onStartResize={setResizingId}
          isRoot={root.children === null} 
          resizingId={resizingId}
        />
      </div>
    </div>
  );
};

interface PartitionProps {
  node: ScreenNode;
  onSplit: (id: string, type: SplitType) => void;
  onDelete: (id: string) => void;
  onStartResize: (id: string) => void;
  isRoot: boolean;
  resizingId: string | null;
}

const Partition: React.FC<PartitionProps> = ({ node, onSplit, onDelete, onStartResize, isRoot, resizingId }) => {
  if (node.splitType && node.children) {
    const isVertical = node.splitType === 'v';
    const direction = isVertical ? 'flex-row' : 'flex-col';
    const isThisResizing = resizingId === node.id;

    return (
      <div className={`flex w-full h-full ${direction} bg-white relative`}>
        <div style={{ [isVertical ? 'width' : 'height']: `${node.ratio}%` }} className="overflow-hidden">
          <Partition node={node.children[0]} onSplit={onSplit} onDelete={onDelete} onStartResize={onStartResize} isRoot={false} resizingId={resizingId} />
        </div>
        
        <div 
          id={`divider-${node.id}`}
          data-type={node.splitType}
          onMouseDown={() => onStartResize(node.id)}
          className={`relative flex items-center justify-center bg-white hover:bg-indigo-400 transition-colors z-10
            ${isVertical ? 'w-[4px] cursor-col-resize h-full' : 'h-[4px] cursor-row-resize w-full'}
            ${isThisResizing ? 'bg-indigo-500' : ''}`}
        >
          {isThisResizing && (
            <div className="absolute pointer-events-none bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-lg font-bold whitespace-nowrap z-50">
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

  const buttonBg = lightenColor(node.color, 20);

  return (
    <div 
      className="w-full h-full flex items-center justify-center relative group"
      style={{ backgroundColor: node.color }}
    >
      <div className="flex gap-1.5 p-1 bg-black/5 rounded-md backdrop-blur-[2px] transition-opacity">
        <button onClick={() => onSplit(node.id, 'v')} className="size-6 flex items-center justify-center hover:opacity-90 text-black text-[10px] font-bold border border-white/40 rounded shadow-sm bg-white/20" style={{ backgroundColor: buttonBg }}>V</button>
        <button onClick={() => onSplit(node.id, 'h')} className="size-6 flex items-center justify-center hover:opacity-90 text-black text-[10px] font-bold border border-white/40 rounded shadow-sm bg-white/20" style={{ backgroundColor: buttonBg }}>H</button>
        {!isRoot && <button onClick={() => onDelete(node.id)} className="size-6 flex items-center justify-center hover:opacity-90 text-black text-[10px] font-bold border border-white/40 rounded shadow-sm bg-white/20" style={{ backgroundColor: buttonBg }}>-</button>}
      </div>
    </div>
  );
};

export default Splitter;
