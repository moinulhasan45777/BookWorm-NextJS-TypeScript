"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [numberOfBooks, setNumberOfBooks] = useState<number>(0);
  const [numberOfGenres, setNumberOfGenres] = useState<number>(0);

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setAllUsers(res.data);
    } catch {
      setAllUsers([]);
    }
  };

  const getBooks = async () => {
    try {
      const res = await axios.get("/api/books/number-of-books");
      setNumberOfBooks(res.data);
    } catch {
      setNumberOfBooks(0);
    }
  };

  const getGenres = async () => {
    try {
      const res = await axios.get("/api/genres/number-of-genres");
      setNumberOfGenres(res.data);
    } catch {
      setNumberOfGenres(0);
    }
  };

  useEffect(() => {
    getUsers();
    getBooks();
    getGenres();
  }, []);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards
          numberOfUsers={allUsers.length}
          numberOfBooks={numberOfBooks}
          numberOfGenres={numberOfGenres}
        />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive allUsers={allUsers} />
        </div>
      </div>
    </div>
  );
}
