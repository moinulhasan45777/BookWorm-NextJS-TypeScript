export interface Tutorial {
  title: string;
  youtubeLink: string;
}

export interface FetchedTutorial extends Tutorial {
  _id: string;
}
