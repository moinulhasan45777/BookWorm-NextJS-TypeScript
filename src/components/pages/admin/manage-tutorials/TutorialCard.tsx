"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { FetchedTutorial } from "@/types/tutorialType";

interface TutorialCardProps {
  tutorial: FetchedTutorial;
  onDelete: (id: string) => void;
}

export default function TutorialCard({
  tutorial,
  onDelete,
}: TutorialCardProps) {
  const getYouTubeEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : "";
  };

  const embedUrl = getYouTubeEmbedUrl(tutorial.youtubeLink);

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1"></div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">
            {tutorial.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="relative w-full overflow-hidden rounded-lg"
            style={{ paddingBottom: "56.25%" }}
          >
            {embedUrl ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={embedUrl}
                title={tutorial.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Invalid video URL
                </p>
              </div>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(tutorial._id)}
            className="w-full"
          >
            <IconTrash className="h-4 w-4 mr-2" />
            Delete Tutorial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
