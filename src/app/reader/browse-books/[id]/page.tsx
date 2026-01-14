"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { FetchedBook } from "@/types/fetchedBook";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconArrowLeft } from "@tabler/icons-react";
import { josefin } from "@/fonts/fonts";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import LeaveReviewSection from "@/components/pages/reader/browse-books/LeaveReviewSection";
import ReviewsSection from "@/components/pages/reader/browse-books/ReviewsSection";
import AddToShelfSection from "@/components/pages/reader/browse-books/AddToShelfSection";
import { useAuth } from "@/hooks/useAuth";

export default function BookDetails() {
  const params = useParams();
  const router = useRouter();
  const authContext = useAuth();
  const [book, setBook] = useState<FetchedBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/books/${params.id}`);
        setBook(response.data);
      } catch {
        console.error("Failed to fetch book");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  useEffect(() => {
    if (backButtonRef.current) {
      gsap.fromTo(
        backButtonRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }

    if (imageRef.current && book) {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, [book]);

  const handleBackClick = () => {
    if (backButtonRef.current) {
      gsap.to(backButtonRef.current, {
        x: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          router.push("/reader/browse-books");
        },
      });
    } else {
      router.push("/reader/browse-books");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="py-8">
        <div className="flex justify-center items-center min-h-[400px] flex-col gap-4">
          <p className="text-muted-foreground text-lg">Book not found</p>
          <Button onClick={() => router.push("/reader/browse-books")}>
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Button
        ref={backButtonRef}
        variant="ghost"
        onClick={handleBackClick}
        className="mb-6 cursor-pointer hover:underline hover:text-primary hover:bg-transparent transition-all duration-200"
      >
        <IconArrowLeft className="h-4 w-4 mr-2" />
        Back to Browse
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-1"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative">
            <div
              ref={imageRef}
              className="relative w-full aspect-2/3 rounded-lg overflow-hidden shadow-md"
            >
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className={`text-4xl font-bold mb-2 ${josefin.className}`}>
                  {book.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-4">
                  by {book.author}
                </p>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {book.genre}
                </Badge>
              </div>
              {authContext?.userData?._id && (
                <AddToShelfSection
                  bookId={book._id}
                  userId={authContext.userData._id}
                />
              )}
            </div>
          </motion.div>

          <motion.div
            className="border-t pt-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4">About this book</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {book.description}
            </p>
          </motion.div>

          <motion.div
            className="border-t pt-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Book Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{book.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Author</p>
                <p className="font-medium">{book.author}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Genre</p>
                <p className="font-medium">{book.genre}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ReviewsSection bookId={book._id} />

      {authContext?.userData?._id && (
        <div className="mt-8">
          <LeaveReviewSection
            bookId={book._id}
            userId={authContext.userData._id}
          />
        </div>
      )}
    </div>
  );
}
