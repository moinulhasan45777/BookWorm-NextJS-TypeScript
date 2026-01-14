"use client";

import { BooksDataTable } from "@/components/books-data-table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FetchedBook } from "@/types/fetchedBook";

export default function ManageBooks() {
  const [allBooks, setAllBooks] = useState<FetchedBook[]>([]);

  const getAllBooks = async () => {
    try {
      const result = await axios.get("/api/books");
      setAllBooks(result.data);
    } catch {
      toast.error("Failed to load Books!");
      setAllBooks([]);
    } finally {
    }
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  return (
    <div className="mx-6">
      <BooksDataTable data={allBooks} onBookAdded={getAllBooks} />
    </div>
  );
}
