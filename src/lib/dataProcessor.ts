import { Song } from "@/lib/entities";
import { fetchDataFromIndexedDB, gatherFileNames } from "./dbutils";
import { getTracksInformation } from "./spotifyAPI";

export async function processListeningHistory(): Promise<Song[]> {

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

        const sortedArray = Array.from(songsMap.values()).sort((a, b) => b.msPlayed - a.msPlayed);

        const allTrackIds = sortedArray.map((song) => song.trackID);
        const batchSize = 50;

        for (let i = 0; i < allTrackIds.length; i += batchSize) {
            const batch = allTrackIds.slice(i, i + batchSize);
            try {
            const trackInfo = await getTracksInformation(batch);

            for (const song of sortedArray) {
                const track = trackInfo.tracks.find((track: any) => track.id === song.trackID);
                if (track) {
                try {
                    song.coverArtURLLarge = track.album.images[0].url;
                    song.coverArtURLMedium = track.album.images[1].url;
                    song.coverArtURLSmall = track.album.images[2].url;
                } catch (error) {
                    console.error(`Error processing song: ${song.trackName} (ID: ${song.trackID})`, error);
                }
                }
            }
            } catch (error) {
            console.error("Error processing batch:", batch, error);
            }
        }

        return sortedArray;
    }
    catch (error) {
        console.error("Error processing listening history", error);
        return [];
    }
}