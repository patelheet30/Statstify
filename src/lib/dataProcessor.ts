import { Song, Artist, Album } from "@/lib/entities";
import { fetchDataFromIndexedDB, gatherFileNames } from "./dbutils";
import { getTracksInformation, getArtistsInformation, getAlbumsInformation } from "./spotifyAPI";

const BATCHSIZE = 50;
const ALBUMBATCHSIZE = 20;

export async function processListeningHistory(updateLoadingText: (text: string) => void): Promise<{ songs: Song[], artists: Artist[], albums: Album[] }> {
    updateLoadingText("Processing your listening history...");

    try {
        // create an empty map to store files from indexedDB
        const files = [];

        const fileNames = await gatherFileNames();
        for (const file of fileNames) {
            const fileName = file.toString();
            if (fileName.includes("Spotify Extended Streaming History")) {
                const file = await fetchDataFromIndexedDB(fileName);
                if (file) {
                    files.push(file);
                }
            }
        }

        const songsMap: Map<string, Song> = new Map();
        const artistsMap: Map<string, Artist> = new Map();
        const albumsMap: Map<string, Album> = new Map();
        const trackIDs = new Set<string>();

        for (const file of files) {
            const data = file;

            for (const entry of data) {
                if (entry.episode_name) continue;
                if (!entry.spotify_track_uri || !entry.ms_played) continue;

                const trackID = entry.spotify_track_uri.split(":")[2];
                const msPlayed = entry.ms_played;
                const trackName = entry.master_metadata_track_name;
                const artistName = entry.master_metadata_album_artist_name;
                const albumName = entry.master_metadata_album_album_name;
                const whenListened = entry.ts;
                const dateListened = new Date(whenListened).toISOString().split('T')[0];

                if (songsMap.has(trackID)) {
                    const existingSong = songsMap.get(trackID)!;
                    existingSong.msPlayed += msPlayed;

                    existingSong.whenPlayed.push({date: dateListened, msPlayed: msPlayed});
                } else {
                    const newSong: Song = {
                        trackName,
                        trackID,
                        artistName,
                        albumName,
                        msPlayed,
                        whenPlayed: [{date: dateListened, msPlayed: msPlayed}],
                        coverArtURLLarge: "N/A",
                        coverArtURLMedium: "N/A",
                        coverArtURLSmall: "N/A",
                    };
                    songsMap.set(trackID, newSong);
                    trackIDs.add(trackID);
                }
            }
        }

        updateLoadingText("Fetching track information from the Spotify API (This may take several minutes)...");

        const sortedArray = Array.from(songsMap.values()).sort((a, b) => b.msPlayed - a.msPlayed);

        const allTrackIds = sortedArray.map((song) => song.trackID);

        for (let i = 0; i < allTrackIds.length; i += BATCHSIZE) {
            const batch = allTrackIds.slice(i, i + BATCHSIZE);
            try {
                const trackInfo = await getTracksInformation(batch);

                for (const song of sortedArray) {
                    const track = trackInfo.tracks.find((track: any) => track.id === song.trackID);
                    if (track) {
                        try {
                            song.coverArtURLLarge = track.album.images[0].url;
                            song.coverArtURLMedium = track.album.images[1].url;
                            song.coverArtURLSmall = track.album.images[2].url;



                            for (const artist of track.artists) {
                                const artistID = artist.id;
                                if (artistsMap.has(artistID)) {
                                    const existingArtist = artistsMap.get(artistID)!;
                                    existingArtist.msPlayed += song.msPlayed;
                                    
                                    const dateListened = new Date(song.whenPlayed[0].date).toISOString().split('T')[0];
                                    for (const playEvent of song.whenPlayed) {
                                        const dateListened = playEvent.date;
                                        const msPlayed = playEvent.msPlayed;
                                        existingArtist.whenPlayed.push({ date: dateListened, msPlayed });
                                    }

                                } else {
                                    const newArtist: Artist = {
                                        name: artist.name,
                                        id: artistID,
                                        artistURLLarge: "N/A",
                                        artistURLMedium: "N/A",
                                        artistURLSmall: "N/A",
                                        msPlayed: song.msPlayed,
                                        whenPlayed: song.whenPlayed.map(playEvent => ({ date: playEvent.date, msPlayed: playEvent.msPlayed })),
                                        followers: 0,
                                    };
                                    artistsMap.set(artistID, newArtist);
                                }
                            }

                            const albumID = track.album.id;
                            if (albumsMap.has(albumID)) {
                                const existingAlbum = albumsMap.get(albumID)!;
                                existingAlbum.msPlayed += song.msPlayed;
                                existingAlbum.songsListened.push(song);

                                for (const playEvent of song.whenPlayed) {
                                    const dateListened = playEvent.date;
                                    const msPlayed = playEvent.msPlayed;
                                    existingAlbum.whenPlayed.push({ date: dateListened, msPlayed });
                                }
                            } else {
                                const newAlbum: Album = {
                                    albumName: track.album.name,
                                    albumID,
                                    albumURLLarge: track.album.images[0].url,
                                    albumURLMedium: track.album.images[1].url,
                                    albumURLSmall: track.album.images[2].url,
                                    msPlayed: song.msPlayed,
                                    whenPlayed: song.whenPlayed.map(playEvent => ({ date: playEvent.date, msPlayed: playEvent.msPlayed })),
                                    songsListened: [song],
                                    songsInAlbum: [],
                                    totalTracks: track.album.total_tracks,
                                    releaseDate: track.album.release_date,
                                };
                                albumsMap.set(albumID, newAlbum);
                            }

                        } catch (error) {
                            console.error(`Error processing song: ${song.trackName} (ID: ${song.trackID})`, error);
                        }
                    }
                }
            } catch (error) {
                console.error("Error processing batch:", batch, error);
            }
        }

        updateLoadingText("Fetching artist information from the Spotify API (This may take several minutes)...");

        const artistIds = Array.from(artistsMap.keys());
        for (let i = 0; i < artistIds.length; i += BATCHSIZE) {
            const batch = artistIds.slice(i, i + BATCHSIZE);

            try {
                const artistInfo = await getArtistsInformation(batch);

                for (const artist of artistInfo.artists) {
                    const existingArtist = artistsMap.get(artist.id);
                    if (existingArtist) {
                        try {
                            existingArtist.artistURLLarge = artist.images[0].url;
                            existingArtist.artistURLMedium = artist.images[1].url;
                            existingArtist.artistURLSmall = artist.images[2].url;
                            existingArtist.followers = artist.followers.total;
                        } catch (error) {
                            console.error(`Error processing artist: ${artist.name} (ID: ${artist.id})`, error);
                        }
                    }
                }
            } catch (error) {
                console.error("Error processing batch:", batch, error);
            }
        }

        const sortedArtistsArray = Array.from(artistsMap.values()).sort((a, b) => b.msPlayed - a.msPlayed);

        updateLoadingText("Fetching album information from the Spotify API (This may take several minutes)...");

        const albumIds = Array.from(albumsMap.keys());
        for (let i = 0; i < albumIds.length; i += ALBUMBATCHSIZE) {
            const batch = albumIds.slice(i, i + ALBUMBATCHSIZE);

            try {
                const albumInfo = await getAlbumsInformation(batch);

                for (const album of albumInfo.albums) {
                    const existingAlbum = albumsMap.get(album.id);
                    if (existingAlbum) {
                        try {
                            existingAlbum.albumURLLarge = album.images[0].url;
                            existingAlbum.albumURLMedium = album.images[1].url;
                            existingAlbum.albumURLSmall = album.images[2].url;

                            for (const track of album.tracks.items) {
                                const newTrack: any = {
                                    name: track.name,
                                    explicit: track.explicit,
                                    id: track.id,
                                    disc_number: track.disc_number,
                                    track_number: track.track_number,
                                    duration_ms: track.duration_ms,
                                };
                                existingAlbum.songsInAlbum.push(newTrack);
                            }
                        } catch (error) {
                            console.error(`Error processing album: ${album.name} (ID: ${album.id})`, error);
                        }
                    }
                }
            } catch (error) {
                console.error("Error processing batch:", batch, error);
            }
        }

        const sortedAlbumsArray = Array.from(albumsMap.values()).sort((a, b) => b.msPlayed - a.msPlayed);

        return { songs: sortedArray, artists: sortedArtistsArray, albums: sortedAlbumsArray };
    }
    catch (error) {
        console.error("Error processing listening history", error);
        return { songs: [], artists: [], albums: [] };
    }
}