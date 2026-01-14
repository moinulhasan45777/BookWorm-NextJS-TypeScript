"use client";

import React, { useEffect, useState } from "react";
import MediaCard from "@/components/pages/admin/manage-genres/MediaCard";
import AddGenreModal from "@/components/pages/admin/manage-genres/AddGenreModal";
import axios from "axios";
import { toast } from "sonner";
import { FetchedGenre } from "@/types/fetchedGenre";
export default function ManageGenres() {
  const [allGenres, setAllGenres] = useState<FetchedGenre[]>([]);

  const getAllGenres = async () => {
    try {
      const result = await axios.get("/api/genres");
      setAllGenres(result.data);
    } catch {
      toast.error("Failed to load Genres!");
      setAllGenres([]);
    } finally {
    }
  };

  useEffect(() => {
    getAllGenres();
  }, []);

  return (
    <div className="mx-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
        <h1 className="text-3xl font-semibold">Manage Genres</h1>
        <AddGenreModal onGenreAdded={getAllGenres} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-2 gap-y-7">
        {allGenres.map((genre) => (
          <MediaCard
            key={genre._id}
            genre={genre}
            onDelete={getAllGenres}
            onUpdate={getAllGenres}
          />
        ))}
      </div>
    </div>
  );
}
