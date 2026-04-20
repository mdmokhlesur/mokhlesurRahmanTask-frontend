import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import type { ScreenNode, SplitType } from '../utils';
import { generateId, getRandomColor, lightenColor } from '../utils';
import Header from './Header';
import Skeleton from './Skeleton';
import './splitter.css';

const Splitter: React.FC = () => {
  const [root, setRoot] = useState<ScreenNode>(() => ({
    id: generateId(),
    color: getRandomColor(),
    splitType: null,
    ratio: 50,
    children: null,
  }));

  const [resizingId, setResizingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  const { token } = useAuth();

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
          const savedLayout = data.data[0];
          setRoot(savedLayout.structure);
        }
      } catch (err) {
        console.error('Failed to load layout:', err);
      }
    };

    if (token) {
      fetchLayouts().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const handleSave = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/layouts`, {
        method: 'POST',
        signal,
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
      if (!data.success) {
        toast.error('Failed to auto-save: ' + data.message);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      toast.error('Auto-save failed: connection error');
    }
  }, [root, token]);

  useEffect(() => {
    if (isLoading || !token) return;

    // Skip the very first render after loading to avoid saving the freshly fetched layout
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      handleSave(controller.signal);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [root, token, isLoading, handleSave]);

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

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div ref={containerRef} className="splitter-container">
      <Header />

      <div className="workspace">
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
      <div className={`partition-container ${direction}`}>
        <div style={{ [isVertical ? 'width' : 'height']: `${node.ratio}%` }} className="partition-content">
          <Partition node={node.children[0]} onSplit={onSplit} onDelete={onDelete} onStartResize={onStartResize} isRoot={false} resizingId={resizingId} />
        </div>
        
        <div 
          id={`divider-${node.id}`}
          data-type={node.splitType}
          onMouseDown={() => onStartResize(node.id)}
          className={`divider ${isVertical ? 'divider-v' : 'divider-h'} ${isThisResizing ? 'resizing' : ''}`}
        >
          {isThisResizing && (
            <div className="ratio-badge">
              {Math.round(node.ratio)}%
            </div>
          )}
        </div>

        <div className="partition-content flex-1">
          <Partition node={node.children[1]} onSplit={onSplit} onDelete={onDelete} onStartResize={onStartResize} isRoot={false} resizingId={resizingId} />
        </div>
      </div>
    );
  }

  const buttonBg = lightenColor(node.color, 20);

  return (
    <div 
      className="partition-leaf"
      style={{ backgroundColor: node.color }}
    >
      <div className="control-panel">
        <button onClick={() => onSplit(node.id, 'v')} className="split-btn" style={{ backgroundColor: buttonBg }}>V</button>
        <button onClick={() => onSplit(node.id, 'h')} className="split-btn" style={{ backgroundColor: buttonBg }}>H</button>
        {!isRoot && <button onClick={() => onDelete(node.id)} className="split-btn" style={{ backgroundColor: buttonBg }}>-</button>}
      </div>
    </div>
  );
};

export default Splitter;
