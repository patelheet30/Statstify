/* eslint-disable @next/next/no-img-element */
import React from "react";

interface SongCardProps {
    cover: string;
    trackName: string;
    artistName: string;
    listeningTime: number;
}

const SongCard: React.FC<SongCardProps> = ({ cover, trackName, artistName, listeningTime }) => {
    const placeHolderImage = `static/placeholdercover.jpg`

    return (
        <div className="flex items-center rounded-lg p-2 max-w-80 hover:border-none hover:bg-[#1f1f1f]">
            <img src={cover !== "N/A" ? cover : placeHolderImage} alt="Song cover" className="w-16 h-16 rounded-md mr-4" />
            <div className="flex flex-col flex-grow overflow-hidden">
                <h3 className="text-base font-medium antialiased truncate">{trackName}</h3>
                <p className="text-sm antialiased">{artistName} • {listeningTime} minutes</p>
            </div>
        </div>
    );
};

export default SongCard;