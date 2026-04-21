import type { ScreenNode, SplitType } from "../types/layout";
import { generateId, getRandomColor } from "../utils";

/* Find a node by ID in the tree.*/
export const findNodeById = (
  node: ScreenNode,
  id: string,
): ScreenNode | null => {
  if (node.id === id) return node;
  if (node.children) {
    return (
      findNodeById(node.children[0], id) || findNodeById(node.children[1], id)
    );
  }
  return null;
};

/** Update a specific node in the tree by ID using an updater function. */
export const updateNodeById = (
  node: ScreenNode,
  id: string,
  updater: (node: ScreenNode) => ScreenNode,
): ScreenNode => {
  if (node.id === id) return updater(node);
  if (node.children) {
    return {
      ...node,
      children: [
        updateNodeById(node.children[0], id, updater),
        updateNodeById(node.children[1], id, updater),
      ],
    };
  }
  return node;
};

/* Remove a node by ID from the tree.*/
export const removeNodeById = (
  node: ScreenNode,
  id: string,
): ScreenNode | null => {
  if (node.children) {
    const [c1, c2] = node.children;
    if (c1.id === id) return c2;
    if (c2.id === id) return c1;

    const newC1 = removeNodeById(c1, id);
    const newC2 = removeNodeById(c2, id);

    if (newC1 !== c1 || newC2 !== c2) {
      return { ...node, children: [newC1!, newC2!] };
    }
  }
  return node;
};

/* Split a leaf node into two children.*/
export const splitNodeById = (
  node: ScreenNode,
  id: string,
  type: SplitType,
): ScreenNode => {
  return updateNodeById(node, id, (target) => ({
    ...target,
    splitType: type,
    ratio: 50,
    children: [
      {
        id: generateId(),
        color: target.color,
        splitType: null,
        ratio: 50,
        children: null,
      },
      {
        id: generateId(),
        color: getRandomColor(),
        splitType: null,
        ratio: 50,
        children: null,
      },
    ],
  }));
};

/* Snap a ratio value to the nearest 25/50/75 if within 5% threshold.*/
export const snapRatio = (ratio: number): number => {
  if (Math.abs(ratio - 25) < 15) return 25;
  if (Math.abs(ratio - 50) < 15) return 50;
  if (Math.abs(ratio - 75) < 15) return 75;
  return ratio;
};

/* Clamp a ratio to the valid range [5, 95].*/
export const clampRatio = (ratio: number): number => {
  return Math.max(5, Math.min(95, ratio));
};
