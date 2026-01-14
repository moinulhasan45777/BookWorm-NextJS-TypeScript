"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconBook,
  IconBookmark,
  IconStar,
  IconClock,
} from "@tabler/icons-react";
import Link from "next/link";

interface Activity {
  type: "finished" | "added" | "rated";
  userName: string;
  bookTitle: string;
  bookId: string;
  shelf?: string;
  rating?: number;
  timestamp: string;
  message: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("/api/activity-feed");
        setActivities(response.data);
      } catch {
        console.error("Failed to fetch activity feed");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "finished":
        return <IconBook className="h-5 w-5 text-green-500" />;
      case "added":
        return <IconBookmark className="h-5 w-5 text-blue-500" />;
      case "rated":
        return <IconStar className="h-5 w-5 text-yellow-500" />;
      default:
        return <IconClock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return past.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0"
            >
              <div className="mt-1">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{activity.userName}</span>{" "}
                  {activity.type === "finished" && "finished reading "}
                  {activity.type === "added" && `added `}
                  {activity.type === "rated" && "rated "}
                  <Link
                    href={`/reader/browse-books/${activity.bookId}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {activity.bookTitle}
                  </Link>
                  {activity.type === "added" && ` to ${activity.shelf} shelf`}
                  {activity.type === "rated" &&
                    ` ${activity.rating} ${
                      activity.rating === 1 ? "star" : "stars"
                    }`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
