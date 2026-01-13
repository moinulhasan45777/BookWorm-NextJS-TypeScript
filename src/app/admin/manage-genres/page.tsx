import React from "react";
import MediaCard from "@/components/pages/admin/manage-genres/MediaCard";
import AddGenreModal from "@/components/pages/admin/manage-genres/AddGenreModal";
export default function ManageGenres() {
  return (
    <div className="mx-6">
      <div
        className="mt-7 mb-8
      ml-5 flex justify-between items-center"
      >
        <h1
          className="text-3xl
       font-semibold  "
        >
          Manage Genres
        </h1>
        <AddGenreModal></AddGenreModal>
      </div>
      <MediaCard></MediaCard>
    </div>
  );
}
