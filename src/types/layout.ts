export type SplitType = 'v' | 'h' | null;

export interface ScreenNode {
  id: string;
  color: string;
  splitType: SplitType;
  ratio: number; // Percentage for the first child (0-100)
  children: [ScreenNode, ScreenNode] | null;
}
