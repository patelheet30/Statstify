/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { Album } from '@/lib/entities';
import MonthBreakdown from '@/components/MonthBreakdown';

interface AlbumDetailsProps {
    album: Album;
    getMsPlayedForSong: (songId: string) => number;
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ album, getMsPlayedForSong }) => {

    const getAlbumNameClass = (name: string) => {
        if (name.length <= 10) return 'text-8xl';
        if (name.length <= 20) return 'text-6xl';
        if (name.length <= 30) return 'text-4xl';
        return 'text-2xl';
    };

    const totalDurationMs = album.songsInAlbum.reduce((acc, song) => acc + song.duration_ms, 0);
    const totalMinutes = Math.floor(totalDurationMs / 60000);
    const totalSeconds = Math.floor((totalDurationMs % 60000) / 1000);

    const durationString = totalMinutes >= 60
        ? `${Math.floor(totalMinutes / 60)} hr ${totalMinutes % 60} min`
        : `${totalMinutes} min ${totalSeconds} sec`;

    return (
        <div className='p-4'>
            <div className='flex flex-row space-x-4'>
                <div>
                    <img src={album.albumURLMedium} alt={album.albumName} className='rounded-sm w-48 h-48'/>
                </div>
                <div className='flex flex-col justify-end'>
                    <h1 className='antialiased text-sm'>Album</h1>
                    <h1 className={`font-bold ${getAlbumNameClass(album.albumName)}`}>{album.albumName}</h1>
                    <div className='flex flex-row pt-4 text-sm antialiased'>
                        <h1 className='font-semibold'>
                            {album.artists.map((artist, index) => (
                                <span key={artist.id}>
                                    {artist.name}
                                    {index !== album.artists.length - 1 ? ' • ' : ''}
                                </span>
                            ))}
                        </h1>
                        <h1>&nbsp;•&nbsp;</h1>
                        <h1>
                            {new Date(album.releaseDate).getFullYear()}
                        </h1>
                        <h1>
                            &nbsp;•&nbsp;{album.totalTracks} songs, {durationString}
                        </h1>
                    </div>
                </div>
            </div>
            {/* <h2>{album.albumName}</h2>
            <p>Milliseconds Played: {album.msPlayed}</p>
            <p>Total Tracks: {album.totalTracks}</p>
            <p>Release Date: {album.releaseDate}</p>
            <h3>Month-by-Month Breakdown:</h3>
            {Array.isArray(album.whenPlayed) ? (
                <MonthBreakdown whenPlayed={album.whenPlayed} />
            ) : (
                <p>N/A</p>
            )}
            <h3>Songs in Album:</h3>
            <ul>
                {album.songsInAlbum.map((track) => (
                    <li key={track.id}>
                        {track.name} - {Math.floor(getMsPlayedForSong(track.id) / 60000)} minutes
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default AlbumDetails;