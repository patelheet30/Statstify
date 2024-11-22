import axios from "axios";

const backendUrl = "/api/spotify/token";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpirationTime: number | null = null;

const fetchAccessToken = async () => {
    try {
        const response = await axios.get(backendUrl);
        
        if (!response.data.access_token) {
            throw new Error('No access token received');
        }

        accessToken = response.data.access_token;
        if (response.data.refresh_token) {
            refreshToken = response.data.refresh_token;
        }
        tokenExpirationTime = Date.now() + 
            (response.data.expires_in || (3600 - 300)) * 1000;

        return accessToken;
    } catch (error) {
        console.error('Error fetching token:', error);
        // Clear tokens on error
        accessToken = null;
        refreshToken = null;
        tokenExpirationTime = null;
        throw error;
    }
};

const getValidToken = async () => {
    const currentTime = Date.now();
    if (!accessToken || !tokenExpirationTime || currentTime >= tokenExpirationTime) {
        return await fetchAccessToken();
    }
    return accessToken;
};

// Rest of the API functions remain the same

// Update other functions similarly

export const getTrackInformation = async (trackId: string) => {
    const token = await getValidToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    return response.data;
};

export const getTracksInformation = async (trackIds: string[]) => {
    const token = await getValidToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            ids: trackIds.join(",")
        },
    });
    return response.data;
};

export const getArtistsInformation = async (artistIDs: string[]) => {
    const token = await getValidToken();
    const response = await axios.get(`https://api.spotify.com/v1/artists`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            ids: artistIDs.join(",")
        }
    });
    return response.data;
};

export const getAlbumsInformation = async (albumId: string[]) => {
    const token = await getValidToken();
    const response = await axios.get(`https://api.spotify.com/v1/albums`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            ids: albumId.join(",")
        }
    });
    return response.data;
};