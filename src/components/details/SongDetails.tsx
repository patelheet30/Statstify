import React from 'react';
import { Song } from '@/lib/entities';
import MonthBreakdown from '@/components/MonthBreakdown';

interface SongDetailsProps {
    song: Song;
}

const SongDetails: React.FC<SongDetailsProps> = ({ song }) => {
    return (
        <div>
            <h2>{song.trackName}</h2>
            <p>Artist: {song.artistName}</p>
            <p>Album: {song.albumName}</p>
            <p>Milliseconds Played: {song.msPlayed}</p>
            <h3>Month-by-Month Breakdown:</h3>
            {Array.isArray(song.whenPlayed) ? (
                <MonthBreakdown whenPlayed={song.whenPlayed} />
            ) : (
                <p>N/A</p>
            )}
        </div>
    );
};

export default SongDetails;