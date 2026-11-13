export type Station = {
  id: number;
  title: string;
  genre: string;
  url: string;
};

export type LocalTrack = {
  id: string;
  title: string;
  url: string;
};

export type PlayerMode = "radio" | "local";
