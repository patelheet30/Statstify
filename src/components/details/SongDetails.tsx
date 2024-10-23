import React, { useState, useRef, useEffect } from 'react';
import { Song } from '@/lib/entities';
import MonthBreakdown from '@/components/MonthBreakdown';
import { CalendarCog } from 'lucide-react';

interface SongDetailsProps {
    song: Song;
}

const SongDetails: React.FC<SongDetailsProps> = ({ song }) => {
    const [timeScale, setTimescale] = useState<string>('monthly');
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    return (
        <div>
            <div
                style={{
                    position: 'relative',
                    background: 'rgb(18,18,18)',
                    minHeight: '100%'
                }}
            >
                <h2>{song.trackName}</h2>
                <p>Artist: {song.artistName}</p>
                <p>Album: {song.albumName}</p>
                <p>Milliseconds Played: {song.msPlayed}</p>
                <h2 className='font-semibold text-lg'>Chart Breakdown</h2>
                <div className='mb-4 relative max-w-fit' ref={dropdownRef}>
                    <button
                        onClick={handleTimescaleClick}
                        className='flex items-center p-2 bg-[rgb(18,18,18)] text-zinc-400 hover:text-white space-x-2'
                    >
                        <CalendarCog className='ml-2' /><div>Timescale</div>
                    </button>
                    {dropdownVisible && (
                        <div className='absolute mt-2 w-48 bg-zinc-800 text-white rounded-md shadow-lg z-20'>
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
                {Array.isArray(song.whenPlayed) ? (
                    <MonthBreakdown whenPlayed={song.whenPlayed} timeScale={timeScale} />
                ) : (
                    <p>N/A</p>
                )}
            </div>
        </div>
    );
};

export default SongDetails;