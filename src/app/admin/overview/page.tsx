"use client";

import { BooksPerGenreChart } from "@/components/books-per-genre-chart";
import { SectionCards } from "@/components/section-cards";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [numberOfBooks, setNumberOfBooks] = useState<number>(0);
  const [numberOfGenres, setNumberOfGenres] = useState<number>(0);
  const [numberOfReviews, setNumberOfReviews] = useState<number>(0);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setNumberOfUsers(res.data.length);
    } catch {
      setNumberOfUsers(0);
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

  const getReviews = async () => {
    try {
      const res = await axios.get("/api/reviews/number-of-reviews");
      setNumberOfReviews(res.data);
    } catch {
      setNumberOfReviews(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getUsers(), getBooks(), getGenres(), getReviews()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards
          numberOfUsers={numberOfUsers}
          numberOfBooks={numberOfBooks}
          numberOfGenres={numberOfGenres}
          numberOfReviews={numberOfReviews}
        />
        <div className="px-4 lg:px-6">
          <BooksPerGenreChart />
        </div>
      </div>
    </div>
  );
}
