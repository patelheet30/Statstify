import React from 'react';
import { MdExplicit } from 'react-icons/md';
import { AlbumTrack } from '@/lib/entities';

interface SongItemProps {
    song: AlbumTrack;
    getMsPlayedForSong: (songId: string) => number;
    formatLengthOfSong: (durationMs: number) => string;
}

const SongItem: React.FC<SongItemProps> = ({ song, getMsPlayedForSong, formatLengthOfSong }) => {
    return (
        <li className='flex flex-row justify-between pr-4 pl-4 hover:border-none hover:bg-zinc-800 pt-1 pb-1 hover:rounded-md'>
            <div className='flex flex-row items-center'>
                <div className='min-w-8'>
                    {song.track_number}
                </div>
                <div className='flex flex-col'>
                    <div>
                        {song.name}
                    </div>
                    <div className='text-zinc-400 antialiased flex flex-row items-center space-x-0.5'>
                        {song.explicit && (
                            <div>
                                <MdExplicit size={16} />
                            </div>
                        )}
                        <div>
                            Disc {song.disc_number}
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-zinc-400 antialiased flex flex-row items-center'>
                <div className='mr-4'>
                    {Math.floor(getMsPlayedForSong(song.id) / 60000)} minutes
                </div>
                <div className='min-w-[5.9rem] text-end'>
                    {formatLengthOfSong(song.duration_ms)}
                </div>
            </div>
        </li>
    );
};

export default SongItem;