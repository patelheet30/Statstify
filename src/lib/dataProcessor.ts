import { Song, Artist } from "@/lib/entities";
import { fetchDataFromIndexedDB, gatherFileNames } from "./dbutils";
import { getTracksInformation, getArtistsInformation } from "./spotifyAPI";

const BATCHSIZE = 50;

export async function processListeningHistory(updateLoadingText: (text: string) => void): Promise<{ songs: Song[], artists: Artist[] }> {
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

                if (songsMap.has(trackID)) {
                    const existingSong = songsMap.get(trackID)!;
                    existingSong.msPlayed += msPlayed;
                } else {
                    const newSong: Song = {
                        trackName,
                        trackID,
                        artistName,
                        albumName,
                        msPlayed,
                        whenPlayed: "N/A",
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
                                } else {
                                    const newArtist: Artist = {
                                        name: artist.name,
                                        id: artistID,
                                        artistURLLarge: "N/A",
                                        artistURLMedium: "N/A",
                                        artistURLSmall: "N/A",
                                        msPlayed: song.msPlayed,
                                        whenPlayed: "N/A",
                                        followers: 0,
                                    };
                                    artistsMap.set(artistID, newArtist);
                                }
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

        return { songs: sortedArray, artists: sortedArtistsArray };
    }
    catch (error) {
        console.error("Error processing listening history", error);
        return { songs: [], artists: [] };
    }
}