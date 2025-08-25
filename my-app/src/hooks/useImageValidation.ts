import { useState, useCallback } from "react";

export const useImageValidation = () => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const markImageAsFailed = useCallback((userId: string) => {
    setFailedImages((prev) => new Set(prev).add(userId));
  }, []);

  const shouldShowInitials = useCallback(
    (userId: string, photoUrl?: string): boolean => {
      if (!photoUrl) return true;
      return failedImages.has(userId);
    },
    [failedImages]
  );

  return { shouldShowInitials, markImageAsFailed };
};
