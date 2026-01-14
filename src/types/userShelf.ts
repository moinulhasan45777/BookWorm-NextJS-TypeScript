export interface UserShelf {
  userId: string;
  bookId: string;
  shelf: string;
  progress: number;
  dateAdded: Date;
  dateStarted: Date | null;
  dateFinished: Date | null;
  userRating: number | null;
}
