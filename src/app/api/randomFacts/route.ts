import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';


const spotifyFacts = [
    "Spotify was founded by Daniel Ek and Martin Lorentzon",
    "As of June 2024, Spotify has over 626 million monthly active users",
    "Over 236 million users subscribe to some form of premium service provided by Spotify",
    "Spotify is headquarted in Stockholm, Sweden",
    "Spotify is listed on the NYSE as Spotify Technologies S.A. (A Luxembourg City based holding company)",
    "Spotify boasts over 100 million tracks and 6 million podcasts",
    "As of December 2023, Spotify was listed as the 47th most visited website",
    "Surprisingly, after the US, Brazilian users boast the most active monthly users on Spotify",
    "Originally, Spotify would only allows users 5 play per songs every month",
    "Blinding Lights by The Weeknd is the most streamed song on Spotify",
    "Bohemian Rhapsody by Queen is the oldest song in the Top 100 streamed songs on Spotify",
    "The Weeknd boasts the most songs in the Top 100 where he is the lead artist (5 Songs)",
    "Dance Monkey by Tones and I, spent the most days as the number 1 position song on the Spotify Global Charts",
    "Fortnight by Taylor Swift holds the record for the most streamed song in one day on Spotify",
    "Un Verano Sin Ti by Bad Bunny, is the most streamed album on Spotify",
    "Taylor Swift has the top 3 spots for the most streamed album in a single day",
    "Thinking Out Loud by Ed Sheeran, was the first song that crossed 500 million streams",
    "Only 3 artists currently have over a 100 million active monthly listeners with The Weeknd claiming the top spot",
    "One Dance by Drake, was the first song that crossed 1 billion streams",
    "Spotify is the official streaming partner for FC Barcelona",
    "Spotify currently has 4 pricing tiers, Free, Premium (1 User), Duo (2 Premium Users), Family (6 Premium Users)",
    "Around 80% of Spotify's backend services are written in the Python programming language",
    "Spotify initially used a P2P system for streaming to reduce workload on their servers"
];

export async function GET(req: NextRequest) {
    try {
        return NextResponse.json({ facts: spotifyFacts });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to retrieve facts' }, 
            { status: 500 }
        );
    }
}