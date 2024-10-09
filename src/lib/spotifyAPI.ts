import axios from "axios";

const backendUrl = "/api/spotify/token";

let accessToken: string | null = null;
let tokenExpirationTime: number | null = null;

const fetchAccessToken = async () => {
    const currentTime = Date.now();
    if (!accessToken || !tokenExpirationTime || currentTime >= tokenExpirationTime) {
        const response = await axios.get(backendUrl);
        
        accessToken = response.data.access_token;
        tokenExpirationTime = currentTime + 3600 * 1000;
    }
};

export const getTrackInformation = async (trackId: string) => {
    await fetchAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    });

    console.log('Track Information Response:', response.data);
    
    return response.data;
};

export const getTracksInformation = async (trackIds: string[]) => {
    await fetchAccessToken();
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
    await fetchAccessToken();
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

export const getAlbumsInformation = async (albumId: string[]) => {
    const response = await axios.get(`https://api.spotify.com/v1/albums`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            ids: albumId.join(",")
        }
    });

    console.log('Albums Information Response:', response.data);
    
    return response.data;
};