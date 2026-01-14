"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { josefin } from "@/fonts/fonts";
import { FetchedReview } from "@/types/fetchedReview";
import { FetchedUser } from "@/types/fetchedUser";
import { motion } from "framer-motion";

interface ReviewsSectionProps {
  bookId: string;
}

export default function ReviewsSection({ bookId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<FetchedReview[]>([]);
  const [users, setUsers] = useState<FetchedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, usersRes] = await Promise.all([
          axios.get(`/api/reviews/book/${bookId}`),
          axios.get("/api/users"),
        ]);
        setReviews(reviewsRes.data);
        setUsers(usersRes.data);
      } catch {
        console.error("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  const getUserById = (userId: string): FetchedUser | null => {
    return users.find((user) => user._id === userId) || null;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rating ? (
            <IconStarFilled key={star} className="h-5 w-5 text-yellow-500" />
          ) : (
            <IconStar key={star} className="h-5 w-5 text-gray-300" />
          )
        )}
      </div>
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to reviews section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <motion.div
        className="border-t pt-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className={`text-2xl font-semibold mb-4 ${josefin.className}`}>
          Reviews
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </motion.div>
    );
  }

  if (reviews.length === 0) {
    return (
      <motion.div
        className="border-t pt-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className={`text-2xl font-semibold mb-4 ${josefin.className}`}>
          Reviews
        </h2>
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center py-4">
              No reviews yet. Be the first to review this book!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="border-t pt-6"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h2 className={`text-2xl font-semibold mb-4 ${josefin.className}`}>
        Reviews ({reviews.length})
      </h2>

      <div className="space-y-4">
        {currentReviews.map((review) => {
          const user = getUserById(review.userId);
          return (
            <Card key={review._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.photo} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {user?.name || "Anonymous"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email || ""}
                        </p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm leading-relaxed">{review.review}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstReview + 1} to{" "}
            {Math.min(indexOfLastReview, reviews.length)} of {reviews.length}{" "}
            reviews
          </div>
          <div className="flex items-center gap-2">
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
    </motion.div>
  );
}
