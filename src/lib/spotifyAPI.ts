import axios from "axios";
import { getClientCredentialsToken } from "./spotifyAuth";

export const getTrackInformation = async (trackId: string) => {
    const accessToken = await getClientCredentialsToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    });
    return response.data;
};

export const getTracksInformation = async (trackIds: string[]) => {
    const accessToken = await getClientCredentialsToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            ids: trackIds.join(",")
        },
    });

    console.log('Tracks Information Response:', response.data);

    return response.data;
};

export const getArtistsInformation = async (artistIDs: string[]) => {
    const accessToken = await getClientCredentialsToken();
    const response = await axios.get(`https://api.spotify.com/v1/artists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            ids: artistIDs.join(",")
        }
    });

    console.log('Artists Information Response:', response.data);

    return response.data;
};