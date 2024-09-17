"use client";

import Navbar from "@/components/NavBar";
import { useUser } from "@/lib/User";
import { useEffect } from "react";

export default function ViewData() {
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            console.error("User not found");
        }
    }, [user]);

  return (
    <div className="max-w-full max-h-full p-2">
      <Navbar user={user} />
    </div>
  );
}