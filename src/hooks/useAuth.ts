"use client";

import { getToken, removeToken } from "@/lib/token";
import { useCallback, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!getToken();
  });

  const logout = useCallback(() => {
    removeToken();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    logout,
  };
}
