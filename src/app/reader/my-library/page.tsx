"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { FetchedUserShelf } from "@/types/fetchedUserShelf";
import { FetchedBook } from "@/types/fetchedBook";
import LibraryBookCard from "@/components/pages/reader/my-library/LibraryBookCard";
import { josefin } from "@/fonts/fonts";
import { useAuth } from "@/hooks/useAuth";

export default function MyLibrary() {
  const authContext = useAuth();
  const [shelves, setShelves] = useState<FetchedUserShelf[]>([]);
  const [books, setBooks] = useState<FetchedBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (authContext?.userData?._id) {
      fetchLibrary();
    }
  }, [authContext?.userData?._id]);

  const fetchLibrary = async () => {
    if (!authContext?.userData?._id) return;

    setLoading(true);
    try {
      const [shelvesRes, booksRes] = await Promise.all([
        axios.get("/api/shelves/user-library", {
          params: { userId: authContext.userData._id },
        }),
        axios.get("/api/books"),
      ]);

      setShelves(shelvesRes.data);
      setBooks(booksRes.data);
    } catch {
      toast.error("Failed to load library!");
    } finally {
      setLoading(false);
    }
  };

  const handleStartReading = async (shelfId: string) => {
    const shelf = shelves.find((s) => s._id === shelfId);
    if (!shelf) return;

    try {
      await axios.post("/api/shelves/add-to-shelf", {
        userId: shelf.userId,
        bookId: shelf.bookId,
        shelf: "Currently Reading",
      });

      toast.success("Started reading!");
      fetchLibrary();
    } catch {
      toast.error("Failed to start reading!");
    }
  };

  const handleUpdateProgress = async (shelfId: string, progress: number) => {
    const shelf = shelves.find((s) => s._id === shelfId);
    if (!shelf) return;

    try {
      const response = await axios.put("/api/shelves/update-progress", {
        userId: shelf.userId,
        bookId: shelf.bookId,
        progress,
      });

      if (response.data.movedToRead) {
        toast.success("Book completed and moved to Read!");
      }

      fetchLibrary();
    } catch {
      toast.error("Failed to update progress!");
    }
  };

  const handleRemove = (shelfId: string) => {
    const shelf = shelves.find((s) => s._id === shelfId);
    if (!shelf) return;

    Swal.fire({
      title: "Remove from library?",
      text: "This book will be removed from your shelf.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/api/shelves/remove-from-shelf", {
            data: { userId: shelf.userId, bookId: shelf.bookId },
          });

          toast.success("Removed from library!");
          fetchLibrary();
        } catch {
          toast.error("Failed to remove from library!");
        }
      }
    });
  };

  const getBookById = (bookId: string): FetchedBook | null => {
    return books.find((book) => book._id === bookId) || null;
  };

  const wantToReadBooks = shelves.filter((s) => s.shelf === "Want to Read");
  const currentlyReadingBooks = shelves.filter(
    (s) => s.shelf === "Currently Reading"
  );
  const readBooks = shelves.filter((s) => s.shelf === "Read");

  const renderShelf = (
    title: string,
    shelfBooks: FetchedUserShelf[],
    emptyMessage: string
  ) => (
    <div style={{ marginBottom: "80px" }}>
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className={`text-2xl font-bold ${josefin.className}`}>{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            {shelfBooks.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {shelfBooks.length === 1 ? "book" : "books"}
          </span>
        </div>
      </div>

      <div
        className="bg-linear-to-b from-muted/40 to-muted/20 rounded-xl p-8 border-b-2 border-muted relative"
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-muted-foreground/20 to-transparent"></div>

        {shelfBooks.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="text-6xl mb-4 opacity-20">📚</div>
            <p className="text-muted-foreground text-lg">{emptyMessage}</p>
          </div>
        ) : (
          <div className="flex flex-wrap" style={{ gap: "16px" }}>
            {shelfBooks.map((shelf) => {
              const book = getBookById(shelf.bookId);
              if (!book) return null;

              return (
                <LibraryBookCard
                  key={shelf._id}
                  shelf={shelf}
                  book={book}
                  onStartReading={handleStartReading}
                  onUpdateProgress={handleUpdateProgress}
                  onRemove={handleRemove}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className={`text-4xl font-bold mb-8 ${josefin.className}`}>
        My Library
      </h1>

      {renderShelf(
        "Want to Read",
        wantToReadBooks,
        "No books in your reading list"
      )}

      {renderShelf(
        "Currently Reading",
        currentlyReadingBooks,
        "Start reading a book to see it here"
      )}

      {renderShelf("Read", readBooks, "No completed books yet")}
    </div>
  );
}
