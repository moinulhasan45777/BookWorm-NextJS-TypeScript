export interface FetchedUserShelf {
  _id: string;
  userId: string;
  bookId: string;
  shelf: string;
  progress: number;
  dateAdded: string;
  dateStarted: string | null;
  dateFinished: string | null;
  userRating: number | null;
}
