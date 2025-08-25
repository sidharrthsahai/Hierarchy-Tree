import type { User } from "../services/firebase";

export type { User };

export interface HierarchyNode extends User {
  children: HierarchyNode[];
  isExpanded: boolean;
}
