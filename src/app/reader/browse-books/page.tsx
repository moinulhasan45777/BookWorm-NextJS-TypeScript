"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FetchedBook } from "@/types/fetchedBook";
import { FetchedGenre } from "@/types/fetchedGenre";
import BookCard from "@/components/pages/reader/browse-books/BookCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { josefin } from "@/fonts/fonts";

export default function BrowseBooks() {
  const [books, setBooks] = useState<FetchedBook[]>([]);
  const [genres, setGenres] = useState<FetchedGenre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(12);

  const fetchGenres = async () => {
    try {
      const response = await axios.get("/api/genres");
      setGenres(response.data);
    } catch {
      console.error("Failed to fetch genres");
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/books/browse", {
          params: {
            search,
            genre: selectedGenre,
            page: currentPage,
            limit: pageSize,
          },
        });
        setBooks(response.data.books);
        setTotalPages(response.data.totalPages);
        setTotalBooks(response.data.totalBooks);
      } catch {
        console.error("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, selectedGenre, currentPage, pageSize]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <div className="py-8">
      <h1 className={`text-4xl font-bold mb-8 ${josefin.className}`}>
        Browse Books
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Genre" />
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre._id} value={genre.title}>
                  {genre.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {totalBooks} book(s) total
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-muted-foreground text-lg">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      {!loading && books.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
              >
                {[12, 24, 36, 48].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="hidden sm:flex"
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:flex"
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
