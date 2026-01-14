"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UsersDataTable } from "@/components/users-data-table";
import { FetchedUser } from "@/types/fetchedUser";

export default function ManageUsers() {
  const [users, setUsers] = useState<FetchedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/users");
      setUsers(result.data);
    } catch {
      toast.error("Failed to load users!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-6">
      <UsersDataTable data={users} onUserUpdated={fetchUsers} />
    </div>
  );
}
