"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { josefin } from "@/fonts/fonts";
import { ReviewType } from "@/types/reviewType";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LeaveReviewSectionProps {
  bookId: string;
  userId: string;
}

export default function LeaveReviewSection({
  bookId,
  userId,
}: LeaveReviewSectionProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [checkingReview, setCheckingReview] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ReviewType>();

  useEffect(() => {
    const checkExistingReview = async () => {
      try {
        const response = await axios.get("/api/reviews/check-review", {
          params: { bookId, userId },
        });
        setHasReviewed(response.data.hasReviewed);
      } catch {
        console.error("Failed to check existing review");
      } finally {
        setCheckingReview(false);
      }
    };

    checkExistingReview();
  }, [bookId, userId]);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  const handleSubmitReview: SubmitHandler<ReviewType> = async (data) => {
    if (selectedRating === 0) {
      toast.error("Please select a rating!");
      return;
    }

    setLoading(true);

    const newReview = {
      bookId: bookId,
      userId: userId,
      rating: data.rating,
      review: data.review,
      status: "Pending",
    };

    await axios
      .post("/api/reviews/add-review", newReview)
      .then(() => {
        toast.success("Review submitted successfully!");
        reset();
        setSelectedRating(0);
        setHasReviewed(true);
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Failed to submit review");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (checkingReview) {
    return (
      <motion.div
        className="border-t pt-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </motion.div>
    );
  }

  if (hasReviewed) {
    return (
      <motion.div
        className="border-t pt-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className={`text-2xl font-semibold mb-4 ${josefin.className}`}>
          Leave a Review
        </h2>
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center py-4">
              You have already submitted a review for this book.
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
        Leave a Review
      </h2>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(handleSubmitReview)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="rating">Rating</FieldLabel>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 cursor-pointer"
                    >
                      {star <= (hoveredRating || selectedRating) ? (
                        <IconStarFilled className="h-8 w-8 text-yellow-500" />
                      ) : (
                        <IconStar className="h-8 w-8 text-gray-300" />
                      )}
                    </button>
                  ))}
                  {selectedRating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {selectedRating} star{selectedRating > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <input
                  type="hidden"
                  {...register("rating", { required: true, min: 1, max: 5 })}
                />
                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select a rating.
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="review">Your Review</FieldLabel>
                <textarea
                  id="review"
                  placeholder="Share your thoughts about this book..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-none"
                  {...register("review", { required: true, minLength: 10 })}
                />
                {errors.review?.type === "required" && (
                  <p className="text-red-500 text-sm mt-1">
                    Please write a review.
                  </p>
                )}
                {errors.review?.type === "minLength" && (
                  <p className="text-red-500 text-sm mt-1">
                    Review must be at least 10 characters long.
                  </p>
                )}
              </Field>

              <Field>
                <Button
                  disabled={loading}
                  type="submit"
                  size="sm"
                  className="cursor-pointer"
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
