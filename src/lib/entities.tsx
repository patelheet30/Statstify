export interface Song {
    trackName: string;
    trackID: string;
    artistName: string;
    albumName: string;
    msPlayed: number; // Duration in milliseconds
    whenPlayed: string; // ISO 8601 date string
  }