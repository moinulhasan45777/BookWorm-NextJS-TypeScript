"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconBook,
  IconBookmarks,
  IconChecks,
  IconStar,
  IconTrendingUp,
} from "@tabler/icons-react";

interface ReadingStatsCardProps {
  stats: {
    totalBooks: number;
    wantToRead: number;
    currentlyReading: number;
    read: number;
    readThisYear: number;
    topGenres: { genre: string; count: number }[];
    reviewsWritten: number;
    avgProgress: number;
  };
}

export default function ReadingStatsCard({ stats }: ReadingStatsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          <IconBook className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBooks}</div>
          <p className="text-xs text-muted-foreground mt-1">In your library</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Books Read</CardTitle>
          <IconChecks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.read}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.readThisYear} this year
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Currently Reading
          </CardTitle>
          <IconBookmarks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentlyReading}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.avgProgress}% avg progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reviews</CardTitle>
          <IconStar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.reviewsWritten}</div>
          <p className="text-xs text-muted-foreground mt-1">Reviews written</p>
        </CardContent>
      </Card>

      {stats.topGenres.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Favorite Genres
            </CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.topGenres.map((genre, index) => (
                <div
                  key={genre.genre}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                >
                  <span className="font-semibold">#{index + 1}</span>
                  <span>{genre.genre}</span>
                  <span className="text-xs opacity-70">({genre.count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
