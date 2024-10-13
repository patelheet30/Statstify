import React from 'react';
import { Artist } from '@/lib/entities';
import MonthBreakdown from '@/components/MonthBreakdown';

interface ArtistDetailsProps {
    artist: Artist;
}

const ArtistDetails: React.FC<ArtistDetailsProps> = ({ artist }) => {
    return (
        <div>
            <h2>{artist.name}</h2>
            <p>Milliseconds Played: {artist.msPlayed}</p>
            <h3>Month-by-Month Breakdown:</h3>
            {Array.isArray(artist.whenPlayed) ? (
                <MonthBreakdown whenPlayed={artist.whenPlayed} />
            ) : (
                <p>N/A</p>
            )}
        </div>
    );
};

export default ArtistDetails;