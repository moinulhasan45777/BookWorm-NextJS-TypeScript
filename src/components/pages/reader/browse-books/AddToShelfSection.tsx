"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface AddToShelfSectionProps {
  bookId: string;
  userId: string;
}

export default function AddToShelfSection({
  bookId,
  userId,
}: AddToShelfSectionProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);
  const [currentShelf, setCurrentShelf] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const shelves = [
    { value: "Want to Read", label: "Want to Read" },
    { value: "Currently Reading", label: "Currently Reading" },
    { value: "Read", label: "Read" },
  ];

  useEffect(() => {
    const checkShelfStatus = async () => {
      try {
        const response = await axios.get("/api/shelves/check-status", {
          params: { userId, bookId },
        });
        setCurrentShelf(response.data.shelf);
      } catch {
        console.error("Failed to check shelf status");
      } finally {
        setCheckingStatus(false);
      }
    };

    checkShelfStatus();
  }, [bookId, userId]);

  const handleAddToShelf = async (shelf: string) => {
    setLoading(true);

    try {
      await axios.post("/api/shelves/add-to-shelf", {
        userId,
        bookId,
        shelf,
      });

      toast.success(
        currentShelf
          ? "Shelf updated successfully!"
          : "Added to shelf successfully!"
      );
      setCurrentShelf(shelf);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Failed to add to shelf");
      } else {
        toast.error("Failed to add to shelf");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromShelf = () => {
    Swal.fire({
      title: "Remove from shelf?",
      text: "This book will be removed from your library.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await axios.delete("/api/shelves/remove-from-shelf", {
            data: { userId, bookId },
          });

          toast.success("Removed from shelf successfully!");
          setCurrentShelf(null);
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            toast.error(
              err.response?.data?.error || "Failed to remove from shelf"
            );
          } else {
            toast.error("Failed to remove from shelf");
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (checkingStatus) {
    return (
      <div className="shrink-0">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0">
      <div className="flex items-center gap-3">
        <DropdownMenu onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={loading}
              size="default"
              variant={currentShelf || dropdownOpen ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {currentShelf ? (
                <IconBookmarkFilled className="h-5 w-5 mr-2" />
              ) : (
                <IconBookmark className="h-5 w-5 mr-2" />
              )}
              {currentShelf || "Add to Shelf"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {shelves.map((shelf) => (
              <DropdownMenuItem
                key={shelf.value}
                onClick={() => handleAddToShelf(shelf.value)}
                className="cursor-pointer"
              >
                {currentShelf === shelf.value && (
                  <IconCheck className="h-4 w-4 mr-2 text-green-500" />
                )}
                <span
                  className={currentShelf === shelf.value ? "ml-0" : "ml-6"}
                >
                  {shelf.label}
                </span>
              </DropdownMenuItem>
            ))}
            {currentShelf && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleRemoveFromShelf}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <IconTrash className="h-4 w-4 mr-2" />
                  Remove from Shelf
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {currentShelf && (
          <span className="text-sm text-muted-foreground">In your library</span>
        )}
      </div>
    </div>
  );
}
