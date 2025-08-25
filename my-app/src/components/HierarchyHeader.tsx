import React from "react";
import { getFullName } from "../services/firebase";
import type { User } from "../services/firebase";
import "../styles/HierarchyHeader.css";

interface HierarchyHeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const HierarchyHeader: React.FC<HierarchyHeaderProps> = ({
  currentUser,
  onLogout,
}) => {
  return (
    <div className="hierarchy-header">
      <h1 className="hierarchy-title">Hierarchy Tree</h1>
      <div className="user-logout">
        <span className="current-user">{getFullName(currentUser)}</span>
        <button className="logout-button" onClick={onLogout}>
          (logout)
        </button>
      </div>
    </div>
  );
};

export default React.memo(HierarchyHeader);
