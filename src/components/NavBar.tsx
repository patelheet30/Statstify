"use client";

/* eslint-disable @next/next/no-img-element */
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { format } from "date-fns";
import { User } from "@/lib/entities";

interface NavBarProps {
    user: User | null;
}


const Navbar: React.FC<NavBarProps> = ({ user }) => {

    const [search, setSearch] = useState("");

    const formatDate = (dateUnformat: string | undefined) => {
        if (!dateUnformat) return "N/A";
        const dateFormat = new Date(dateUnformat);
        return format(dateFormat, "do MMM yyyy");
    }

    return (
        <nav>
            <ul className="place-content-between flex flex-row">
                <li>
                    <img src={`/static/logo.png`} alt="logo" className="size-14" />
                </li>
                <li className="min-w-96 content-center">
                    <form role="search" className="flex flex-row items-center w-full space-x-3 border-none bg-zinc-800 rounded-full">
                        <div className="pl-3 py-2">
                            <Search size={32} />
                        </div>
                        <input
                            type="search"
                            placeholder="What do you want to look up?"
                            className="border-none bg-transparent flex-grow w-full focus:outline-none remove-clear-button"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && <button onClick={() => setSearch("")} className="pr-3"><X size={32} className="text-zinc-400" /></button>}
                    </form>
                </li>
                <li>
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <img
                                src={user?.pfpURL || "/static/Default_pfp.svg.png"}
                                alt="logo"
                                className="size-14 border-8 rounded-full border-zinc-700 p-1"
                            />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 mr-2">
                            <p className="text-white">Name: {user?.name}</p>
                            <p className="text-white">Email: {user?.email}</p>
                            <p className="text-white">Birthdate: {formatDate(user?.birthdate)}</p>
                            <p className="text-white">Age: {user?.age}</p>
                            <p className="text-white">Acc Create Date: {formatDate(user?.accountCreationDate)}</p>
                            <p className="text-white">Gender: {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "N/A"}</p>
                        </HoverCardContent>
                    </HoverCard>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;