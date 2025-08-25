import React from "react";
import { getFullName } from "../services/firebase";
import { getUserInitials, isManager } from "../utils/userUtils";
import type { HierarchyNode, User } from "../types/hierarchy";
import "../styles/UserNode.css";

interface UserNodeProps {
  user: HierarchyNode;
  level: number;
  allUsers: User[];
  onToggleExpansion: (userId: string) => void;
  shouldShowInitials: (userId: string, photoUrl?: string) => boolean;
  onImageError: (userId: string) => void;
  onImageLoad: (
    userId: string,
    event: React.SyntheticEvent<HTMLImageElement>
  ) => void;
}

const UserNode: React.FC<UserNodeProps> = ({
  user,
  level,
  allUsers,
  onToggleExpansion,
  shouldShowInitials,
  onImageError,
  onImageLoad,
}) => {
  const manager = isManager(user, allUsers);
  const hasChildren = user.children.length > 0;
  const showInitials = shouldShowInitials(user.id, user.photo);

  return (
    <div className="user-node">
      <div className="user-row" style={{ paddingLeft: `${level * 20}px` }}>
        <div className="user-controls">
          {manager ? (
            <button
              className="expand-button"
              onClick={() => onToggleExpansion(user.id)}
              aria-label={`${
                user.isExpanded ? "Collapse" : "Expand"
              } ${getFullName(user)}'s team`}
            >
              {user.isExpanded ? "−" : "+"}
            </button>
          ) : (
            <span
              className="non-manager-indicator"
              aria-label="Individual contributor"
            >
              −
            </span>
          )}
        </div>

        <div className="user-avatar">
          {user.photo && !showInitials ? (
            <img
              src={user.photo}
              alt={`${getFullName(user)}'s profile photo`}
              className="user-photo"
              onError={() => onImageError(user.id)}
              onLoad={(e) => onImageLoad(user.id, e)}
              loading="lazy"
            />
          ) : null}
          <div
            className="user-initials"
            style={{ display: showInitials ? "flex" : "none" }}
            aria-label={`${getFullName(user)}'s initials`}
          >
            {getUserInitials(user)}
          </div>
        </div>

        <div className="user-info">
          <span className="user-name">{getFullName(user)}</span>
          <span className="user-email">{user.email}</span>
        </div>
      </div>

      {hasChildren && user.isExpanded && (
        <div className="user-children">
          {user.children.map((child: HierarchyNode) => (
            <UserNode
              key={child.id}
              user={child}
              level={level + 1}
              allUsers={allUsers}
              onToggleExpansion={onToggleExpansion}
              shouldShowInitials={shouldShowInitials}
              onImageError={onImageError}
              onImageLoad={onImageLoad}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(UserNode);
