"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FetchedBook } from "@/types/fetchedBook";
import RecommendedBookCard from "@/components/pages/reader/home/RecommendedBookCard";
import ReadingStatsCard from "@/components/pages/reader/home/ReadingStatsCard";
import GenreDistributionChart from "@/components/pages/reader/home/GenreDistributionChart";
import MonthlyBooksReadChart from "@/components/pages/reader/home/MonthlyBooksReadChart";
import ActivityFeed from "@/components/pages/reader/home/ActivityFeed";
import { josefin } from "@/fonts/fonts";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";

interface RecommendationData {
  recommendations: (FetchedBook & {
    genreMatch?: number;
    avgRating?: number;
    reviewCount?: number;
  })[];
  reason: string;
  topGenres?: string[];
  genreCounts?: { [key: string]: number };
}

interface ReadingStats {
  totalBooks: number;
  wantToRead: number;
  currentlyReading: number;
  read: number;
  readThisYear: number;
  topGenres: { genre: string; count: number }[];
  reviewsWritten: number;
  avgProgress: number;
}

export default function Home() {
  const authContext = useAuth();
  const [recommendations, setRecommendations] =
    useState<RecommendationData | null>(null);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!authContext?.userData?._id) return;

    setLoading(true);
    try {
      const [recommendationsRes, statsRes] = await Promise.all([
        axios.get("/api/recommendations", {
          params: { userId: authContext.userData._id },
        }),
        axios.get("/api/stats/reading-stats", {
          params: { userId: authContext.userData._id },
        }),
      ]);

      setRecommendations(recommendationsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [authContext?.userData?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success("Recommendations refreshed!");
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
      <div className="mb-8">
        <h1 className={`text-4xl font-bold mb-2 ${josefin.className}`}>
          Welcome back, {authContext?.userData?.name}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your reading overview and personalized recommendations
        </p>
      </div>

      {stats && <ReadingStatsCard stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {authContext?.userData?._id && (
          <>
            <GenreDistributionChart userId={authContext.userData._id} />
            <MonthlyBooksReadChart userId={authContext.userData._id} />
          </>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-semibold ${josefin.className}`}>
              Recommended for You
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {recommendations?.reason === "fallback"
                ? "Popular books to get you started"
                : "Based on your reading preferences"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <IconRefresh
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {recommendations && recommendations.recommendations.length > 0 ? (
          <>
            <p className="text-xs text-muted-foreground mb-2">
              Showing {recommendations.recommendations.length} books
            </p>
            <div className="flex flex-wrap justify-center">
              {recommendations.recommendations.map((book) => (
                <RecommendedBookCard
                  key={book._id}
                  book={book}
                  reason={recommendations.reason}
                  topGenres={recommendations.topGenres}
                  genreCounts={recommendations.genreCounts}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="text-6xl mb-4 opacity-20">📚</div>
            <p className="text-muted-foreground text-lg">
              No recommendations available
            </p>
          </div>
        )}
      </div>

      <ActivityFeed />
    </div>
  );
}
