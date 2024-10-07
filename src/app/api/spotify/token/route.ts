import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import querystring from 'querystring';

const clientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const tokenUrl = "https://accounts.spotify.com/api/token";

let cachedAccessToken: string | null = null;
let tokenExpirationTime: number | null = null;

const getClientCredentialsToken = async () => {
    const currentTime = Date.now();
    if (cachedAccessToken && tokenExpirationTime && currentTime < tokenExpirationTime) {
        return cachedAccessToken;
    }

    const response = await axios.post(
        tokenUrl,
        querystring.stringify({
            grant_type: "client_credentials",
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(clientID + ":" + clientSecret).toString("base64"),
            },
        }
    );

    cachedAccessToken = response.data.access_token;
    tokenExpirationTime = currentTime + response.data.expires_in * 1000; // expires_in is in seconds

    return cachedAccessToken;
};

export async function GET() {
    try {
        const token = await getClientCredentialsToken();
        return NextResponse.json({ access_token: token });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}