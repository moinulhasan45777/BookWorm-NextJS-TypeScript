"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconPlayerPlay,
  IconTrash,
  IconDotsVertical,
  IconCheck,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { FetchedBook } from "@/types/fetchedBook";
import { FetchedUserShelf } from "@/types/fetchedUserShelf";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LibraryBookCardProps {
  shelf: FetchedUserShelf;
  book: FetchedBook;
  onStartReading: (shelfId: string) => void;
  onUpdateProgress: (shelfId: string, progress: number) => void;
  onRemove: (shelfId: string) => void;
}

export default function LibraryBookCard({
  shelf,
  book,
  onStartReading,
  onUpdateProgress,
  onRemove,
}: LibraryBookCardProps) {
  const router = useRouter();
  const [tempProgress, setTempProgress] = useState(shelf.progress);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempProgress(parseInt(e.target.value));
  };

  const handleUpdateClick = () => {
    onUpdateProgress(shelf._id, tempProgress);
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
        {shelf.shelf === "Currently Reading" && (
          <div
            className="absolute z-20"
            style={{ top: "0", left: "0", transform: "translate(-8px, -8px)" }}
          >
            <Badge className="bg-primary hover:bg-primary/90 text-xs px-2.5 py-1 shadow-lg">
              {shelf.progress}%
            </Badge>
          </div>
        )}

        {shelf.shelf === "Read" && (
          <div
            className="absolute z-20"
            style={{ top: "0", left: "0", transform: "translate(-8px, -8px)" }}
          >
            <Badge className="bg-primary hover:bg-primary/90 text-xs px-2.5 py-1 shadow-lg">
              ✓ Read
            </Badge>
          </div>
        )}

        <div
          className="absolute top-0 right-0 z-20"
          style={{ transform: "translate(8px, -8px)" }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-primary text-primary-foreground rounded-full p-2 transition-all shadow-lg hover:scale-110 hover:shadow-xl">
                <IconDotsVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {shelf.shelf === "Want to Read" && (
                <DropdownMenuItem
                  onClick={() => onStartReading(shelf._id)}
                  className="cursor-pointer"
                >
                  <IconPlayerPlay className="h-4 w-4 mr-2" />
                  Start Reading
                </DropdownMenuItem>
              )}
              {shelf.shelf === "Currently Reading" && (
                <DropdownMenuItem
                  onClick={(e) => e.preventDefault()}
                  className="flex-col items-start gap-3 py-3"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    Update Progress
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tempProgress}
                    onChange={handleProgressChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-sm font-bold text-primary">
                      {tempProgress}%
                    </span>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateClick();
                      }}
                      className="h-7 px-3 text-xs"
                    >
                      <IconCheck className="h-3 w-3 mr-1" />
                      Update
                    </Button>
                  </div>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onRemove(shelf._id)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <IconTrash className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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

          {shelf.shelf === "Currently Reading" && (
            <div className="absolute top-2 left-2 right-2 z-10">
              <div className="bg-black/75 backdrop-blur-md rounded-md px-2.5 py-1.5 shadow-lg">
                <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-white h-1 rounded-full transition-all duration-500"
                    style={{ width: `${shelf.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

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
