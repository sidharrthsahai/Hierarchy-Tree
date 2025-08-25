import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/firebase";
import { useImageValidation } from "../hooks/useImageValidation";
import {
  buildHierarchyTree,
  toggleNodeExpansion,
} from "../utils/hierarchyUtils";
import type { User } from "../services/firebase";
import type { HierarchyNode } from "../types/hierarchy";
import HierarchyHeader from "./HierarchyHeader";
import UserNode from "./UserNode";
import "../styles/Hierarchy.css";

const Hierarchy = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [hierarchyTree, setHierarchyTree] = useState<HierarchyNode[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { shouldShowInitials, markImageAsFailed } = useImageValidation();

  const handleImageError = useCallback(
    (userId: string) => {
      markImageAsFailed(userId);
    },
    [markImageAsFailed]
  );

  const handleImageLoad = useCallback(
    (userId: string, event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;

      if (img.naturalWidth <= 1 || img.naturalHeight <= 1) {
        markImageAsFailed(userId);
      }
    },
    [markImageAsFailed]
  );

  const handleToggleExpansion = useCallback((userId: string) => {
    setHierarchyTree((prevTree) => toggleNodeExpansion(prevTree, userId));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("currentUser");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("currentUser");
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await getUsers();

      if (fetchedUsers && fetchedUsers.length > 0) {
        setUsers(fetchedUsers);
        const tree = buildHierarchyTree(fetchedUsers);
        setHierarchyTree(tree);
      } else {
        console.log("No users fetched or empty array");
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="hierarchy-container">
        <div className="loading-state">Loading hierarchy...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="hierarchy-container">
        <HierarchyHeader currentUser={currentUser} onLogout={handleLogout} />
        <div className="hierarchy-content">
          <div className="empty-state">
            No users found. Please try refreshing the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hierarchy-container">
      <HierarchyHeader currentUser={currentUser} onLogout={handleLogout} />

      <div className="hierarchy-content">
        {hierarchyTree.length > 0 ? (
          hierarchyTree.map((user) => (
            <UserNode
              key={user.id}
              user={user}
              level={0}
              allUsers={users}
              onToggleExpansion={handleToggleExpansion}
              shouldShowInitials={shouldShowInitials}
              onImageError={handleImageError}
              onImageLoad={handleImageLoad}
            />
          ))
        ) : (
          <div className="building-state">Building hierarchy tree...</div>
        )}
      </div>
    </div>
  );
};

export default Hierarchy;
