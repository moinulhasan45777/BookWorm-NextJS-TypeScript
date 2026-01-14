"use client";
import * as React from "react";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import { Button } from "@/components/ui/button";
import { IconPlus, IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { josefin } from "@/fonts/fonts";

import { SubmitHandler, useForm } from "react-hook-form";
import { RegistrationForm } from "@/types/registrationForm";
import "dotenv/config";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { setToken } from "@/lib/token";
import { useAuth } from "@/hooks/useAuth";
import { GenreType } from "@/types/genreType";

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

export default function AddGenreModal({
  className,
  onGenreAdded,
  ...props
}: React.ComponentProps<"div"> & { onGenreAdded: () => void }) {
  // States
  const [loading, setLoading] = useState<boolean>(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GenreType>();

  const handleRegistration: SubmitHandler<GenreType> = async (data) => {
    setLoading(true);
    // Upload Image
    const gImage = data.genreImage[0];
    const formData = new FormData();
    formData.append("image", gImage);

    const image_API_URL = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_API}`;
    const res = await axios.post(image_API_URL, formData);

    const genreImage = res.data.data.display_url;

    const newGenre = {
      title: data.title,
      genreImage: genreImage,
      description: data.description,
    };

    await axios
      .post("/api/genres/add-genre", newGenre)
      .then(() => {
        toast.success("Genre Successfully Added!");
        reset();
        onGenreAdded();
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          "Status: " + err.response?.status + ".  " + err.response?.data?.error
        );
        setLoading(false);
      })
      .finally(() => {
        setOpen(false);
      });
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    reset();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="outline"
        size="sm"
        className="bg-primary text-white cursor-pointer hover:shadow-md"
      >
        <IconPlus />

        <span className="hidden lg:inline">Add Genre</span>
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="absolute top-2 right-2 z-10">
            <Button
              onClick={handleClose}
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
                  onSubmit={handleSubmit(handleRegistration)}
                  className="p-6 md:p-8"
                  noValidate
                >
                  <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <h1 className={`text-2xl font-bold ${josefin.className}`}>
                        Add a new Genre
                      </h1>
                      <p
                        className={`text-muted-foreground text-balance ${josefin.className}`}
                      >
                        Adding a new genre opens a new way to read the world.
                      </p>
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
                        Genre Cover Photo
                      </FieldLabel>
                      <Input
                        id="genreImage"
                        type="file"
                        className="hover:ring-1"
                        {...register("genreImage", { required: true })}
                      />
                      {errors.genreImage?.type === "required" && (
                        <p className="text-red-500 text-sm">
                          Please upload a Genre Cover Photo.
                        </p>
                      )}
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
                        Add Genre
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
