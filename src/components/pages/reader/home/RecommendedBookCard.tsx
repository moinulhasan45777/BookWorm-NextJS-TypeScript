"use client";

import { FetchedBook } from "@/types/fetchedBook";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconInfoCircle } from "@tabler/icons-react";
import Tooltip from "@mui/material/Tooltip";

interface RecommendedBookCardProps {
  book: FetchedBook & {
    genreMatch?: number;
    avgRating?: number;
    reviewCount?: number;
  };
  reason?: string;
  topGenres?: string[];
  genreCounts?: { [key: string]: number };
}

export default function RecommendedBookCard({
  book,
  reason,
  topGenres,
  genreCounts,
}: RecommendedBookCardProps) {
  const router = useRouter();

  const getReasonText = () => {
    if (reason === "fallback") {
      return "Popular book in the community";
    }

    const reasons = [];

    if (book.genreMatch && book.genreMatch > 0 && genreCounts) {
      reasons.push(
        `Matches your preference for ${book.genre} (${
          genreCounts[book.genre]
        } books read)`
      );
    }

    if (book.avgRating && book.avgRating >= 4) {
      reasons.push(`Highly rated (${book.avgRating.toFixed(1)} stars)`);
    }

    if (book.reviewCount && book.reviewCount >= 5) {
      reasons.push(`${book.reviewCount} community reviews`);
    }

    return reasons.length > 0
      ? reasons.join(" • ")
      : "Recommended based on your reading history";
  };

  return (
    <div
      className="relative inline-block"
      style={{ width: "150px", height: "225px", margin: "8px" }}
    >
      <div
        className="relative cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-105"
        style={{
          width: "150px",
          height: "225px",
          perspective: "1000px",
        }}
      >
        <div
          className="relative w-full h-full rounded-md overflow-hidden border-2 border-gray-300/70"
          style={{
            transform: "rotateY(-3deg)",
            transformStyle: "preserve-3d",
          }}
          onClick={() => router.push(`/reader/browse-books/${book._id}`)}
        >
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
            priority
          />

          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.3) 60%, transparent 100%)",
            }}
          ></div>

          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
            <p className="text-white text-sm font-bold line-clamp-2 mb-1.5 drop-shadow-lg">
              {book.title}
            </p>
            <p
              className="text-xs line-clamp-1 drop-shadow-lg"
              style={{ color: "#b0b0b0" }}
            >
              {book.author}
            </p>
          </div>

          <Tooltip
            title={
              <div>
                <p style={{ fontWeight: 600, marginBottom: "4px" }}>
                  Why this book?
                </p>
                <p>{getReasonText()}</p>
              </div>
            }
            placement="left"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "black",
                  color: "white",
                  fontSize: "0.75rem",
                  maxWidth: "300px",
                  padding: "12px",
                },
              },
              arrow: {
                sx: {
                  color: "black",
                },
              },
            }}
          >
            <div className="absolute top-2 right-2 z-10 pointer-events-auto">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5 cursor-help shadow-lg">
                <IconInfoCircle className="h-4 w-4 text-white" />
              </div>
            </div>
          </Tooltip>

          <div
            className="absolute left-0 top-0 bottom-0 w-2"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.4), transparent)",
              transform: "translateX(-100%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
