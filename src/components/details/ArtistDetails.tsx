/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import { Artist } from '@/lib/entities';
import MonthBreakdown from '@/components/MonthBreakdown';
import { Clock3, CalendarCog } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
    PaginationLink,
} from '@/components/ui/pagination';

interface ArtistDetailsProps {
    artist: Artist;
}

const ArtistDetails: React.FC<ArtistDetailsProps> = ({ artist }) => {
    const [timeScale, setTimescale] = useState<string>('monthly');
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [spotifyDetails, setSpotifyDetails] = useState<any>(null);

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

    const getArtistNameClass = (name: string) => {
        if (name.length <= 10) return 'text-8xl';
        if (name.length <= 20) return 'text-6xl';
        if (name.length <= 30) return 'text-4xl';
        return 'text-2xl';
    };

    const [currentPage, setCurrentPage] = useState(1);
    const songsPerPage = 20
    const totalPages = Math.ceil(artist.songsListened.length / songsPerPage);

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = artist.songsListened.slice(indexOfFirstSong, indexOfLastSong);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderPaginationItems = () => {
        const items = []
        const maxVisiblePages = 5
        const ellipsisThreshold = 2

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - ellipsisThreshold && i <= currentPage + ellipsisThreshold) ||
                (currentPage <= maxVisiblePages && i <= maxVisiblePages) ||
                (currentPage > totalPages - maxVisiblePages && i > totalPages - maxVisiblePages)
            ) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={currentPage === i}
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(i)
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                )
            } else if (
                (i === currentPage - ellipsisThreshold - 1 && currentPage > maxVisiblePages) ||
                (i === currentPage + ellipsisThreshold + 1 && currentPage <= totalPages - maxVisiblePages)
            ) {
                items.push(
                    <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                )
            }
        }

        return items
    }

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
                <div className='relative'>
                    <img
                        src={artist.artistURLLarge}
                        alt={artist.name}
                        className='h-96 w-full object-cover'
                    />
                    <div className='absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent w-full'>
                        <p>Artist</p>
                        <h1 className={`font-extrabold ${getArtistNameClass(artist.name)}`}>{artist.name}</h1>
                        <p className='text-lg text-white'>{artist.followers.toLocaleString()} followers</p>
                    </div>
                </div>
                <div className='relative z-10 pr-4 pl-4 pt-8 pb-4'>
                    <h2 className='font-semibold text-lg pb-2'>Artist Songs</h2>
                    <div className='flex flex-row justify-between pr-5 antialiased pb-2 pl-4 border-t-0 border-l-o border-r-0 border-b-2'>
                        <span className='text-zinc-400'>Title</span>
                        <div className='text-zinc-400 antialiased flex flex-row items-center space-x-16'>
                            <span>Time Listened</span>
                            <span><Clock3 /></span>
                        </div>
                    </div>
                    <ul className='pt-2 pb-4'>
                        {currentSongs.map((song) => (
                            <li className='pr-4 pl-4 hover:border-none hover:bg-zinc-800 pt-1 pb-1 hover:rounded-md' key={song.trackID}>
                                <div className='flex justify-between'>
                                    <div>
                                        <span>{song.trackName}</span>
                                    </div>
                                    <div className='flex flex-row items-center'>
                                        <span>{formatLengthOfSong(song.msPlayed)}</span>
                                        <div className='min-w-[5.9rem] text-end'>{formatLengthOfSong(song.duration)}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage > 1) handlePageChange(currentPage - 1)
                                    }}
                                />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage < totalPages) handlePageChange(currentPage + 1)
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
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
                    {Array.isArray(artist.whenPlayed) ? (
                        <MonthBreakdown whenPlayed={artist.whenPlayed} timeScale={timeScale} />
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtistDetails;