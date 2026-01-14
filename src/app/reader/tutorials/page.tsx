"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FetchedTutorial } from "@/types/tutorialType";
import { josefin } from "@/fonts/fonts";

export default function Tutorials() {
  const [tutorials, setTutorials] = useState<FetchedTutorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/tutorials");
      setTutorials(response.data.slice(0, 12));
    } catch {
      toast.error("Failed to fetch tutorials!");
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : "";
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className={`text-4xl font-bold mb-8 ${josefin.className}`}>
        Tutorials
      </h1>

      {tutorials.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="text-6xl mb-4 opacity-20">🎥</div>
          <p className="text-muted-foreground text-lg">
            No tutorials available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial) => {
            const embedUrl = getYouTubeEmbedUrl(tutorial.youtubeLink);
            return (
              <div key={tutorial._id} className="space-y-3">
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  {embedUrl ? (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                      src={embedUrl}
                      title={tutorial.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">Invalid video URL</p>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold line-clamp-2">
                  {tutorial.title}
                </h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
