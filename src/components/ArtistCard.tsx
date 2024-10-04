/* eslint-disable @next/next/no-img-element */
import React from "react";

interface ArtistCardProps {
    artistName: string;
    artistImage: string;
    listeningTime: number;
    followers: number;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artistName, artistImage, listeningTime, followers }) => {
    const placeHolderImage = `static/placeholdercover.jpg`

    const numberFormatter = new Intl.NumberFormat("en-US");
    
    return (
        <div className="flex items-center rounded-lg p-2 max-w-80 hover:border-none hover:bg-[#1f1f1f]">
            <img src={artistImage !== "N/A" ? artistImage : placeHolderImage} alt="Artist cover" className="w-16 h-16 rounded-md mr-4" />
            <div className="flex flex-col flex-grow overflow-hidden space-y-1">
                <h3 className="text-base font-medium antialiased truncate">{artistName}</h3>
                <p className="text-sm antialiased truncate">{numberFormatter.format(listeningTime)} minutes • {numberFormatter.format(followers)} followers</p>
            </div>
        </div>
    );
};

export default ArtistCard;