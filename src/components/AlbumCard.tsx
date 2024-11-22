/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface AlbumCardProps {
    albumName: string;
    albumCover: string;
    listeningTime: number;
    releaseDate: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ albumName, albumCover, listeningTime, releaseDate }) => {
    const placeHolderImage = `static/placeholdercover.jpg`

    const numberFormatter = new Intl.NumberFormat("en-US");

    return (
        <div className="flex items-center rounded-lg p-2 max-w-80 hover:border-none hover:bg-[#1f1f1f]">
            <img src={albumCover !== "N/A" ? albumCover : placeHolderImage} alt="Album cover" className="w-16 h-16 rounded-md mr-4" />
            <div className="flex flex-col flex-grow overflow-hidden space-y-1">
                <h3 className="text-base font-medium antialiased truncate">{albumName}</h3>
                <p className="text-sm antialiased truncate">{numberFormatter.format(listeningTime)} minutes • {releaseDate}</p>
            </div>
        </div>
    );
};

export default AlbumCard;