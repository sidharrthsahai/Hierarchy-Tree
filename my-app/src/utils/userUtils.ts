import type { User } from "../services/firebase";

export const getUserInitials = (user: User): string => {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
};

export const isManager = (user: User, allUsers: User[]): boolean => {
  return allUsers.some((u) => u.managerId === user.id);
};
