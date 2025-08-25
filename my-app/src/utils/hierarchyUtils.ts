import type { User } from "../services/firebase";
import type { HierarchyNode } from "../types/hierarchy";

export const buildHierarchyTree = (userList: User[]): HierarchyNode[] => {
  const userMap = new Map<string, HierarchyNode>();

  userList.forEach((user) => {
    userMap.set(user.id, {
      ...user,
      children: [],
      isExpanded: true,
    });
  });

  const roots: HierarchyNode[] = [];

  userList.forEach((user) => {
    const node = userMap.get(user.id)!;

    if (user.managerId) {
      const manager = userMap.get(user.managerId);
      if (manager) {
        manager.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const toggleNodeExpansion = (
  nodes: HierarchyNode[],
  userId: string
): HierarchyNode[] => {
  return nodes.map((node) => {
    if (node.id === userId) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    if (node.children.length > 0) {
      return { ...node, children: toggleNodeExpansion(node.children, userId) };
    }
    return node;
  });
};
