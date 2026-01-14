"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { FetchedReview } from "@/types/fetchedReview";
import { FetchedBook } from "@/types/fetchedBook";
import { FetchedUser } from "@/types/fetchedUser";
import ReviewCard from "@/components/pages/admin/moderate-reviews/ReviewCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ModerateReviews() {
  const [allReviews, setAllReviews] = useState<FetchedReview[]>([]);
  const [allBooks, setAllBooks] = useState<FetchedBook[]>([]);
  const [allUsers, setAllUsers] = useState<FetchedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getAllReviews = async () => {
    try {
      const result = await axios.get("/api/reviews");
      setAllReviews(result.data);
    } catch {
      toast.error("Failed to load reviews!");
      setAllReviews([]);
    }
  };

  const getAllBooks = async () => {
    try {
      const result = await axios.get("/api/books");
      setAllBooks(result.data);
    } catch {
      toast.error("Failed to load books!");
      setAllBooks([]);
    }
  };

  const getAllUsers = async () => {
    try {
      const result = await axios.get("/api/users");
      setAllUsers(result.data);
    } catch {
      toast.error("Failed to load users!");
      setAllUsers([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getAllReviews(), getAllBooks(), getAllUsers()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleApprove = (reviewId: string) => {
    Swal.fire({
      title: "Approve Review?",
      text: "This review will be marked as approved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`/api/reviews/approve-review/${reviewId}`);
          Swal.fire({
            title: "Approved!",
            text: "Review has been approved.",
            icon: "success",
          });
          getAllReviews();
        } catch {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      }
    });
  };

  const handleDelete = (reviewId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/reviews/delete-review/${reviewId}`);
          Swal.fire({
            title: "Deleted!",
            text: "Review has been deleted.",
            icon: "success",
          });
          getAllReviews();
        } catch {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      }
    });
  };

  const getBookById = (bookId: string): FetchedBook | null => {
    return allBooks.find((book) => book._id === bookId) || null;
  };

  const getUserById = (userId: string): FetchedUser | null => {
    return allUsers.find((user) => user._id === userId) || null;
  };

  const filteredReviews = allReviews.filter((review) => {
    if (statusFilter === "all") return true;
    return review.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-6 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Moderate Reviews</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {filteredReviews.length} review(s) found
      </div>

      {filteredReviews.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-muted-foreground text-lg">No reviews found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              book={getBookById(review.bookId)}
              user={getUserById(review.userId)}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
