/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef } from 'react';
import { Album } from '@/lib/entities';
import MonthBreakdown from '@/components/MonthBreakdown';
import SongItem from './SongList';
import { Clock3, CalendarCog } from 'lucide-react';

interface AlbumDetailsProps {
    album: Album;
    getMsPlayedForSong?: (songId: string) => number;
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ album, getMsPlayedForSong = () => 0 }) => {
    const [timeScale, setTimescale] = useState<string>('monthly');
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getAlbumNameClass = (name: string) => {
        if (name.length <= 10) return 'text-8xl';
        if (name.length <= 20) return 'text-6xl';
        if (name.length <= 30) return 'text-4xl';
        return 'text-2xl';
    };

    const handleTimescaleChange = (scale: string) => {
        setTimescale(scale);
        setDropdownVisible(false);
    };

    const handleTimescaleClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const totalDurationMs = album.songsInAlbum.reduce((acc, song) => acc + song.duration_ms, 0);
    const totalMinutes = Math.floor(totalDurationMs / 60000);
    const totalSeconds = Math.floor((totalDurationMs % 60000) / 1000);

    const durationString = totalMinutes >= 60
        ? `${Math.floor(totalMinutes / 60)} hr ${totalMinutes % 60} min`
        : `${totalMinutes} min ${totalSeconds} sec`;

    const formatLengthOfSong = (duration: number) => {
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div>
            <div
                style={{
                    position: 'relative',
                    background: 'rgb(18,18,18)',
                    minHeight: '100%'
                }}
            >
                <div className='relative z-10'>
                    <div className='flex flex-row space-x-4 pt-8 pb-4 pr-4 pl-4 border-b border-none bg-gradient-to-b'>
                        <div>
                            <img src={album.albumURLMedium} alt={album.albumName} className='rounded-sm w-48 h-48' />
                        </div>
                        <div className='flex flex-col justify-end'>
                            <h1 className='antialiased text-sm'>Album</h1>
                            <h1 className={`font-extrabold ${getAlbumNameClass(album.albumName)}`}>{album.albumName}</h1>
                            <div className='flex flex-row pt-4 text-sm antialiased'>
                                <h1 className='font-semibold'>
                                    {album.artists.map((artist, index) => (
                                        <span key={artist.id}>
                                            <a href={`https:/open.spotify.com/artist/${artist.id}`} target="_blank" rel="noopener noreferrer" className='hover:underline'>
                                                {artist.name}
                                            </a>
                                            {index !== album.artists.length - 1 ? ' • ' : ''}
                                        </span>
                                    ))}
                                </h1>
                                <h1 className='text-zinc-400'>&nbsp;•&nbsp;</h1>
                                <h1 className='text-zinc-400'>
                                    {new Date(album.releaseDate).getFullYear()}
                                </h1>
                                <h1 className='text-zinc-400'>
                                    &nbsp;•&nbsp;{album.totalTracks} songs, {durationString}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='relative z-10 pr-4 pl-4 pt-8'>
                    <div className='flex flex-row justify-between pr-5 antialiased pb-2 pl-4 border-t-0 border-l-o border-r-0 border-b-2'>
                        <div className='flex flex-row items-center'>
                            <div className='min-w-8'>
                                #
                            </div>
                            <div>
                                Title
                            </div>
                        </div>
                        <div className='text-zinc-400 antialiased flex flex-row items-center space-x-20'>
                            <div>
                                Mins Listened
                            </div>
                            <div>
                                <Clock3 />
                            </div>
                        </div>
                    </div>
                    <div>
                        <ul className='pt-2 pb-4'>
                            {album.songsInAlbum.map((track) => (
                                <SongItem
                                    key={track.id}
                                    song={track}
                                    getMsPlayedForSong={getMsPlayedForSong}
                                    formatLengthOfSong={formatLengthOfSong}
                                />
                            ))}
                        </ul>
                    </div>
                    <div className='pb-4'>
                        <h2 className='font-semibold text-lg'>Chart Breakdown</h2>
                        <div className='mb-4 relative z-20 max-w-fit' ref={dropdownRef}>
                            <button
                                onClick={handleTimescaleClick}
                                className='flex items-center p-2 bg-[rgb(18,18,18)] text-zinc-400 hover:text-white space-x-2'
                            >
                                <CalendarCog /> <div>Timescale</div>
                            </button>
                            {dropdownVisible && (
                                <div className='absolute mt-2 w-48 bg-zinc-800 text-white rounded-md shadow-lg'>
                                    <ul className='py-1'>
                                        <li>
                                            <button
                                                onClick={() => handleTimescaleChange('monthly')}
                                                className='block w-full text-left px-4 py-2 hover:bg-zinc-700'
                                            >
                                                Monthly
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleTimescaleChange('weekly')}
                                                className='block w-full text-left px-4 py-2 hover:bg-zinc-700'
                                            >
                                                Weekly
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleTimescaleChange('daily')}
                                                className='block w-full text-left px-4 py-2 hover:bg-zinc-700'
                                            >
                                                Daily
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleTimescaleChange('yearly')}
                                                className='block w-full text-left px-4 py-2 hover:bg-zinc-700'
                                            >
                                                Yearly
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <MonthBreakdown whenPlayed={album.whenPlayed} timeScale={timeScale} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumDetails;