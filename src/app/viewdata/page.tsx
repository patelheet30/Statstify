"use client";

import Navbar from "@/components/NavBar";
import { useUser } from "@/lib/User";
import { useEffect, useState } from "react";
import { gatherMapData } from "@/lib/dbutils";
import { Song } from "@/lib/entities";
import SongCard from "@/components/SongCard";
import { ChartBarDecreasing } from "lucide-react";

export default function ViewData() {
  const { user } = useUser();
  const [songs, setSongs] = useState<Song[]>([]);

  const topfifty = songs.slice(0, 50);

  useEffect(() => {
    if (!user) {
      console.error("User not found");
    }
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      const data = await gatherMapData("songs");
      setSongs(data);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-full flex flex-col h-screen p-2 overflow-hidden space-y-2">
      <div>
        <Navbar user={user} />
      </div>
      <div className="flex flex-row space-x-2 h-screen overflow-hidden">
        <div className="bg-neutral-900 rounded-lg overflow-auto flex-shrink-0 p-2 space-y-2">
          <div className="flex flex-row items-center space-x-4 ml-4">
            <ChartBarDecreasing size={36} className="stroke-zinc-400"/>
            <h2 className="font-semibold text-zinc-400">Your Top Stats</h2>
          </div>
          <div>
            {topfifty.map((song) => (
              <SongCard
                key={song.trackID}
                cover="N/A"
                trackName={song.trackName}
                artistName={song.artistName}
                listeningTime={Math.floor(song.msPlayed / 60000)}
              />)
            )}
          </div>
        </div>
        <div className="bg-neutral-900 rounded-lg flex-1 overflow-auto flex-grow">
          <h2>Information</h2>
        </div>
      </div>
    </div>
  );
}