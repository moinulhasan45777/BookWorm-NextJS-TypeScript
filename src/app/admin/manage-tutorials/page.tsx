"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus, IconX } from "@tabler/icons-react";
import { FetchedTutorial } from "@/types/tutorialType";
import TutorialCard from "@/components/pages/admin/manage-tutorials/TutorialCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function ManageTutorials() {
  const [tutorials, setTutorials] = useState<FetchedTutorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/tutorials");
      setTutorials(response.data);
    } catch {
      toast.error("Failed to fetch tutorials!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !youtubeLink.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post("/api/tutorials", {
        title,
        youtubeLink,
      });

      if (response.data.success) {
        toast.success(response.data.success);
        setTitle("");
        setYoutubeLink("");
        setOpen(false);
        fetchTutorials();
      }
    } catch {
      toast.error("Failed to add tutorial!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setYoutubeLink("");
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `/api/tutorials/delete-tutorial/${id}`
          );

          if (response.data.success) {
            toast.success(response.data.success);
            fetchTutorials();
          }
        } catch {
          toast.error("Failed to delete tutorial!");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
        <h1 className="text-3xl font-semibold">Manage Tutorials</h1>
        <Button onClick={() => setOpen(true)}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Tutorial
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Tutorial</h2>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter tutorial title"
              />
            </div>
            <div>
              <Label htmlFor="youtubeLink">YouTube Link</Label>
              <Input
                id="youtubeLink"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Adding..." : "Add Tutorial"}
            </Button>
          </form>
        </Box>
      </Modal>

      {tutorials.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="text-6xl mb-4 opacity-20">🎥</div>
          <p className="text-muted-foreground text-lg">No tutorials yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <TutorialCard
              key={tutorial._id}
              tutorial={tutorial}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
