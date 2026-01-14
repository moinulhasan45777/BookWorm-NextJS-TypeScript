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
import { GenreType } from "@/types/genreType";
import { FetchedGenre } from "@/types/fetchedGenre";

import { IconX } from "@tabler/icons-react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #a5A5A5",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

interface EditGenreModalProps {
  genre: FetchedGenre;
  open: boolean;
  onClose: () => void;
  onGenreUpdated: () => void;
  className?: string;
}

export default function EditGenreModal({
  genre,
  open,
  onClose,
  onGenreUpdated,
  className,
  ...props
}: EditGenreModalProps & React.ComponentProps<"div">) {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GenreType>();

  useEffect(() => {
    if (open && genre) {
      setValue("title", genre.title);
      setValue("description", genre.description);
    }
  }, [open, genre, setValue]);

  const handleUpdate: SubmitHandler<GenreType> = async (data) => {
    setLoading(true);

    let genreImage = genre.genreImage;

    if (data.genreImage && data.genreImage[0]) {
      const profileImage = data.genreImage[0];
      const formData = new FormData();
      formData.append("image", profileImage);

      const image_API_URL = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_API}`;
      const res = await axios.post(image_API_URL, formData);
      genreImage = res.data.data.display_url;
    }

    const updatedGenre = {
      title: data.title,
      genreImage: genreImage,
      description: data.description,
    };

    try {
      await axios.put(`/api/genres/edit-genre/${genre._id}`, updatedGenre);
      reset();
      onGenreUpdated();
      onClose();
      toast.success("Genre updated successfully!");
    } catch {
      toast.error("Failed to update genre!");
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
                      Edit Genre
                    </h1>
                    <p
                      className={`text-muted-foreground text-balance ${josefin.className}`}
                    >
                      Update the genre information below.
                    </p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={genre.genreImage}
                        alt={genre.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                        Current Image
                      </div>
                    </div>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="title">Genre Title</FieldLabel>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Horror"
                      className="hover:ring-1"
                      {...register("title", { required: true })}
                    />
                    {errors.title?.type === "required" && (
                      <p className="text-red-500 text-sm">
                        Please enter a title for the Genre.
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="genreImage">
                      Genre Cover Photo (Optional)
                    </FieldLabel>
                    <Input
                      id="genreImage"
                      type="file"
                      className="hover:ring-1"
                      {...register("genreImage")}
                    />
                    <p className="text-sm text-gray-500">
                      Leave empty to keep current image
                    </p>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="genreDescription">
                      Description
                    </FieldLabel>
                    <textarea
                      id="description"
                      placeholder="The movies under the Horror Genre usually scares people...."
                      className="hover:ring-1 rounded-md border border-[#e5e5e5] transition-all duration-200 p-2 text-sm h-30"
                      {...register("description", { required: true })}
                    />
                    {errors.description?.type === "required" && (
                      <p className="text-red-500 text-sm">
                        Please give a description to this genre.
                      </p>
                    )}
                  </Field>
                  <Field>
                    <Button
                      disabled={loading}
                      type="submit"
                      className="cursor-pointer"
                    >
                      Update Genre
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
