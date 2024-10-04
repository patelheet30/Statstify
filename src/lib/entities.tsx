export interface Song {
    trackName: string;
    trackID: string;
    artistName: string;
    albumName: string;
    msPlayed: number;
    whenPlayed: string;
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
    whenPlayed: string;
    followers: number;
}