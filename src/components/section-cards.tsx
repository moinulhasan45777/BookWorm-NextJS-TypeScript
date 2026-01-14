"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface SectionCardsProps {
  numberOfUsers: number;
  numberOfBooks: number;
  numberOfGenres: number;
  numberOfReviews: number;
}

export function SectionCards({
  numberOfUsers,
  numberOfBooks,
  numberOfGenres,
  numberOfReviews,
}: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Books</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {numberOfBooks}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            The number of books in BookWorm
          </div>
          <Link
            href="/admin/manage-books"
            className="text-muted-foreground underline hover:text-primary"
          >
            Manage Books
          </Link>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {numberOfUsers}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            The number of users registered in BookWorm
          </div>
          <Link
            href="/admin/manage-users"
            className="text-muted-foreground underline hover:text-primary"
          >
            Manage Users
          </Link>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Genres</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {numberOfGenres}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            The number of genres in BookWorm
          </div>
          <Link
            href="/admin/manage-genres"
            className="text-muted-foreground underline hover:text-primary"
          >
            Manage Genres
          </Link>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Reviews</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {numberOfReviews}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reviews awaiting moderation
          </div>
          <Link
            href="/admin/moderate-reviews"
            className="text-muted-foreground underline hover:text-primary"
          >
            Moderate Reviews
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
