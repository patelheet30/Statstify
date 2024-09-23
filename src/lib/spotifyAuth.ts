import axios from "axios";
import querystring from "querystring";

require("dotenv").config();

const clientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

const tokenUrl = "https://accounts.spotify.com/api/token";

export const getClientCredentialsToken = async () => {
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

    return response.data.access_token;
};
