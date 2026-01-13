"use client";
import { SpinnerBadge } from "@/components/shared/SpinnerBadge";
import { getAuthUser } from "@/service/getAuthUser";
import { AuthContextType } from "@/types/authContextType";
import { UserType } from "@/types/userType";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const userDataNew = await getAuthUser();
      setUserData(userDataNew);
    } catch {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const authInfo = {
    userData,
    setUserData,
    loading,
    refetch: fetchUser,
  };

  if (loading) {
    return <SpinnerBadge></SpinnerBadge>;
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
