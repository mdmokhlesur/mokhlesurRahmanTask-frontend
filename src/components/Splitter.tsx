import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { ScreenNode, SplitType } from "../types/layout";
import { generateId, getRandomColor } from "../utils";
import { removeNodeById, splitNodeById } from "../utils/treeHelpers";
import { useResize } from "../hooks/useResize";
import { useAutoSave } from "../hooks/useAutoSave";
import Header from "./Header";
import Skeleton from "./Skeleton";
import Partition from "./Partition";

// Splitter main component
const Splitter: React.FC = () => {
  // Main layout state
  const [root, setRoot] = useState<ScreenNode>(() => ({
    id: generateId(),
    color: getRandomColor(),
    splitType: null,
    ratio: 50,
    children: null,
  }));

  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  // Resize hook: handles all pointer-based resize logic
  const { resizingId, getDividerProps } = useResize({ root, setRoot });

  // Auto save hook: debounced save on root changes
  useAutoSave({ root, token, isLoading });

  // Fetch initial layout from backend
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/layouts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          const savedLayout = data.data[0];
          setRoot(savedLayout.structure);
        }
      } catch (err) {
        console.error("Failed to load layout:", err);
      }
    };

    if (token) {
      fetchLayouts().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  // Split operation — delegates to tree helper
  const splitNode = useCallback((id: string, type: SplitType) => {
    setRoot((prev) => splitNodeById(prev, id, type));
  }, []);

  // Delete operation — delegates to tree helper
  const deleteNode = useCallback((id: string) => {
    setRoot((prev) => removeNodeById(prev, id) || prev);
  }, []);

  if (isLoading) {
    return <Skeleton />;
  }

  // Render workspace
  return (
    <div
      ref={containerRef}
      className="w-screen h-screen flex flex-col bg-white overflow-hidden select-none"
    >
      <Header />

      <div className="flex-1 relative overflow-hidden">
        <Partition
          node={root}
          onSplit={splitNode}
          onDelete={deleteNode}
          getDividerProps={getDividerProps}
          isRoot={root.children === null}
          resizingId={resizingId}
        />
      </div>
    </div>
  );
};

export default Splitter;
