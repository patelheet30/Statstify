import { Song } from "@/lib/entities";
import { fetchDataFromIndexedDB, gatherFileNames } from "./dbutils";

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
                    };
                    songsMap.set(trackID, newSong);
                }
            }
        }
        console.log("First Song: ", Array.from(songsMap.values())[0]);

        return Array.from(songsMap.values()).sort((a, b) => b.msPlayed - a.msPlayed);
    }
    catch (error) {
        console.error("Error processing listening history", error);
        return [];
    }
}