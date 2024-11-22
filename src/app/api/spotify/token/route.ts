import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const clientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const tokenUrl = "https://accounts.spotify.com/api/token";
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let tokenExpirationTime: number | null = null;

export const runtime = 'edge';

const refreshAccessToken = async (refreshToken: string) => {
    const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(`${clientID}:${clientSecret}`),
        },
    });

    return response.data;
};

const getClientCredentialsToken = async () => {
    const currentTime = Date.now();
    
    if (cachedRefreshToken) {
        try {
            const refreshedTokens = await refreshAccessToken(cachedRefreshToken);
            cachedAccessToken = refreshedTokens.access_token;
            if (refreshedTokens.refresh_token) {
                cachedRefreshToken = refreshedTokens.refresh_token;
            }
            tokenExpirationTime = currentTime + refreshedTokens.expires_in * 1000;
            return cachedAccessToken;
        } catch (error) {
            cachedRefreshToken = null;
        }
    }

    if (!cachedAccessToken || !tokenExpirationTime || currentTime >= tokenExpirationTime) {
        const params = new URLSearchParams({
            grant_type: "client_credentials"
        });

        const response = await axios.post(tokenUrl, params.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + btoa(`${clientID}:${clientSecret}`),
            },
        });

        cachedAccessToken = response.data.access_token;
        tokenExpirationTime = currentTime + response.data.expires_in * 1000;
    }

    return cachedAccessToken;
};

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        
        if (code) {
            const params = new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri!,
            });

            const response = await axios.post(tokenUrl, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Basic " + btoa(`${clientID}:${clientSecret}`),
                },
            });
            
            cachedAccessToken = response.data.access_token;
            cachedRefreshToken = response.data.refresh_token;
            tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
            
            return NextResponse.json({
                access_token: cachedAccessToken,
                refresh_token: cachedRefreshToken,
                expires_in: response.data.expires_in
            });
        }

        const token = await getClientCredentialsToken();
        return NextResponse.json({ 
            access_token: token,
            refresh_token: cachedRefreshToken,
            expires_in: tokenExpirationTime! - Date.now()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}