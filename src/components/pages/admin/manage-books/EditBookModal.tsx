"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { josefin } from "@/fonts/fonts";
import { SubmitHandler, useForm } from "react-hook-form";
import "dotenv/config";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BookType } from "@/types/bookType";
import { FetchedBook } from "@/types/fetchedBook";
import { FetchedGenre } from "@/types/fetchedGenre";
import { IconX } from "@tabler/icons-react";
import Image from "next/image";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #a5A5A5",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

interface EditBookModalProps {
  book: FetchedBook;
  open: boolean;
  onClose: () => void;
  onBookUpdated: () => void;
  className?: string;
}

export default function EditBookModal({
  book,
  open,
  onClose,
  onBookUpdated,
  className,
  ...props
}: EditBookModalProps & React.ComponentProps<"div">) {
  const [loading, setLoading] = useState<boolean>(false);
  const [genres, setGenres] = useState<FetchedGenre[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookType>();

  const getAllGenres = async () => {
    try {
      const result = await axios.get("/api/genres");
      setGenres(result.data);
    } catch {
      toast.error("Failed to load genres!");
      setGenres([]);
    }
  };

  useEffect(() => {
    if (open) {
      getAllGenres();
      if (book) {
        setValue("title", book.title);
        setValue("author", book.author);
        setValue("description", book.description);
      }
    }
  }, [open, book, setValue]);

  useEffect(() => {
    if (open && book && genres.length > 0) {
      setValue("genre", book.genre);
    }
  }, [open, book, genres, setValue]);

  const handleUpdate: SubmitHandler<BookType> = async (data) => {
    setLoading(true);

    let coverImage = book.coverImage;

    if (data.coverImage && data.coverImage[0]) {
      const coverImageFile = data.coverImage[0];
      const formData = new FormData();
      formData.append("image", coverImageFile);

      const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${process.env.NEXT_PUBLIC_IMAGE_API}`;
      const res = await axios.post(image_API_URL, formData);
      coverImage = res.data.data.display_url;
    }

    const updatedBook = {
      title: data.title,
      author: data.author,
      genre: data.genre,
      coverImage: coverImage,
      description: data.description,
    };

    try {
      await axios.put(`/api/books/edit-book/${book._id}`, updatedBook);
      reset();
      onBookUpdated();
      onClose();
      toast.success("Book updated successfully!");
    } catch {
      toast.error("Failed to update book!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="p-0 ">
              <form
                onSubmit={handleSubmit(handleUpdate)}
                className="p-6 md:p-8"
                noValidate
              >
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className={`text-2xl font-bold ${josefin.className}`}>
                      Edit Book
                    </h1>
                    <p
                      className={`text-muted-foreground text-balance ${josefin.className}`}
                    >
                      Update the book information below.
                    </p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                        Current Cover
                      </div>
                    </div>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="title">Book Title</FieldLabel>
                    <Input
                      id="title"
                      type="text"
                      placeholder="The Great Gatsby"
                      className="hover:ring-1"
                      {...register("title", { required: true })}
                    />
                    {errors.title?.type === "required" && (
                      <p className="text-red-500 text-sm">
                        Please enter a title for the book.
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="author">Author</FieldLabel>
                    <Input
                      id="author"
                      type="text"
                      placeholder="F. Scott Fitzgerald"
                      className="hover:ring-1"
                      {...register("author", { required: true })}
                    />
                    {errors.author?.type === "required" && (
                      <p className="text-red-500 text-sm">
                        Please enter the author name.
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="genre">Genre</FieldLabel>
                    <select
                      id="genre"
                      className="hover:ring-1 rounded-md border border-[#e5e5e5] transition-all duration-200 p-2 text-sm"
                      {...register("genre", { required: true })}
                    >
                      <option value="">Select a genre</option>
                      {genres.map((genre) => (
                        <option key={genre._id} value={genre.title}>
                          {genre.title}
                        </option>
                      ))}
                    </select>
                    {errors.genre?.type === "required" && (
                      <p className="text-red-500 text-sm">
                        Please select a genre.
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="coverImage">
                      Book Cover Image (Optional)
                    </FieldLabel>
                    <Input
                      id="coverImage"
                      type="file"
                      className="hover:ring-1"
                      {...register("coverImage")}
                    />
                    <p className="text-sm text-gray-500">
                      Leave empty to keep current cover
                    </p>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <textarea
                      id="description"
                      placeholder="A classic American novel about the Jazz Age..."
                      className="hover:ring-1 rounded-md border border-[#e5e5e5] transition-all duration-200 p-2 text-sm h-30"
                      {...register("description", { required: true })}
                    />
                    {errors.description?.type === "required" && (
                      <p className="text-red-500 text-sm">
                        Please provide a description for the book.
                      </p>
                    )}
                  </Field>
                  <Field>
                    <Button
                      disabled={loading}
                      type="submit"
                      className="cursor-pointer"
                    >
                      Update Book
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </Box>
    </Modal>
  );
}
