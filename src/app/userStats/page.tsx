"use client";

import Navbar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { gatherMapData } from "@/lib/dbutils";
import { Song, Artist, Album, User } from "@/lib/entities";
import SongCard from "@/components/SongCard";
import ArtistCard from "@/components/ArtistCard";
import AlbumCard from "@/components/AlbumCard";
import { ChartBarDecreasing, X, Search } from "lucide-react";
import { useRef } from "react";
import SongDetails from "@/components/details/SongDetails";
import ArtistDetails from "@/components/details/ArtistDetails";
import AlbumDetails from "@/components/details/AlbumDetails";

export default function ViewData() {
  const [user, setUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filter, setFilter] = useState<"None" | "Song" | "Artist" | "Album">("None");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Song | Artist | Album | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      const userData = await gatherMapData("user");
      setUser(userData.user[0]);
      const songData = await gatherMapData("songs");
      setSongs(songData);
      const artistData = await gatherMapData("artists");
      setArtists(artistData);
      const albumData = await gatherMapData("albums");
      setAlbums(albumData);
    }
    fetchData();
  }, []);

  const filteredSongs = songs.filter((song) => song.trackName.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredArtists = artists.filter((artist) => artist.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredAlbums = albums.filter((album) => album.albumName.toLowerCase().includes(searchTerm.toLowerCase()));

  const viewableSongs = filteredSongs.slice(0, 25);
  const viewableArtists = filteredArtists.slice(0, 25);
  const viewableAlbums = filteredAlbums.slice(0, 25);

  const handleItemClick = (item: Song | Artist | Album) => {
    setSelectedItem(item);
  }

  const getMsPlayedForSong = (songId: string) => {
    const song = songs.find((song) => song.trackID === songId);
    return song ? song.msPlayed : 0;
  };

  return (
    <div className="max-w-full flex flex-col h-screen p-2 overflow-hidden space-y-2">
      <div className="flex-shrink-0">
        <Navbar user={user} />
      </div>
      <div className="flex flex-row space-x-2 h-screen overflow-hidden antialiased text-white">
        <div className="bg-neutral-900 rounded-lg flex-shrink-0 flex flex-col space-y-2 w-[25%]">
          <div className="flex flex-row items-center space-x-4 ml-4 mt-2 mb-4 pt-2 pl-2 flex-shrink-0">
            <ChartBarDecreasing size={36} className="stroke-zinc-400" />
            <h2 className="font-semibold text-zinc-400">Your Stats</h2>
          </div>
          <div className="flex flex-row items-center space-x-2 ml-2 pl-2 flex-shrink-0">
            {filter !== "None" && (
              <button
                className="bg-zinc-800 text-zinc-400 px-2 py-2 rounded-full hover:bg-zinc-700"
                onClick={() => setFilter("None")}
              >
                <X size={20} />
              </button>
            )}
            {(filter === "None" || filter === "Song") && (
              <button
                className={`px-4 py-2 rounded-full text-sm ${filter === "Song" ? "bg-white text-black" : "bg-zinc-800 text-white"}`}
                onClick={() => setFilter("Song")}
              >
                Song
              </button>
            )}
            {(filter === "None" || filter === "Artist") && (
              <button
                className={`px-4 py-2 rounded-full text-sm ${filter === "Artist" ? "bg-white text-black" : "bg-zinc-800 text-white"}`}
                onClick={() => setFilter("Artist")}
              >
                Artist
              </button>
            )}
            {(filter === "None" || filter === "Album") && (
              <button
                className={`px-4 py-2 rounded-full text-sm ${filter === "Album" ? "bg-white text-black" : "bg-zinc-800 text-white"}`}
                onClick={() => setFilter("Album")}
              >
                Album
              </button>
            )}
          </div>
          <div className="space-y-2 pl-2 overflow-auto flex-grow custom-scrollbar">
            <div className="flex flex-row items-center space-x-4 ml-2">
              {isSearchVisible || searchTerm ? (
                <div className="flex items-center space-x-2 w-full max-w-[60%]">
                  <div className="flex flex-row items-center w-full space-x-3 border-none bg-zinc-800 rounded-md">
                    <div className="pl-3 py-2">
                      <Search size={20} className="text-zinc-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-none bg-transparent flex-grow w-full focus:outline-none text-zinc-300 text-sm antialiased"
                      onBlur={() => {
                        if (!searchTerm) setIsSearchVisible(false);
                      }}
                      ref={inputRef}
                    />
                    {searchTerm && (
                      <button
                        className="pr-3"
                        onClick={() => {
                          setSearchTerm("");
                          setIsSearchVisible(false);
                        }}
                      >
                        <X size={20} className="text-zinc-400" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  className="text-zinc-400 p-2"
                  onClick={() => {
                    setIsSearchVisible(true);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                >
                  <Search size={20} />
                </button>
              )}
            </div>
            <div>
              {(filter === "None" || filter === "Song") && viewableSongs.map((song) => (
                <div key={song.trackID} onClick={() => handleItemClick(song)}>
                  <SongCard
                    key={song.trackID}
                    cover={song.coverArtURLSmall}
                    trackName={song.trackName}
                    artistName={song.artistName}
                    listeningTime={Math.floor(song.msPlayed / 60000)}
                  />
                </div>
              )
              )}
            </div>
            <div>
              {(filter === "None" || filter === "Artist") && viewableArtists.map((artist) => (
                <div key={artist.id} onClick={() => handleItemClick(artist)}>
                  <ArtistCard
                    key={artist.id}
                    artistName={artist.name}
                    artistImage={artist.artistURLSmall}
                    listeningTime={Math.floor(artist.msPlayed / 60000)}
                    followers={artist.followers}
                  />
                </div>
              )
              )}
            </div>
            <div>
              {(filter === "None" || filter === "Album") && viewableAlbums.map((album) => (
                <div key={album.albumID} onClick={() => handleItemClick(album)}>
                  <AlbumCard
                    key={album.albumID}
                    albumName={album.albumName}
                    albumCover={album.albumURLSmall}
                    listeningTime={Math.floor(album.msPlayed / 60000)}
                    releaseDate={album.releaseDate}
                  />
                </div>
              )
              )}
            </div>
          </div>
        </div>
        <div className="bg-neutral-900 rounded-lg overflow-auto flex-grow w-[75%]">
          {selectedItem && (
            <div>
              {selectedItem.hasOwnProperty('trackName') && (
                <SongDetails song={selectedItem as Song} />
              )}
              {selectedItem.hasOwnProperty('followers') && (
                <ArtistDetails artist={selectedItem as Artist} />
              )}
              {selectedItem.hasOwnProperty('totalTracks') && (
                <AlbumDetails album={selectedItem as Album} getMsPlayedForSong={getMsPlayedForSong} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}