/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import { Song } from '@/lib/entities';
import MonthBreakdown from '@/components/MonthBreakdown';
import { CalendarCog } from 'lucide-react';
import { getTrackInformation } from '@/lib/spotifyAPI';

interface SongDetailsProps {
    song: Song;
}

const SongDetails: React.FC<SongDetailsProps> = ({ song }) => {
    const [timeScale, setTimescale] = useState<string>('monthly');
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [spotifyDetails, setSpotifyDetails] = useState<any>(null);
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

    const getTrackNameClass = (name: string) => {
        if (name.length <= 10) return 'text-8xl';
        if (name.length <= 20) return 'text-6xl';
        if (name.length <= 30) return 'text-4xl';
        return 'text-2xl';
    };

    useEffect(() => {
        const fetchSpotifyDetails = async () => {
            const data = await getTrackInformation(song.trackID);
            setSpotifyDetails(data);
        };

        fetchSpotifyDetails();
    }, [song.trackID])

    const durationString = (duration: number) => {
        const totalMinutes = Math.floor(duration / 60000);
        const totalSeconds = Math.floor((duration % 60000) / 1000);

        return totalMinutes >= 60
            ? `${Math.floor(totalMinutes / 60)} hr ${totalMinutes % 60} min`
            : `${totalMinutes} min ${totalSeconds} sec`;
    };

    const totalMinutesListened = Math.floor(song.msPlayed / 60000);
    const totalListens = song.whenPlayed.length;

    const getMostListenedMonth = () => {
        const monthCounts: { [key: string]: { minutes: number; times: number } } = {};

        song.whenPlayed.forEach(play => {
            const date = new Date(play.date);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
            if (!monthCounts[monthYear]) {
                monthCounts[monthYear] = { minutes: 0, times: 0 };
            }
            monthCounts[monthYear].minutes += Math.floor(play.msPlayed / 60000);
            monthCounts[monthYear].times++;
        });

        const mostListenedMonth = Object.keys(monthCounts).reduce((a, b) => monthCounts[a].times > monthCounts[b].times ? a : b);
        const [month, year] = mostListenedMonth.split('-');
        return {
            month: `${new Date(0, parseInt(month) - 1).toLocaleString('default', { month: 'long' })} ${year}`,
            minutes: monthCounts[mostListenedMonth].minutes,
            times: monthCounts[mostListenedMonth].times
        };
    };

    const getMostListenedDay = () => {
        const dayCounts: { [key: string]: { minutes: number; times: number } } = {};

        song.whenPlayed.forEach(play => {
            const date = new Date(play.date).toLocaleDateString();
            if (!dayCounts[date]) {
                dayCounts[date] = { minutes: 0, times: 0 };
            }
            dayCounts[date].minutes += Math.floor(play.msPlayed / 60000);
            dayCounts[date].times++;
        });

        const mostListenedDay = Object.keys(dayCounts).reduce((a, b) => dayCounts[a].times > dayCounts[b].times ? a : b);
        return {
            day: mostListenedDay,
            minutes: dayCounts[mostListenedDay].minutes,
            times: dayCounts[mostListenedDay].times
        };
    };

    const mostListenedMonth = getMostListenedMonth();
    const mostListenedDay = getMostListenedDay();


    return (
        <div
            style={{
                position: 'relative',
                background: 'rgb(18,18,18)',
                minHeight: '100%'
            }}
        >
            <div>
                <div>
                    <div className='flex flex-row space-x-4 pt-8 pb-4 pr-4 pl-4'>
                        <div>
                            <img src={song.coverArtURLMedium} alt={song.trackName} className='rounded-sm w-48 h-48' />
                        </div>
                        <div className='flex flex-col justify-end'>
                            <h1>Single</h1>
                            <h1 className={`font-extrabold ${getTrackNameClass(song.trackName)}`}>{song.trackName}</h1>
                            <div className='flex flex-row pt-4 text-sm antialiased'>
                                <h1 className='font-semibold'>{song.artistName}</h1>
                                {spotifyDetails && (
                                    <div className='flex flex-row text-zinc-400'>
                                        <h1>&nbsp;•&nbsp;</h1>
                                        <h1>{new Date(spotifyDetails.album.release_date).getFullYear()}</h1>
                                        <h1>&nbsp;•&nbsp;</h1>
                                        <h1>{durationString(spotifyDetails.duration_ms)}</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='relative z-10 pr-4 pl-4 pt-8'>
                    <h2 className='font-semibold text-lg'>Listening Data</h2>
                    <div className='flex flex-col space-y-2'>
                        <div className='flex flex-row space-x-8'>
                            <div>
                                <h3 className='font-semibold'>Total Listens</h3>
                                <p>{totalListens}</p>
                            </div>
                            <div>
                                <h3 className='font-semibold'>Total Minutes Listened</h3>
                                <p>{totalMinutesListened} min</p>
                            </div>
                        </div>
                        <div className='flex flex-row space-x-8'>
                            <div>
                                <h3 className='font-semibold'>Month Most Listened</h3>
                                <p>Month: {mostListenedMonth.month}</p>
                                <p>Minutes Listened: {mostListenedMonth.minutes} min</p>
                                <p>Times Listened: {mostListenedMonth.times} times</p>
                            </div>
                            <div>
                                <h3 className='font-semibold'>Day Most Listened</h3>
                                <p>Day: {mostListenedDay.day}</p>
                                <p>Minutes Listened: {mostListenedDay.minutes} min</p>
                                <p>Times Listened: {mostListenedDay.times} times</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='relative z-10 pr-4 pl-4 pt-8 pb-4'>
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
        </div>
    );
};

export default SongDetails;