"use client";
import { SpinnerBadge } from "@/components/shared/SpinnerBadge";
import { getAuthUser } from "@/service/getAuthUser";
import { logout as logoutService } from "@/service/logout";
import { AuthContextType } from "@/types/authContextType";
import { UserType } from "@/types/userType";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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

  const logout = async () => {
    try {
      await logoutService();
      setUserData(null);
      router.push("/");
    } catch {
      throw new Error("Could not Logout! An unexpected error occured!");
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
    logout,
  };

  if (loading) {
    return <SpinnerBadge></SpinnerBadge>;
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
