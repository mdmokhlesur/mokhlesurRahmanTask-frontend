import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScreenNode, SplitType } from '../types/layout';
import { clampRatio, findNodeById, snapRatio, updateNodeById } from '../utils/treeHelpers';

interface UseResizeOptions {
  root: ScreenNode;
  setRoot: React.Dispatch<React.SetStateAction<ScreenNode>>;
}

interface DividerProps {
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const useResize = ({ setRoot }: UseResizeOptions) => {
  const [resizingId, setResizingId] = useState<string | null>(null);

  // Sync resizingId to ref via useEffect (React 19 forbids ref writes during render)
  const resizingIdRef = useRef(resizingId);
  useEffect(() => {
    resizingIdRef.current = resizingId;
  }, [resizingId]);

  /* Returns pointer event props for a divider element. */
  const getDividerProps = useCallback(
    (nodeId: string, splitType: SplitType): DividerProps => ({
      onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setResizingId(nodeId);
      },

      onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
        if (resizingIdRef.current !== nodeId) return;

        const parent = e.currentTarget.parentElement;
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        const isVertical = splitType === 'v';

        const rawRatio = isVertical
          ? ((e.clientX - rect.left) / rect.width) * 100
          : ((e.clientY - rect.top) / rect.height) * 100;

        const clamped = clampRatio(rawRatio);

        setRoot((prev) =>
          updateNodeById(prev, nodeId, (node) => ({
            ...node,
            ratio: clamped,
          }))
        );
      },

      onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => {
        if (resizingIdRef.current !== nodeId) return;

        e.currentTarget.releasePointerCapture(e.pointerId);

        // Apply snap on release using functional updater (no rootRef needed)
        setRoot((prev) => {
          const currentNode = findNodeById(prev, nodeId);
          if (currentNode) {
            const snapped = snapRatio(currentNode.ratio);
            if (snapped !== currentNode.ratio) {
              return updateNodeById(prev, nodeId, (node) => ({
                ...node,
                ratio: snapped,
              }));
            }
          }
          return prev;
        });

        setResizingId(null);
      },
    }),
    [setRoot]
  );

  return { resizingId, getDividerProps };
};
