"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UsersDataTable } from "@/components/users-data-table";
import { FetchedUser } from "@/types/fetchedUser";

export default function ManageUsers() {
  const [users, setUsers] = useState<FetchedUser[]>([]);

  const fetchUsers = async () => {
    try {
      const result = await axios.get("/api/users");
      setUsers(result.data);
    } catch {
      toast.error("Failed to load users!");
      setUsers([]);
    } finally {
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mx-6">
      <UsersDataTable data={users} onUserUpdated={fetchUsers} />
    </div>
  );
}
