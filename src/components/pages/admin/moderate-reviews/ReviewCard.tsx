"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconStar,
  IconStarFilled,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import { FetchedReview } from "@/types/fetchedReview";
import { FetchedBook } from "@/types/fetchedBook";
import { FetchedUser } from "@/types/fetchedUser";

interface ReviewCardProps {
  review: FetchedReview;
  book: FetchedBook | null;
  user: FetchedUser | null;
  onApprove: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  book,
  user,
  onApprove,
  onDelete,
}: ReviewCardProps) {
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

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            {book ? (
              <div className="relative w-32 h-48 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-48 rounded-lg bg-muted flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No Image</p>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {book?.title || "Unknown Book"}
              </h3>
              <p className="text-sm text-muted-foreground">
                by {book?.author || "Unknown Author"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {renderStars(review.rating)}
              <Badge
                variant={review.status === "Approved" ? "default" : "outline"}
                className={
                  review.status === "Approved"
                    ? "bg-green-500 hover:bg-green-600"
                    : ""
                }
              >
                {review.status}
              </Badge>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm leading-relaxed">{review.review}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium">
                {user?.name || "Unknown User"}
              </p>
              <p className="text-sm text-muted-foreground">
                {user?.email || "No email"}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              {review.status === "Pending" && (
                <Button
                  size="sm"
                  onClick={() => onApprove(review._id)}
                  className="cursor-pointer"
                >
                  <IconCheck className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(review._id)}
                className="cursor-pointer"
              >
                <IconTrash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
