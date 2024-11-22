import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import querystring from 'querystring';

const clientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const tokenUrl = "https://accounts.spotify.com/api/token";
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let tokenExpirationTime: number | null = null;

const refreshAccessToken = async (refreshToken: string) => {
    const response = await axios.post(
        tokenUrl,
        querystring.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(clientID + ":" + clientSecret).toString("base64"),
            },
        }
    );

    return response.data;
};

const getClientCredentialsToken = async () => {
    const currentTime = Date.now();
    
    // Try refresh token first if available
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
            // If refresh fails, fall back to client credentials
            cachedRefreshToken = null;
        }
    }

    // Fall back to client credentials flow
    if (!cachedAccessToken || !tokenExpirationTime || currentTime >= tokenExpirationTime) {
        const response = await axios.post(
            tokenUrl,
            querystring.stringify({
                grant_type: "client_credentials",
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Basic " + Buffer.from(clientID + ":" + clientSecret).toString("base64"),
                },
            }
        );

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
            // Handle authorization code flow
            const response = await axios.post(
                tokenUrl,
                querystring.stringify({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: redirectUri,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: "Basic " + Buffer.from(clientID + ":" + clientSecret).toString("base64"),
                    },
                }
            );
            
            cachedAccessToken = response.data.access_token;
            cachedRefreshToken = response.data.refresh_token;
            tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
            
            return NextResponse.json({
                access_token: cachedAccessToken,
                refresh_token: cachedRefreshToken,
                expires_in: response.data.expires_in
            });
        }

        // Default client credentials flow
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