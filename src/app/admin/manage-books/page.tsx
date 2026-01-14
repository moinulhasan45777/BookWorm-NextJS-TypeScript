"use client";

import { BooksDataTable } from "@/components/books-data-table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FetchedBook } from "@/types/fetchedBook";

export default function ManageBooks() {
  const [allBooks, setAllBooks] = useState<FetchedBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllBooks = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/books");
      setAllBooks(result.data);
    } catch {
      toast.error("Failed to load Books!");
      setAllBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBooks();
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
      <BooksDataTable data={allBooks} onBookAdded={getAllBooks} />
    </div>
  );
}
