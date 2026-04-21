import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import type { ScreenNode } from '../types/layout';

interface UseAutoSaveOptions {
  root: ScreenNode;
  token: string | null;
  isLoading: boolean;
  debounceMs?: number;
}

export const useAutoSave = ({
  root,
  token,
  isLoading,
  debounceMs = 500,
}: UseAutoSaveOptions) => {
  const isInitialRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const controllerRef = useRef<AbortController | undefined>(undefined);

  const save = useCallback(
    async (structure: ScreenNode, signal: AbortSignal) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/layouts`, {
          method: 'POST',
          signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: 'My Custom Layout',
            structure,
          }),
        });
        const data = await response.json();
        if (!data.success) {
          toast.error('Failed to auto-save: ' + data.message);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        toast.error('Auto-save failed: connection error');
      }
    },
    [token]
  );

  useEffect(() => {
    if (isLoading || !token) return;

    // Skip the very first render after loading to avoid saving the freshly fetched layout
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Cancel any pending save
    clearTimeout(timerRef.current);
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    timerRef.current = setTimeout(() => {
      save(root, controller.signal);
    }, debounceMs);

    return () => {
      clearTimeout(timerRef.current);
      controller.abort();
    };
  }, [root, token, isLoading, save, debounceMs]);
};
