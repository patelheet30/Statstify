export interface Song {
    trackName: string;
    trackID: string;
    artistName: string;
    albumName: string;
    msPlayed: number;
    whenPlayed: {date: string; msPlayed: number}[];
    coverArtURLLarge: string;
    coverArtURLMedium: string;
    coverArtURLSmall: string;
  }

export interface Artist {
    name: string;
    id: string;
    artistURLLarge: string;
    artistURLMedium: string;
    artistURLSmall: string;
    msPlayed: number;
    whenPlayed: {date: string; msPlayed: number}[];
    followers: number;
}

export interface AlbumTrack {
  name: string;
  explicit: boolean;
  id: string;
  disc_number: number;
  track_number: number;
  duration_ms: number;
}

export interface Album {
    albumName: string;
    albumID: string;
    totalTracks: number;
    albumURLLarge: string;
    albumURLMedium: string;
    albumURLSmall: string;
    msPlayed: number;
    whenPlayed: {date: string; msPlayed: number}[];
    songsListened: Song[];
    songsInAlbum: AlbumTrack[];
    releaseDate: string;
    artists: { name: string; id: string }[];
}

export interface User {
  name: string;
  email: string;
  pfpURL: string;
  birthdate: string;
  age: number;
  accountCreationDate: string;
  gender: string;
}